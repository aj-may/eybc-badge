import { PrismaClient } from '@prisma/client';
import { createCanvas, loadImage } from 'canvas';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { tokenId } = req.query;

  if (!tokenId || typeof tokenId !== 'string')
    return res.status(404).send(null);

  const badge = await prisma.badge.findUnique({
    where: {
      tokenId: parseInt(tokenId),
    },
  })

  if (!badge)
    return res.status(404).send(null);

  const canvas = createCanvas(350, 350);
  const context = canvas.getContext('2d');
  const width = 225;
  const height = 300;
  const radius = 15;

  context.beginPath();
  context.moveTo(
    ((canvas.width-width)/2)+radius,
    (canvas.height-height)/2,
  );
  context.lineTo(
    (((canvas.width-width)/2)+width-radius),
    (canvas.height-height)/2,
  );
  context.arcTo(
    ((canvas.width-width)/2)+width,
    (canvas.height-height)/2,
    ((canvas.width-width)/2)+width,
    ((canvas.height-height)/2)+radius,
    radius,
  );
  context.lineTo(
    ((canvas.width-width)/2)+width,
    ((canvas.height-height)/2)+height-radius,
  );
  context.arcTo(
    ((canvas.width-width)/2)+width,
    ((canvas.height-height)/2)+height,
    ((canvas.width-width)/2)+width-radius,
    ((canvas.height-height)/2)+height,
    radius,
  );
  context.lineTo(
    ((canvas.width-width)/2)+radius,
    ((canvas.height-height)/2)+height,
  );
  context.arcTo(
    ((canvas.width-width)/2),
    ((canvas.height-height)/2)+height,
    ((canvas.width-width)/2),
    ((canvas.height-height)/2)+height-radius,
    radius,
  );
  context.lineTo(
    ((canvas.width-width)/2),
    ((canvas.height-height)/2)+radius,
  );
  context.arcTo(
    ((canvas.width-width)/2),
    ((canvas.height-height)/2),
    ((canvas.width-width)/2)+radius,
    (canvas.height-height)/2,
    radius,
  );
  context.save();
  context.fillStyle = '#FFF';
  context.shadowColor = 'rgba(0,0,0,0.4)';
  context.shadowBlur = 15;
  context.shadowOffsetX = 8;
  context.shadowOffsetY = 3;
  context.fill();
  context.restore();

  context.save()
  context.strokeStyle = '#000';
  context.lineWidth = 3;
  context.stroke();
  context.restore();

  context.save();
  context.beginPath();
  context.ellipse(canvas.width/2, 125, 50, 50, 0, 0, Math.PI * 2);
  context.clip();
  const image = await loadImage('https://www.fillmurray.com/100/100');
  context.drawImage(image, (canvas.width/2)-50, 75, 100, 100);
  context.restore();

  context.save();
  context.fillStyle = '#000';
  context.font = '40px sans-serif'
  context.textAlign = 'center';
  context.fillText(badge.handle, canvas.width/2, 245, width);
  context.restore();

  context.save();
  context.fillStyle = '#000';
  context.font = '16px sans-serif'
  context.textAlign = 'center';
  context.fillText(badge.email, canvas.width/2, 275, width);
  context.restore();

  const buffer = canvas.toBuffer('image/png');
  res.setHeader('Content-Type', 'image/png').send(buffer);
}
