import Box from "@mui/material/Box";
import { COLORS } from "@/src/styles";
import RegisterForm from "@/src/feature/auth/component/RegisterForm";

export default function LoginPage() {
  return (
    <Box sx={{ minHeight: "100dvh", background: COLORS.bg, display: "flex", alignItems: "center", justifyContent: "center", p: 2 }}>
      <RegisterForm />
    </Box>
  );
}