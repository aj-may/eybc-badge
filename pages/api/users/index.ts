import { PrismaClient } from "@prisma/client";
import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiHandler } from "next";
import { ironOptions } from "lib/config/ironSession";
import { addressSchema, badgeSchema } from "lib/models";
import { fromZodError } from "zod-validation-error";
import { generateOTP, hasBadgeOrIssuer } from "lib/utils";
import { MailService } from "@sendgrid/mail";

if (!process.env.SENDGRID_KEY) throw new Error("SENDGRID_KEY must be set");

const statusSchema = badgeSchema.shape.status.optional();
const prisma = new PrismaClient();
const mail = new MailService();
mail.setApiKey(process.env.SENDGRID_KEY);

const getHandler: NextApiHandler = async (req, res) => {
  if (!(await hasBadgeOrIssuer(req.session.address)))
    return res.status(401).send("Unauthorized");

  const parsedStatus = statusSchema.safeParse(req.query.status);
  if (!parsedStatus.success)
    return res.status(400).send(fromZodError(parsedStatus.error));

  const status = parsedStatus.data;
  const badges = await prisma.badge.findMany({
    where: { status },
    select: {
      id: true,
      handle: true,
      email: true,
      address: true,
      avatar: true,
      status: true,
    },
  });

  res.json(badges);
};

const postHandler: NextApiHandler = async (req, res) => {
  const parsedAddress = addressSchema.safeParse(req.session.address);
  if (!parsedAddress.success) return res.status(401).send("Unauthorized");

  const parsedBody = badgeSchema
    .pick({
      handle: true,
      email: true,
    })
    .safeParse(req.body);
  if (!parsedBody.success)
    return res.status(400).send(fromZodError(parsedBody.error));

  const address = parsedAddress.data;
  const { handle, email } = parsedBody.data;
  const otp = await generateOTP();

  // TODO: this can throw on unique constraints. should catch and provide error message
  const badge = await prisma.badge.create({
    data: { address, handle, email, otp },
    select: {
      id: true,
      handle: true,
      email: true,
      address: true,
      avatar: true,
      status: true,
    },
  });

  await mail.send({
    to: email,
    from: "badge@eyweb3.xyz",
    subject: "One time passcode for badge.eyweb3.xyz",
    text: `Your one time code for badge.eyweb3.xyz is ${otp.code}.  This code will expire in 24 hours.

    If you did not request this code you can ignore this email.`,
  });

  res.status(201).json(badge);
};

const handler: NextApiHandler = async (req, res) => {
  switch (req.method) {
    case "GET":
      await getHandler(req, res);
      break;

    case "POST":
      await postHandler(req, res);
      break;

    default:
      res.status(405).send("Method Not Allowed");
  }
};

export default withIronSessionApiRoute(handler, ironOptions);
