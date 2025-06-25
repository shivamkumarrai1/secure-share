import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "~/server/db";
import bcrypt from "bcrypt";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") return res.status(405).end();

    const { email, password } = req.body;

    if (!email || !password) return res.status(400).json({ error: "Missing fields" });

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ error: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: { email, hashedPassword },
    });

    return res.status(201).json({ message: "User created", user: { id: user.id, email: user.email } });
}