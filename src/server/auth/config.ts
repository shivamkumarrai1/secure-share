import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { type DefaultSession, type AuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";

import { prisma } from "~/server/db";

// Extend the session type to include user ID
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

// Define the configuration using AuthOptions (for NextAuth v4)
export const authConfig: AuthOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    }),
  ],
  adapter: PrismaAdapter(prisma),
  callbacks: {
    session: async ({ session, token }) => {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
};
