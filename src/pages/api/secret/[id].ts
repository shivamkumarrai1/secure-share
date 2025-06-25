import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "~/server/db";
import bcrypt from "bcrypt";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;

    if (req.method !== "POST") return res.status(405).end();
    if (!id || typeof id !== "string") return res.status(400).json({ error: "Invalid ID" });

    const secret = await prisma.secret.findUnique({ where: { id } });
    if (!secret) return res.status(404).json({ error: "Secret not found" });

    // Expired
    if (new Date(secret.expiresAt) < new Date()) {
        return res.status(410).json({ error: "Secret has expired" });
    }

    // Already viewed (if one-time)
    if (secret.oneTime && secret.viewed) {
        return res.status(410).json({ error: "This secret was already viewed" });
    }

    // Password-protected
    if (secret.passwordHash) {
        const { password } = req.body;
        if (!password) return res.status(401).json({ error: "Password required", requiresPassword: true });

        const isValid = await bcrypt.compare(password, secret.passwordHash);
        if (!isValid) return res.status(403).json({ error: "Incorrect password" });
    }

    // Mark as viewed if one-time
    if (secret.oneTime) {
        await prisma.secret.update({
            where: { id },
            data: { viewed: true },
        });
    }

    return res.status(200).json({ content: secret.content });

    if (req.method === "DELETE") {
        await prisma.secret.delete({
            where: { id: id as string },
        });
        return res.status(200).json({ message: "Deleted" });
    }

    return res.status(405).end();
}