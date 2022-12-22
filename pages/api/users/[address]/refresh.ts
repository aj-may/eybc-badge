import { PrismaClient, Status } from "@prisma/client";
import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiHandler } from "next";
import { ironOptions } from "lib/config/ironSession";
import { addressSchema } from "lib/models";
import { fromZodError } from "zod-validation-error";
import { badgeContract } from "lib/badgeContract";
import { BigNumber, ethers } from "ethers";

const prisma = new PrismaClient();

const checkBadgeStatus = async (id: BigNumber): Promise<Status | undefined> => {
  try {
    const owner = await badgeContract.ownerOf(id);
    if (owner === ethers.constants.AddressZero) return "REVOKED";
    return "ISSUED";
  } catch (_error) {
    return undefined;
  }
};

const postHandler: NextApiHandler = async (req, res) => {
  if (!req.session.address) return res.status(401).send("Unauthorized");

  const parsedAddress = addressSchema.safeParse(req.query.address);
  if (!parsedAddress.success)
    return res.status(400).send(fromZodError(parsedAddress.error));

  const address = parsedAddress.data;

  const old = await prisma.badge.findUnique({
    where: { address },
    select: { id: true },
  });

  if (!old) return res.status(404).send("Not Found");

  const status = await checkBadgeStatus(BigNumber.from(`0x${old.id}`));

  const badge = await prisma.badge.update({
    where: { address },
    data: { status },
  });

  return res.json(badge);
};

const handler: NextApiHandler = async (req, res) => {
  switch (req.method) {
    case "POST":
      await postHandler(req, res);
      break;

    default:
      res.status(405).send("Method Not Allowed");
  }
};

export default withIronSessionApiRoute(handler, ironOptions);
