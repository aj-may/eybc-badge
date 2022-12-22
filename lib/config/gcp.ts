import { StorageOptions } from "@google-cloud/storage";

export const storageConfig: StorageOptions = {
  projectId: process.env.GOOGLE_PROJECT_ID,
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY,
  },
};
