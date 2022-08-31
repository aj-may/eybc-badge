import { NextApiRequest, NextApiResponse } from "next";
import { Session, unstable_getServerSession } from "next-auth";
import { getCsrfToken } from "next-auth/react";
import { SiweMessage } from "siwe";
import CredentialsProvider from "next-auth/providers/credentials";
import { IncomingMessage } from "http";
import { JWT } from "next-auth/jwt";

const ethereumProvider = CredentialsProvider({
  name: "Ethereum",
  credentials: {
    message: {
      label: "Message",
      type: "text",
      placeholder: "0x0",
    },
    signature: {
      label: "Signature",
      type: "text",
      placeholder: "0x0",
    },
  },
  async authorize(credentials, req) {
    try {
      const siwe = new SiweMessage(JSON.parse(credentials?.message || "{}"));

      const nextAuthUrl =
        process.env.NEXTAUTH_URL ||
        (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null);
      if (!nextAuthUrl) {
        console.error('NO_AUTH_URL');
        return null;
      }

      const nextAuthHost = new URL(nextAuthUrl).host;
      if (siwe.domain !== nextAuthHost) {
        console.error('DOMAIN_MISMATCH', [siwe.domain, nextAuthHost]);
        return null;
      }

      const csrf = await getCsrfToken({ req: req as IncomingMessage });
      if (siwe.nonce !== csrf) {
        console.error('NONCE_MISMATCH', [siwe.nonce, csrf]);
        return null;
      }

      await siwe.validate(credentials?.signature || "");
      return { id: siwe.address };
    } catch (e) {
      console.error('OTHER_ERROR', e);
      return null;
    }
  },
});

export const authOptions = {
  providers: [ethereumProvider],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, token }: { session: Session; token: JWT }) {
      return {
        ...session,
        address: token.sub,
      };
    },
  },
};

export function withAuth(
  next: (
    req: NextApiRequest,
    res: NextApiResponse,
    session: Session
  ) => Promise<void>
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await unstable_getServerSession(req, res, authOptions);
    if (!session) return res.status(403).json({ error: "Unauthorized" });

    await next(req, res, session);
  };
}
