import { Badge, PrismaClient } from '@prisma/client';
import { authMiddleware, NextApiRequestWithSession } from 'lib/auth';
import { ErrorResponse } from 'lib/types';
import { NextApiResponse } from 'next';
import { createRouter } from 'next-connect';
import withJoi from 'next-joi';
import Joi from 'joi';
import { Storage } from '@google-cloud/storage';

const storage = new Storage({
  projectId: process.env.GOOGLE_PROJECT_ID,
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY,
  }
});

const patchSchema = {
  body: Joi.object({
    handle: Joi.string(),
    avatar: {
      filename: Joi.string(),
      url: Joi.string(),
    },
  }).min(1),
};

const validate = withJoi();

const prisma = new PrismaClient();
const router = createRouter<NextApiRequestWithSession, NextApiResponse<Badge | ErrorResponse>>();

router.use(authMiddleware);

router.get(async (req, res) => {
  const { tokenId } = req.query;

  if (!tokenId || typeof tokenId !== 'string')
    return res.status(404).json({ error: "Not Found" });

  const badge = await prisma.badge.findUnique({
    where: {
      tokenId: parseInt(tokenId),
    },
  });

  if (!badge)
    return res.status(404).json({ error: "Not Found" });

  return res.json(badge);
});

router.patch(validate(patchSchema), async (req, res) => {
  const { tokenId } = req.query;

  if (!tokenId || typeof tokenId !== 'string')
    return res.status(404).json({ error: "Not Found" });

  if (req.body.avatar) {
    const oldBadge = await prisma.badge.findUnique({
      where: {
        tokenId: parseInt(tokenId),
      },
    });

    if (oldBadge && oldBadge.avatar) {
      await storage
        .bucket('badge-user-images')
        .file(oldBadge.avatar.filename)
        .delete();
    }
  }

  const badge = await prisma.badge.update({
    where: {
      tokenId: parseInt(tokenId),
    },
    data: req.body,
  })
  return res.json(badge);
});

router.all((req, res) => {
  return res.status(405).json({
    error: "Method not allowed",
  });
})

export default router.handler();
