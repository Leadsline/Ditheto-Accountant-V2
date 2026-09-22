import { Readable } from 'stream';
import {
  RequestUploadUrlBody,
  RequestUploadUrlResponse,
} from '@workspace/api-zod';
import { Router, type IRouter, type Request, type Response } from 'express';
import express from 'express';
import {
  ObjectNotFoundError,
  ObjectStorageService,
} from '../lib/objectStorage';
import {
  requireCampaignAccess,
  requireFullAccess,
} from '../middlewares/adminAuth';

const router: IRouter = Router();
const objectStorageService = new ObjectStorageService();

async function requestUploadUrl(
  req: Request,
  res: Response,
  uploadRoute = '/api/storage/uploads/put',
): Promise<void> {
  const parsed = RequestUploadUrlBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Missing or invalid required fields' });
    return;
  }

  try {
    const { name, size, contentType } = parsed.data;
    const generatedUploadURL = await objectStorageService.getObjectEntityUploadURL();
    const uploadURL = generatedUploadURL.startsWith('/api/storage/uploads/put')
      ? generatedUploadURL.replace('/api/storage/uploads/put', uploadRoute)
      : generatedUploadURL;
    const objectPath =
      generatedUploadURL.startsWith('/api/storage/uploads/put')
        ? objectStorageService.normalizeUploadObjectPath(
            new URL(generatedUploadURL, 'http://localhost').searchParams.get('object') || '',
          )
        : objectStorageService.normalizeObjectEntityPath(generatedUploadURL);

    res.json(
      RequestUploadUrlResponse.parse({
        uploadURL,
        objectPath,
        metadata: { name, size, contentType },
      }),
    );
  } catch (error) {
    req.log.error({ err: error }, 'Error generating upload URL');
    res.status(500).json({ error: 'Failed to generate upload URL' });
  }
}

/**
 * POST /storage/uploads/request-url
 *
 * Request a presigned URL for file upload.
 * The client sends JSON metadata (name, size, contentType) — NOT the file.
 * Then uploads the file directly to the returned presigned URL.
 * Requires auth middleware so public callers cannot mint write-capable URLs.
 */
router.post(
  '/storage/uploads/request-url',
  requireFullAccess,
  (req: Request, res: Response) => requestUploadUrl(req, res),
);

/**
 * Campaign posters use dedicated storage routes so marketing staff can upload
 * campaign media without gaining access to client documents or other private
 * portal uploads.
 */
router.post(
  '/storage/campaign-uploads/request-url',
  requireCampaignAccess,
  (req: Request, res: Response) =>
    requestUploadUrl(req, res, '/api/storage/campaign-uploads/put'),
);

router.put(
  '/storage/uploads/put',
  requireFullAccess,
  express.raw({ type: '*/*', limit: '25mb' }),
  async (req: Request, res: Response) => {
    const objectName = typeof req.query.object === 'string' ? req.query.object : '';
    if (!objectName || !Buffer.isBuffer(req.body)) {
      res.status(400).json({ error: 'Missing upload body or object path' });
      return;
    }
    try {
      await objectStorageService.uploadSupabaseObject(
        objectName,
        req.body,
        req.header('content-type') || 'application/octet-stream',
      );
      res.status(204).end();
    } catch (error) {
      req.log.error({ err: error }, 'Error uploading object');
      res.status(500).json({ error: 'Failed to upload object' });
    }
  },
);

router.put(
  '/storage/campaign-uploads/put',
  requireCampaignAccess,
  express.raw({ type: '*/*', limit: '25mb' }),
  async (req: Request, res: Response) => {
    const objectName = typeof req.query.object === 'string' ? req.query.object : '';
    if (!objectName.startsWith('uploads/') || objectName.includes('..') || !Buffer.isBuffer(req.body)) {
      res.status(400).json({ error: 'Missing upload body or invalid campaign object path' });
      return;
    }
    try {
      await objectStorageService.uploadSupabaseObject(
        objectName,
        req.body,
        req.header('content-type') || 'application/octet-stream',
      );
      res.status(204).end();
    } catch (error) {
      req.log.error({ err: error }, 'Error uploading campaign object');
      res.status(500).json({ error: 'Failed to upload campaign object' });
    }
  },
);

