import SecretForm from "~/components/SecretForm";
import { Typography, Container } from "@mui/material";

export default function CreateSecretPage() {
    return (
        <Container>
            <Typography variant="h4" sx={{ mt: 4, mb: 2 }}>
                Create a Secret
            </Typography>
            <SecretForm />
        </Container>
    );
}
