import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

type MetadataResponse = {
  name: string,
  description: string,
  image: string,
  email: string,
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
    description: '',
    image: 'https://badge.eybc.xyz/img/user.png',
    email: badge.email,
  });
}
