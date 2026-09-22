import { Router, type IRouter, type Request, type Response } from "express";
import { and, desc, eq } from "drizzle-orm";
import {
  CreateClientDocumentBody,
  CreateClientDocumentParams,
  CreateClientDocumentResponse,
  CreateDocumentRequestBody,
  CreateDocumentRequestParams,
  CreateDocumentRequestResponse,
  SendCampaignBody,
  SendCampaignResponse,
  DeleteClientDocumentParams,
  GetAdminClientParams,
  GetAdminClientResponse,
  GetOdooStatusResponse,
  ListAdminClientsResponse,
  ListClientDocumentsParams,
  ListClientDocumentsResponse,
  ListDocumentRequestsParams,
  ListDocumentRequestsResponse,
  SyncOdooClientBody,
  UpdateClientDocumentBody,
  UpdateClientDocumentParams,
  UpdateClientDocumentResponse,
} from "@workspace/api-zod";
import {
  adminClientsTable,
  clientDocumentsTable,
  db,
  documentRequestsTable,
  integrationStateTable,
} from "@workspace/db";
import {
  requireCampaignAccess,
  requireFullAccess,
  requireStaff,
  type AdminRequest,
} from "../middlewares/adminAuth";
import { ObjectNotFoundError, ObjectStorageService } from "../lib/objectStorage";

const router: IRouter = Router();
const storage = new ObjectStorageService();
router.get("/admin/me", requireStaff, async (req: Request, res: Response): Promise<void> => {
  res.json({ role: "public_admin" });
});

router.post("/admin/campaigns/send", requireCampaignAccess, async (req: Request, res: Response): Promise<void> => {
  const parsed = SendCampaignBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Campaign title and message are required." });
    return;
  }
  const title = parsed.data.title.trim();
  const message = parsed.data.message.trim();
  const objectPath = parsed.data.objectPath?.trim() ?? "";
  if (!title || !message) {
    res.status(400).json({ error: "Campaign title and message are required." });
    return;
  }
  if (objectPath && (!objectPath.startsWith("/objects/uploads/") || objectPath.includes(".."))) {
    res.status(400).json({ error: "Invalid campaign poster path." });
    return;
  }

  if (objectPath) {
    try {
      await storage.getObjectEntityFile(objectPath);
    } catch (error) {
      if (error instanceof ObjectNotFoundError) {
        res.status(404).json({ error: "The campaign poster could not be found." });
        return;
      }
      req.log.error({ err: error }, "Campaign poster validation failed");
      res.status(500).json({ error: "The campaign poster could not be validated." });
      return;
    }
  }

  const deliveryUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
  res.json(SendCampaignResponse.parse({
    success: true,
    status: "handoff_ready",
    channel: "whatsapp",
    deliveryUrl,
    message: "Campaign approved. WhatsApp is ready for the final send.",
  }));
});

router.get("/admin/clients", requireFullAccess, async (_req: Request, res: Response): Promise<void> => {
  const clients = await db.select().from(adminClientsTable).orderBy(adminClientsTable.name);
  res.json(ListAdminClientsResponse.parse(clients));
});

router.get("/admin/clients/:clientId", requireFullAccess, async (req: Request, res: Response): Promise<void> => {
  const params = GetAdminClientParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: "Invalid client ID" });
    return;
  }
  const [client] = await db.select().from(adminClientsTable).where(eq(adminClientsTable.id, params.data.clientId)).limit(1);
  if (!client) {
    res.status(404).json({ error: "Client not found" });
    return;
  }
  res.json(GetAdminClientResponse.parse(client));
});

router.get("/admin/clients/:clientId/documents", requireFullAccess, async (req: Request, res: Response): Promise<void> => {
  const params = ListClientDocumentsParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: "Invalid client ID" });
    return;
  }
  const documents = await db.select().from(clientDocumentsTable)
    .where(eq(clientDocumentsTable.clientId, params.data.clientId))
    .orderBy(desc(clientDocumentsTable.updatedAt));
  res.json(ListClientDocumentsResponse.parse(documents));
});

