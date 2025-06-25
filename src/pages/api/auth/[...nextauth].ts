import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth, { type AuthOptions } from "next-auth";
import { prisma } from "~/server/db";
import bcrypt from "bcrypt";

console.log("NEXTAUTH_SECRET:", process.env.NEXTAUTH_SECRET);

export const authOptions: AuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                });
                if (!user || !user.hashedPassword) return null;

                const isValid = await bcrypt.compare(credentials.password, user.hashedPassword);
                if (!isValid) return null;

                return { id: user.id, email: user.email };
            },
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt",
    },
    jwt: {
        secret: process.env.NEXTAUTH_SECRET,
    },
    pages: {
        signIn: "/auth/signin",
    },

    callbacks: {
        async jwt({ token, user }) {
            // On initial login, user is available
            if (user) {
                token.id = user.id;
            }
            return token;
        },

        async session({ session, token }) {
            if (session.user && token.id) {
                session.user.id = token.id as string;
            }
            return session;
        },
    },
};

export default NextAuth(authOptions);
