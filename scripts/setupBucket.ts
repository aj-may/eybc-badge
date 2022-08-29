import dotenv from 'dotenv';
import { Storage } from '@google-cloud/storage';

dotenv.config({ path: './.env.local' });

const { GOOGLE_PROJECT_ID, GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY } = process.env;
if (!GOOGLE_PROJECT_ID || !GOOGLE_CLIENT_EMAIL || !GOOGLE_PRIVATE_KEY)
  throw new Error('GOOGLE_CLOUD_CREDENTIALS not set in env');

const storage = new Storage({
  projectId: GOOGLE_PROJECT_ID,
  credentials: {
    client_email: GOOGLE_CLIENT_EMAIL,
    private_key: GOOGLE_PRIVATE_KEY,
  }
});

async function main() {
  await storage.bucket('badge-user-images').setCorsConfiguration([
    {
      origin: ['*'],
      method: ['GET'],
      maxAgeSeconds: 3600,
    },
  ]);
  console.log('Success! 🎉');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
})