router.post("/admin/clients/:clientId/documents", requireFullAccess, async (req: Request, res: Response): Promise<void> => {
  const params = CreateClientDocumentParams.safeParse(req.params);
  const body = CreateClientDocumentBody.safeParse(req.body);
  if (!params.success || !body.success) {
    res.status(400).json({ error: "Invalid document metadata" });
    return;
  }
  const uploadedBy = (req as AdminRequest).authUserId ?? "unknown";
  const [document] = await db.insert(clientDocumentsTable).values({
    ...body.data,
    expiresAt: body.data.expiresAt?.toISOString().slice(0, 10) ?? null,
    clientId: params.data.clientId,
    uploadedBy,
  }).returning();
  res.status(201).json(CreateClientDocumentResponse.parse(document));
});

router.patch("/admin/documents/:documentId", requireFullAccess, async (req: Request, res: Response): Promise<void> => {
  const params = UpdateClientDocumentParams.safeParse(req.params);
  const body = UpdateClientDocumentBody.safeParse(req.body);
  if (!params.success || !body.success) {
    res.status(400).json({ error: "Invalid document update" });
    return;
  }
  const patch = {
    ...body.data,
    expiresAt: body.data.expiresAt === undefined
      ? undefined
      : body.data.expiresAt?.toISOString().slice(0, 10) ?? null,
  };
  const [document] = await db.update(clientDocumentsTable).set(patch)
    .where(eq(clientDocumentsTable.id, params.data.documentId)).returning();
  if (!document) {
    res.status(404).json({ error: "Document not found" });
    return;
  }
  res.json(UpdateClientDocumentResponse.parse(document));
});

router.delete("/admin/documents/:documentId", requireFullAccess, async (req: Request, res: Response): Promise<void> => {
  const params = DeleteClientDocumentParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: "Invalid document ID" });
    return;
  }
  const [document] = await db.delete(clientDocumentsTable)
    .where(eq(clientDocumentsTable.id, params.data.documentId)).returning();
  if (!document) {
    res.status(404).json({ error: "Document not found" });
    return;
  }
  try {
    const file = await storage.getObjectEntityFile(document.objectPath);
     await storage.deleteObject(file);
  } catch (error) {
    req.log.warn({ err: error, documentId: document.id }, "Document metadata deleted but stored object cleanup failed");
  }
  res.sendStatus(204);
});

router.get("/admin/clients/:clientId/document-requests", requireFullAccess, async (req: Request, res: Response): Promise<void> => {
  const params = ListDocumentRequestsParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: "Invalid client ID" });
    return;
  }
  const requests = await db.select().from(documentRequestsTable)
    .where(eq(documentRequestsTable.clientId, params.data.clientId))
    .orderBy(desc(documentRequestsTable.sentAt));
  res.json(ListDocumentRequestsResponse.parse(requests));
});

router.post("/admin/clients/:clientId/document-requests", requireFullAccess, async (req: Request, res: Response): Promise<void> => {
  const params = CreateDocumentRequestParams.safeParse(req.params);
  const body = CreateDocumentRequestBody.safeParse(req.body);
  if (!params.success || !body.success) {
    res.status(400).json({ error: "Select at least one document and provide a message" });
    return;
  }
  const [request] = await db.insert(documentRequestsTable).values({
    ...body.data,
    clientId: params.data.clientId,
    sentBy: (req as AdminRequest).authUserId ?? "unknown",
    deliveryStatus: "logged",
  }).returning();
  res.status(201).json(CreateDocumentRequestResponse.parse(request));
});

router.get("/admin/integrations/odoo/status", requireFullAccess, async (_req: Request, res: Response): Promise<void> => {
  const [state] = await db.select().from(integrationStateTable)
    .where(eq(integrationStateTable.provider, "odoo")).limit(1);
  res.json(GetOdooStatusResponse.parse({
    enabled: state?.enabled === 1,
    connected: state?.connected === 1,
    message: state?.message ?? "Odoo authorization was not completed. Connect Odoo to enable sync.",
    lastSyncAt: state?.lastSyncAt ?? null,
  }));
});

router.post("/admin/integrations/odoo/sync", requireFullAccess, async (req: Request, res: Response): Promise<void> => {
  const body = SyncOdooClientBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: "Invalid client ID" });
    return;
  }
  const [state] = await db.select().from(integrationStateTable)
    .where(and(eq(integrationStateTable.provider, "odoo"), eq(integrationStateTable.connected, 1))).limit(1);
  if (!state) {
    res.status(409).json({ error: "Odoo is disconnected. Authorize the Odoo integration before syncing clients." });
    return;
  }
  res.json({ success: false, message: "Odoo connector is enabled but no sync adapter has been attached.", externalId: null });
});

export default router;