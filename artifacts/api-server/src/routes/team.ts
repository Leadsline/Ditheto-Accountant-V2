import { Readable } from "node:stream";
import { asc, eq } from "drizzle-orm";
import { Router, type IRouter, type Request, type Response } from "express";
import {
  CreateTeamMemberBody,
  CreateTeamMemberResponse,
  DeleteTeamMemberParams,
  GetTeamMemberPhotoParams,
  ListTeamMembersResponse,
  UpdateTeamMemberBody,
  UpdateTeamMemberParams,
  UpdateTeamMemberResponse,
} from "@workspace/api-zod";
import { db, teamMembersTable, type TeamMemberRecord } from "@workspace/db";
import { requireSuperAdmin } from "../middlewares/adminAuth";
import { ObjectNotFoundError, ObjectStorageService } from "../lib/objectStorage";

const router: IRouter = Router();
const storage = new ObjectStorageService();

function toResponse(member: TeamMemberRecord) {
  return {
    id: member.id,
    name: member.name,
    title: member.title,
    bio: member.bio,
    email: member.email,
    phone: member.phone,
    level: member.level,
    accent: member.accent,
    parentId: member.parentId,
    sortOrder: member.sortOrder,
    imageUrl: member.imageObjectPath ? `/api/team-members/${member.id}/photo` : null,
    createdAt: member.createdAt,
    updatedAt: member.updatedAt,
  };
}

async function seedTeamIfEmpty(): Promise<void> {
  const [existing] = await db.select({ id: teamMembersTable.id }).from(teamMembersTable).limit(1);
  if (existing) return;

  const [director] = await db.insert(teamMembersTable).values({
    name: "Nomsa Mokoena",
    title: "Managing Director",
    bio: "Nomsa leads Ditheto with a practical belief that every business owner deserves clear numbers, calm guidance, and a partner who follows through.",
    email: "nomsa@dithetoaccountants.co.za",
    phone: "067 765 7387",
    level: "director",
    accent: "gold",
    parentId: null,
    sortOrder: 0,
  }).returning();

  const leads = await db.insert(teamMembersTable).values([
    {
      name: "Thabo Maseko",
      title: "Tax & Compliance Manager",
      bio: "Thabo helps clients stay ahead of SARS deadlines and turns complex compliance questions into clear next steps.",
      email: "thabo@dithetoaccountants.co.za",
      phone: "012 751 3200",
      level: "lead",
      accent: "teal",
      parentId: director.id,
      sortOrder: 0,
    },
    {
      name: "Lerato Dlamini",
      title: "Payroll Supervisor",
      bio: "Lerato oversees accurate payroll processing, EMP submissions, UIF declarations, and dependable employee support.",
      email: "lerato@dithetoaccountants.co.za",
      phone: null,
      level: "lead",
      accent: "teal",
      parentId: director.id,
      sortOrder: 1,
    },
  ]).returning();

  await db.insert(teamMembersTable).values([
    {
      name: "Siyabonga Ncube",
      title: "Senior Accountant",
      bio: "Siyabonga works alongside growing businesses on monthly accounting, management accounts, and decision-ready reporting.",
      email: "siyabonga@dithetoaccountants.co.za",
      phone: null,
      level: "team",
      accent: "navy",
      parentId: leads[0].id,
      sortOrder: 0,
    },
    {
      name: "Zanele Khumalo",
      title: "Bookkeeping Specialist",
      bio: "Zanele keeps the day-to-day detail in order so clients can focus on serving customers and building their businesses.",
      email: "zanele@dithetoaccountants.co.za",
      phone: null,
      level: "team",
      accent: "gold",
      parentId: leads[0].id,
      sortOrder: 1,
    },
    {
      name: "Mpho Radebe",
      title: "Client Services Coordinator",
      bio: "Mpho makes sure every client receives a responsive, thoughtful experience from the first enquiry to ongoing support.",
      email: "mpho@dithetoaccountants.co.za",
      phone: null,
      level: "team",
      accent: "teal",
      parentId: leads[1].id,
      sortOrder: 2,
    },
  ]);
}

