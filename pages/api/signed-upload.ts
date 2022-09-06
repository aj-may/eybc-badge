import { authMiddleware, NextApiRequestWithSession } from 'lib/auth';
import { ErrorResponse } from 'lib/types';
import { NextApiResponse } from 'next';
import { createRouter } from 'next-connect';
import withJoi from 'next-joi';
import Joi from 'joi';
import { Storage } from '@google-cloud/storage';
import { add } from 'date-fns';
import { v4 as uuid } from 'uuid';
import mime from 'mime-types';

const storage = new Storage({
  projectId: process.env.GOOGLE_PROJECT_ID,
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY,
  }
});

const postSchema = {
  body: Joi.object({
    type: Joi.string().required(),
  }),
};

const validate = withJoi();
const router = createRouter<NextApiRequestWithSession, NextApiResponse<any | ErrorResponse>>();

router.use(authMiddleware);

router.post(validate(postSchema), async (req, res) => {
  const filename = `${uuid()}.${mime.extension(req.body.type)}`;

  const file = storage
    .bucket('badge-user-images')
    .file(filename);

  const [signedUrl] = await file.getSignedUrl({
    version: 'v4',
    action: 'write',
    contentType: req.body.type,
    expires: add(new Date(), { minutes: 10 }),
  });

  const publicUrl = file.publicUrl();

  return res.json({ filename, signedUrl, publicUrl });
});

router.all((req, res) => {
  return res.status(405).json({
    error: "Method not allowed",
  });
})

export default router.handler();
