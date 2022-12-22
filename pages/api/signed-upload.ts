import { NextApiHandler } from "next";
import { Storage } from "@google-cloud/storage";
import { add } from "date-fns";
import { v4 as uuid } from "uuid";
import mime from "mime-types";
import { storageConfig } from "lib/config/gcp";
import { withIronSessionApiRoute } from "iron-session/next";
import { ironOptions } from "lib/config/ironSession";
import { hasBadge } from "lib/utils";
import { uploadRequest } from "lib/models";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

const storage = new Storage(storageConfig);

const postHandler: NextApiHandler = async (req, res) => {
  if (!(await hasBadge(req.session.address)))
    return res.status(401).send("Unauthorized");

  try {
    const { type } = uploadRequest.parse(req.body);

    const filename = `${uuid()}.${mime.extension(type)}`;
    const file = storage.bucket("badge-user-images").file(filename);

    const [signedUrl] = await file.getSignedUrl({
      version: "v4",
      action: "write",
      contentType: type,
      expires: add(new Date(), { minutes: 10 }),
    });

    const publicUrl = file.publicUrl();

    return res.json({ filename, signedUrl, publicUrl });
  } catch (_error) {
    if (_error instanceof ZodError)
      return res.status(400).send(fromZodError(_error));

    console.error(_error);
    res.status(500).send("Internal Server Error");
  }
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
