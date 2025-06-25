import { type NextApiRequest, type NextApiResponse } from "next";
import jwt from "jsonwebtoken"; // use this instead
import { prisma } from "~/server/db";

const secret = process.env.NEXTAUTH_SECRET!;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Missing or invalid Authorization header" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({ error: "Token missing" });
    }

    try {
        const decoded = jwt.verify(token, secret) as { sub: string };
        console.log("Decoded:", decoded);

        const { sub: userId } = decoded;

        const { content, expiresIn, oneTime = false } = req.body;

        if (!content) {
            return res.status(400).json({ error: "Secret content is required" });
        }

        const now = new Date();
        const expiresAt = expiresIn
            ? new Date(now.getTime() + Number(expiresIn) * 60 * 1000)
            : new Date(now.getTime() + 60 * 60 * 1000);

        const secretEntry = await prisma.secret.create({
            data: {
                content,
                userId,
                viewed: false,
                oneTime,
                expiresAt,
            },
        });

        return res.status(200).json({ success: true, secret: secretEntry });

    } catch (error) {
        console.error("JWT verification failed:", error);
        return res.status(401).json({ error: "Invalid token" });
    }
}
