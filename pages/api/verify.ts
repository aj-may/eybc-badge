import { PrismaClient } from "@prisma/client";
import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiHandler } from "next";
import { ironOptions } from "lib/config/ironSession";
import { addressSchema, verifyOtpSchema } from "lib/models";
import { fromZodError } from "zod-validation-error";

const prisma = new PrismaClient();

const postHandler: NextApiHandler = async (req, res) => {
  const parsedAddress = addressSchema.safeParse(req.session.address);
  if (!parsedAddress.success) return res.status(401).send("Unauthorized");

  const parsedBody = verifyOtpSchema.safeParse(req.body);
  if (!parsedBody.success)
    return res.status(400).send(fromZodError(parsedBody.error));

  const address = parsedAddress.data;
  const { otp } = parsedBody.data;
  const now = new Date();
  const badge = await prisma.badge.findUnique({
    where: { address },
    select: { otp: true },
  });

  if (!badge) return res.status(401).send("Unauthorized");

  if (!badge.otp || now > badge.otp.expires || otp !== badge.otp.code)
    return res.status(400).send("Invalid OTP");

  const result = await prisma.badge.update({
    where: { address },
    data: {
      status: "PENDING",
      otp: null,
    },
  });

  res.json(result);
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
