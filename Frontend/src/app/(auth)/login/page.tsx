//src\app\(auth)\login\page.tsx
import Box from "@mui/material/Box";
import { COLORS } from "@/src/styles";
import LoginForm from "@/src/feature/auth/component/LoginForm";

export default function LoginPage() {
  return (
    <Box sx={{ minHeight: "100dvh", background: COLORS.bg, display: "flex", alignItems: "center", justifyContent: "center", p: 2 }}>
      <LoginForm />
    </Box>
  );
}