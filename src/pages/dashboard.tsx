import { type GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import { prisma } from "~/server/db";
import { Typography, Container, TextField, List, ListItem, ListItemText, Button } from "@mui/material";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import SecretForm from "~/components/SecretForm";


type Secret = {
    id: string;
    content: string;
    expiresAt: string;
    viewed: boolean;
    oneTime: boolean;
};

export default function Dashboard({ secrets }: { secrets: Secret[] }) {
    const [query, setQuery] = useState("");

    const filtered = secrets.filter((s) =>
        s.content.toLowerCase().includes(query.toLowerCase())
    );

    const handleDelete = async (id: string) => {
        const confirmed = confirm("Are you sure you want to delete this secret?");
        if (!confirmed) return;
        const res = await fetch(`/api/secret/${id}`, { method: "DELETE" });
        if (res.ok) window.location.reload();
        else alert("Failed to delete");
    };

    return (
        <Container sx={{ mt: 4 }}>
            {/* 🔽 CREATE SECRET FORM */}
            <Typography variant="h4" gutterBottom>Create a Secret</Typography>
            <SecretForm />

            {/* 🔽 YOUR EXISTING SECRETS LIST */}
            <Typography variant="h4" gutterBottom>My Secrets</Typography>

            <TextField
                label="Search Secrets"
                fullWidth
                sx={{ mb: 3 }}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />

            <List>
                {filtered.map((s) => {
                    const isExpired = new Date(s.expiresAt) < new Date();
                    const status = isExpired
                        ? "Expired"
                        : s.viewed && s.oneTime
                            ? "Viewed"
                            : "Active";

                    return (
                        <ListItem
                            key={s.id}
                            secondaryAction={
                                <>
                                    <Link href={`/secret/${s.id}`} passHref>
                                        <Button size="small" sx={{ mr: 1 }}>View</Button>
                                    </Link>
                                    <Button onClick={() => handleDelete(s.id)} color="error" size="small">Delete</Button>
                                </>
                            }
                        >
                            <ListItemText
                                primary={`Secret: ${s.content.slice(0, 30)}...`}
                                secondary={`Status: ${status} | Expires in: ${formatDistanceToNow(new Date(s.expiresAt))}`}
                            />
                        </ListItem>
                    );
                })}
            </List>
        </Container>
    );
}
export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getServerSession(context.req, context.res, authOptions);
    console.log("SESSION ON DASHBOARD SSR:", session);

    if (!session?.user?.id) {
        return {
            redirect: {
                destination: "/auth/signin",
                permanent: false,
            },
        };
    }


    const secrets = await prisma.secret.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
    });

    // 🔥 Serialize Date fields
    const serializedSecrets = secrets.map((secret) => ({
        ...secret,
        createdAt: secret.createdAt.toISOString(),
        expiresAt: secret.expiresAt.toISOString(),
    }));

    return {
        props: {
            secrets: serializedSecrets,
        },
    };
};
