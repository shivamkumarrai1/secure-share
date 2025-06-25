import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { prisma } from "~/server/db";
import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const session = await getServerSession(req, res, authOptions);
    if (!session?.user?.id) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const { secret, password, oneTime, expiresIn } = req.body;

    if (!secret || typeof secret !== "string") {
        return res.status(400).json({ error: "Invalid secret" });
    }

    const passwordHash = password ? await bcrypt.hash(password, 10) : null;

    const now = new Date();
    const expiresAt = new Date(now.getTime() + Number(expiresIn) * 1000);

    const created = await prisma.secret.create({
        data: {
            content: secret,
            passwordHash,
            oneTime: Boolean(oneTime),
            expiresAt,
            userId: session.user.id,
        },
    });

    return res.status(200).json({ id: created.id });
}
