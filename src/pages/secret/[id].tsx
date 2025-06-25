import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { Box, Typography, CircularProgress, TextField, Button } from "@mui/material";

export default function ViewSecretPage() {
    const router = useRouter();
    const { id } = router.query;

    const [loading, setLoading] = useState(true);
    const [secret, setSecret] = useState("");
    const [error, setError] = useState("");
    const [requiresPassword, setRequiresPassword] = useState(false);
    const [password, setPassword] = useState("");

    const fetchSecret = async (pwd?: string) => {
        setLoading(true);
        const res = await fetch(`/api/secret/${id}`, {
            method: "POST",
            body: JSON.stringify({ password: pwd }),
            headers: { "Content-Type": "application/json" },
        });

        const data = await res.json();
        if (res.ok) {
            setSecret(data.content);
        } else {
            if (data.requiresPassword) setRequiresPassword(true);
            setError(data.error || "Secret not available");
        }
        setLoading(false);
    };

    useEffect(() => {
        if (id) fetchSecret();
    }, [id]);

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        fetchSecret(password);
    };

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom>View Secret</Typography>

            {loading ? (
                <CircularProgress />
            ) : error ? (
                <Typography color="error">{error}</Typography>
            ) : secret ? (
                <Typography variant="body1" sx={{ mt: 2 }}>{secret}</Typography>
            ) : requiresPassword ? (
                <Box component="form" onSubmit={handlePasswordSubmit} sx={{ mt: 2 }}>
                    <TextField
                        label="Enter Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        fullWidth
                    />
                    <Button type="submit" variant="contained" sx={{ mt: 2 }}>
                        Submit
                    </Button>
                </Box>
            ) : null}
        </Box>
    );
}