router.get("/team-members", async (_req: Request, res: Response): Promise<void> => {
  await seedTeamIfEmpty();
  const members = await db.select().from(teamMembersTable)
    .orderBy(asc(teamMembersTable.sortOrder), asc(teamMembersTable.id));
  res.json(ListTeamMembersResponse.parse(members.map(toResponse)));
});

router.get("/team-members/:teamMemberId/photo", async (req: Request, res: Response): Promise<void> => {
  const params = GetTeamMemberPhotoParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: "Invalid employee ID" });
    return;
  }
  const [member] = await db.select({ imageObjectPath: teamMembersTable.imageObjectPath })
    .from(teamMembersTable)
    .where(eq(teamMembersTable.id, params.data.teamMemberId))
    .limit(1);
  if (!member?.imageObjectPath) {
    res.status(404).json({ error: "Profile photo not found" });
    return;
  }
  try {
    const file = await storage.getObjectEntityFile(member.imageObjectPath);
    const response = await storage.downloadObject(file, 3600);
    res.status(response.status);
    response.headers.forEach((value, key) => res.setHeader(key, value));
    if (response.body) {
      Readable.fromWeb(response.body as ReadableStream<Uint8Array>).pipe(res);
    } else {
      res.end();
    }
  } catch (error) {
    if (error instanceof ObjectNotFoundError) {
      res.status(404).json({ error: "Profile photo not found" });
      return;
    }
    req.log.error({ err: error, teamMemberId: params.data.teamMemberId }, "Unable to serve team profile photo");
    res.status(500).json({ error: "Unable to serve profile photo" });
  }
});

router.post("/admin/team-members", requireSuperAdmin, async (req: Request, res: Response): Promise<void> => {
  const body = CreateTeamMemberBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: "Invalid employee profile" });
    return;
  }
  const [member] = await db.insert(teamMembersTable).values(body.data).returning();
  res.status(201).json(CreateTeamMemberResponse.parse(toResponse(member)));
});

router.patch("/admin/team-members/:teamMemberId", requireSuperAdmin, async (req: Request, res: Response): Promise<void> => {
  const params = UpdateTeamMemberParams.safeParse(req.params);
  const body = UpdateTeamMemberBody.safeParse(req.body);
  if (!params.success || !body.success) {
    res.status(400).json({ error: "Invalid employee profile update" });
    return;
  }

  const [existing] = await db.select().from(teamMembersTable)
    .where(eq(teamMembersTable.id, params.data.teamMemberId)).limit(1);
  if (!existing) {
    res.status(404).json({ error: "Employee profile not found" });
    return;
  }

  const [member] = await db.update(teamMembersTable).set(body.data)
    .where(eq(teamMembersTable.id, params.data.teamMemberId)).returning();

  if (existing.imageObjectPath && body.data.imageObjectPath !== undefined && body.data.imageObjectPath !== existing.imageObjectPath) {
    try {
      const oldPhoto = await storage.getObjectEntityFile(existing.imageObjectPath);
      await oldPhoto.delete({ ignoreNotFound: true });
    } catch (error) {
      req.log.warn({ err: error, teamMemberId: existing.id }, "Employee updated but previous profile photo cleanup failed");
    }
  }

  res.json(UpdateTeamMemberResponse.parse(toResponse(member)));
});

router.delete("/admin/team-members/:teamMemberId", requireSuperAdmin, async (req: Request, res: Response): Promise<void> => {
  const params = DeleteTeamMemberParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: "Invalid employee ID" });
    return;
  }
  const [member] = await db.delete(teamMembersTable)
    .where(eq(teamMembersTable.id, params.data.teamMemberId)).returning();
  if (!member) {
    res.status(404).json({ error: "Employee profile not found" });
    return;
  }
  await db.update(teamMembersTable).set({ parentId: null })
    .where(eq(teamMembersTable.parentId, member.id));
  if (member.imageObjectPath) {
    try {
      const photo = await storage.getObjectEntityFile(member.imageObjectPath);
      await photo.delete({ ignoreNotFound: true });
    } catch (error) {
      req.log.warn({ err: error, teamMemberId: member.id }, "Employee deleted but profile photo cleanup failed");
    }
  }
  res.sendStatus(204);
});

export default router;