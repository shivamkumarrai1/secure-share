import { getCsrfToken, signIn } from "next-auth/react";
import { useState } from "react";
import { TextField, Button, Typography, Box } from "@mui/material";
import Link from "next/link"; // ✅ Use Next.js Link component

export default function SignIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await signIn("credentials", {
            email,
            password,
            callbackUrl: "/dashboard",
        });
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom>Sign In</Typography>

            <TextField
                fullWidth
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ my: 2 }}
            />

            <TextField
                fullWidth
                type="password"
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ my: 2 }}
            />

            <Button type="submit" variant="contained">Sign In</Button>


            <Typography variant="body2" sx={{ mt: 2 }}>
                Don't have an account?{" "}
                <Link href="/auth/signup">Sign up</Link>
            </Typography>
        </Box>
    );
}
