// src/pages/api/custom-login.ts
import { prisma } from "~/server/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") return res.status(405).end();

    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.hashedPassword))) {
        return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
        { sub: user.id, email: user.email },
        process.env.NEXTAUTH_SECRET!,
        { expiresIn: "1h" }
    );

    return res.status(200).json({ token });
}
