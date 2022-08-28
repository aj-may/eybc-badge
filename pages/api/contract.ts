import type { NextApiRequest, NextApiResponse } from 'next';

type MetadataResponse = {
  name: string,
  description: string,
  image: string,
  external_link: string,
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MetadataResponse>
) {
  res.json({
    name: 'EY Blockchain Badge',
    description: '',
    image: 'https://badge.eybc.xyz/img/placeholder.png',
    external_link: 'https://badge.eybc.xyz/',
  });
}
