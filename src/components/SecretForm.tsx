import { useState } from "react";
import { Box, Button, TextField, Checkbox, FormControlLabel, Select, MenuItem, InputLabel, FormControl } from "@mui/material";

export default function SecretForm() {
    const [secret, setSecret] = useState("");
    const [password, setPassword] = useState("");
    const [oneTime, setOneTime] = useState(false);
    const [expiresIn, setExpiresIn] = useState("3600"); // default 1 hour

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const res = await fetch("/api/secret/create", {
            method: "POST",
            body: JSON.stringify({
                secret,
                password,
                oneTime,
                expiresIn: parseInt(expiresIn),
            }),
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data = await res.json();
        if (res.ok) {
            alert(`Secret created! Share this link:\n${window.location.origin}/secret/${data.id}`);
            setSecret("");
            setPassword("");
        } else {
            alert("Failed to create secret");
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ p: 3, maxWidth: 500, mx: "auto" }}>
            <TextField
                label="Secret"
                multiline
                fullWidth
                rows={4}
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                required
            />

            <TextField
                label="Password (optional)"
                type="password"
                fullWidth
                sx={{ mt: 2 }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel>Expires In</InputLabel>
                <Select value={expiresIn} onChange={(e) => setExpiresIn(e.target.value)}>
                    <MenuItem value="3600">1 Hour</MenuItem>
                    <MenuItem value="86400">24 Hours</MenuItem>
                    <MenuItem value="604800">7 Days</MenuItem>
                    <MenuItem value="1800">30 Minutes</MenuItem>
                </Select>
            </FormControl>

            <FormControlLabel
                control={<Checkbox checked={oneTime} onChange={(e) => setOneTime(e.target.checked)} />}
                label="One-Time Access"
                sx={{ mt: 1 }}
            />

            <Button type="submit" variant="contained" sx={{ mt: 2 }}>
                Create Secret
            </Button>
        </Box>
    );
}
