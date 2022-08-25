import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

type MetadataResponse = {
  name: string,
  description: string,
  image: string,
  background_color: string,
  attributes: [
    {
      trait_type: 'Email',
      value: string,
    }
  ]
}

type ErrorResponse = {
  error: string,
};

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MetadataResponse | ErrorResponse>
) {
  const { tokenId } = req.query;

  if (!tokenId || typeof tokenId !== 'string')
    return res.status(404).json({ error: "Not Found" });

  const badge = await prisma.badge.findUnique({
    where: {
      tokenId: parseInt(tokenId),
    },
  })

  if (!badge)
    return res.status(404).json({ error: "Not Found" });

  res.json({
    name: badge.handle,
    description: '', // TODO: allow users to set a bio for this field
    image: `https://badge.eybc.xyz/api/badge-images/${badge.tokenId}.png`,
    background_color: '#ffffe3',
    attributes: [
      {
        trait_type: 'Email',
        value: badge.email,
      },
    ],
  });
}
