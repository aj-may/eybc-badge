import { PrismaClient } from '@prisma/client';
import { ErrorResponse } from 'lib/types';
import type { NextApiRequest, NextApiResponse } from 'next';
import { createRouter } from 'next-connect';

type MetadataResponse = {
  name: string,
  description: string,
  image: string,
  animation_url: string,
  attributes: [
    {
      trait_type: 'Badge Number',
      value: string,
    }
  ]
}

const prisma = new PrismaClient();
const router = createRouter<NextApiRequest, NextApiResponse<MetadataResponse | ErrorResponse>>();

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

  return res.json({
    name: badge.handle,
    description: '',
    image: 'https://badge.eybc.xyz/img/placeholder.png',
    animation_url: `https://badge.eybc.xyz/badges/${badge.tokenId}`,
    attributes: [
      {
        trait_type: 'Badge Number',
        value: badge.tokenId.toString().padStart(5, '0'),
      },
    ],
  });
});

export default router.handler();