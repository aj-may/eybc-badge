import { PrismaClient } from "@prisma/client";
import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiHandler } from "next";
import { Storage } from "@google-cloud/storage";
import { ironOptions } from "lib/config/ironSession";
import { storageConfig } from "lib/config/gcp";
import { addressSchema, badgeSchema } from "lib/models";
import { fromZodError } from "zod-validation-error";
import { hasBadge } from "lib/utils";

const storage = new Storage(storageConfig);
const prisma = new PrismaClient();

const getHandler: NextApiHandler = async (req, res) => {
  const parsedSessionAddress = addressSchema.safeParse(req.session.address);
  if (!parsedSessionAddress.success)
    return res.status(401).send("Unauthorized");
  // if (!(await hasBadge(req.session.address)))
  //   return res.status(401).send("Unauthorized");

  const parsedAddress = addressSchema.safeParse(req.query.address);
  if (!parsedAddress.success)
    return res.status(400).send(fromZodError(parsedAddress.error));

  const address = parsedAddress.data;
  const badge = await prisma.badge.findUnique({
    where: { address },
    select: {
      id: true,
      handle: true,
      email: true,
      address: true,
      avatar: true,
      status: true,
    },
  });

  if (!badge) return res.status(404).send("Not Found");
  if (address !== badge.address) return res.status(401).send("Unauthorized");

  res.json(badge);
};

const patchHandler: NextApiHandler = async (req, res) => {
  const parsedAddress = addressSchema.safeParse(req.query.address);
  if (!parsedAddress.success)
    return res.status(400).send(fromZodError(parsedAddress.error));

  const parsedBody = badgeSchema
    .pick({ handle: true, avatar: true })
    .partial()
    .safeParse(req.body);
  if (!parsedBody.success)
    return res.status(400).send(fromZodError(parsedBody.error));

  const address = parsedAddress.data;
  const body = parsedBody.data;

  if (!(await hasBadge(req.session.address)) || address !== req.session.address)
    return res.status(401).send("Unauthorized");

  if (body.avatar) {
    const old = await prisma.badge.findUnique({
      where: { address },
      select: { avatar: true },
    });

    if (old?.avatar) {
      await storage
        .bucket("badge-user-images")
        .file(old.avatar.filename)
        .delete();
    }
  }

  // TODO: this can throw on unique constraints. should catch and provide error message
  const badge = await prisma.badge.update({
    where: { address },
    data: body,
  });

  return res.json(badge);
};

const handler: NextApiHandler = async (req, res) => {
  switch (req.method) {
    case "GET":
      await getHandler(req, res);
      break;

    case "PATCH":
      await patchHandler(req, res);
      break;

    default:
      res.status(405).send("Method Not Allowed");
  }
};

export default withIronSessionApiRoute(handler, ironOptions);
