import { Badge, PrismaClient } from '@prisma/client';
import { authMiddleware, NextApiRequestWithSession } from 'lib/auth';
import { ErrorResponse } from 'lib/types';
import { NextApiResponse } from 'next';
import { createRouter } from 'next-connect';
import withJoi from 'next-joi';
import Joi from 'joi';

const patchSchema = {
  body: Joi.object({
    handle: Joi.string(),
    photo: Joi.string(),
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

  const badge = await prisma.badge.update({
    where: {
      tokenId: 0,
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
