import { PrismaClient } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { badgeSchema } from "lib/models";
import type { NextApiHandler } from "next";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

const prisma = new PrismaClient();

const getHandler: NextApiHandler = async (req, res) => {
  const schema = badgeSchema.pick({ id: true });

  try {
    const { id } = schema.parse(req.query);

    const badge = await prisma.badge.findUniqueOrThrow({
      where: { id },
    });

    return res.json({
      name: badge.handle,
      description: "",
      image: "https://badge.eybc.xyz/img/placeholder.png",
      animation_url: `https://badge.eybc.xyz/badges/${badge.id}`,
      attributes: [],
    });
  } catch (_error) {
    if (_error instanceof ZodError)
      return res.status(400).send(fromZodError(_error));

    if (_error instanceof PrismaClientKnownRequestError) {
      console.error(_error);
      return res.status(404).send("Not Found");
    }

    console.error(_error);
    res.status(500).send("Internal Server Error");
  }
};

const handler: NextApiHandler = async (req, res) => {
  switch (req.method) {
    case "GET":
      await getHandler(req, res);
      break;

    default:
      res.status(405).send("Method Not Allowed");
  }
};

export default handler;
