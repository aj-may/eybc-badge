import { IronSessionOptions } from "iron-session";

const { IRON_SESSION_PASSWORD } = process.env;

if (!IRON_SESSION_PASSWORD)
  throw new Error("IRON_SESSION_PASSWORD must be set");

export const ironOptions: IronSessionOptions = {
  password: IRON_SESSION_PASSWORD,
  cookieName: "session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};

declare module "iron-session" {
  interface IronSessionData {
    address?: string | undefined;
    nonce?: string | undefined;
  }
}