/**
 * GET /storage/public-objects/*
 *
 * Serve public assets from PUBLIC_OBJECT_SEARCH_PATHS.
 * These are unconditionally public — no authentication or ACL checks.
 * IMPORTANT: Always provide this endpoint when object storage is set up.
 */
router.get(
  '/storage/public-objects/*filePath',
  async (req: Request, res: Response) => {
    try {
      const raw = req.params.filePath;
      const filePath = Array.isArray(raw) ? raw.join('/') : raw;
      const file = await objectStorageService.searchPublicObject(filePath);
      if (!file) {
        res.status(404).json({ error: 'File not found' });
        return;
      }

      const response = await objectStorageService.downloadObject(file);

      res.status(response.status);
      response.headers.forEach((value, key) => res.setHeader(key, value));

      if (response.body) {
        const nodeStream = Readable.fromWeb(
          response.body as ReadableStream<Uint8Array>,
        );
        nodeStream.pipe(res);
      } else {
        res.end();
      }
    } catch (error) {
      req.log.error({ err: error }, 'Error serving public object');
      res.status(500).json({ error: 'Failed to serve public object' });
    }
  },
);

/**
 * GET /storage/objects/*
 *
 * Serve object entities from PRIVATE_OBJECT_DIR.
 * These are served from a separate path from /public-objects and can optionally
 * be protected with authentication or ACL checks based on the use case.
 */
router.get('/storage/objects/*path', requireFullAccess, async (req: Request, res: Response) => {
  try {
    const raw = req.params.path;
    const wildcardPath = Array.isArray(raw) ? raw.join('/') : raw;
    const objectPath = `/objects/${wildcardPath}`;
    const objectFile =
      await objectStorageService.getObjectEntityFile(objectPath);

    // --- Protected route example (uncomment when using replit-auth) ---
    // if (!req.isAuthenticated()) {
    //   res.status(401).json({ error: "Unauthorized" });
    //   return;
    // }
    // const canAccess = await objectStorageService.canAccessObjectEntity({
    //   userId: req.user.id,
    //   objectFile,
    //   requestedPermission: ObjectPermission.READ,
    // });
    // if (!canAccess) {
    //   res.status(403).json({ error: "Forbidden" });
    //   return;
    // }

    const response = await objectStorageService.downloadObject(objectFile);

    res.status(response.status);
    response.headers.forEach((value, key) => res.setHeader(key, value));

    if (response.body) {
      const nodeStream = Readable.fromWeb(
        response.body as ReadableStream<Uint8Array>,
      );
      nodeStream.pipe(res);
    } else {
      res.end();
    }
  } catch (error) {
    if (error instanceof ObjectNotFoundError) {
      req.log.warn({ err: error }, 'Object not found');
      res.status(404).json({ error: 'Object not found' });
      return;
    }
    req.log.error({ err: error }, 'Error serving object');
    res.status(500).json({ error: 'Failed to serve object' });
  }
});

router.get('/storage/campaign-objects/*path', requireCampaignAccess, async (req: Request, res: Response) => {
  try {
    const raw = req.params.path;
    const wildcardPath = Array.isArray(raw) ? raw.join('/') : raw;
    if (!wildcardPath.startsWith('uploads/') || wildcardPath.includes('..')) {
      res.status(400).json({ error: 'Invalid campaign object path' });
      return;
    }
    const objectFile = await objectStorageService.getObjectEntityFile(`/objects/${wildcardPath}`);
    const response = await objectStorageService.downloadObject(objectFile);

    res.status(response.status);
    response.headers.forEach((value, key) => res.setHeader(key, value));

    if (response.body) {
      const nodeStream = Readable.fromWeb(
        response.body as ReadableStream<Uint8Array>,
      );
      nodeStream.pipe(res);
    } else {
      res.end();
    }
  } catch (error) {
    if (error instanceof ObjectNotFoundError) {
      req.log.warn({ err: error }, 'Campaign object not found');
      res.status(404).json({ error: 'Campaign object not found' });
      return;
    }
    req.log.error({ err: error }, 'Error serving campaign object');
    res.status(500).json({ error: 'Failed to serve campaign object' });
  }
});

export default router;
