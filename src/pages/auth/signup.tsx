import { useState } from "react";
import { useRouter } from "next/router";

export default function SignUp() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await fetch("/api/auth/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        if (res.ok) {
            alert("Signup successful. You can now log in.");
            router.push("/auth/signin");
        } else {
            const error = await res.json();
            alert(error.message || "Signup failed");
        }
    };

    return (
        <form onSubmit={handleSignup} style={{ maxWidth: "400px", margin: "auto", padding: "2rem" }}>
            <h2>Sign Up</h2>
            <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
            <button type="submit">Sign Up</button>
        </form>
    );
}
