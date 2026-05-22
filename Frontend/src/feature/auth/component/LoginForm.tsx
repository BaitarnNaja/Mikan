//src\feature\auth\component\login.tsx
"use client";

import { Box, Button, Divider, Typography } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import Input from "@/src/components/Input";
import { StoreButton } from "@/src/components/StoreButton";
import { COLORS } from "@/src/styles";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Popup from "@/src/components/Popup";
import { useLogin } from "../hooks/useLogin";
import { signIn } from "next-auth/react";


export default function LoginForm() {
  const router = useRouter();
  const [popupState, setPopupState] = useState({
    open: false,
    title: "",
    message: "",
    type: "info" as "info" | "success" | "error" | "confirm"
  });
  const openPopup = (title: string, message: string, type: any = "info") => {
    setPopupState({ open: true, title, message, type });
  };
  const closePopup = () => {
    setPopupState(prev => ({ ...prev, open: false }));
  };
  const { payload, error, submitting, onFieldChange, submit } = useLogin(openPopup);

  // 2. Logic สำหรับ Login with Azure
  const handleAzureLogin = () => {
    // บอก NextAuth ว่า Login เสร็จแล้ว ให้วิ่งไปที่ไฟล์ Handler ที่เราสร้างไว้
    signIn("azure-ad", { callbackUrl: "/" });
  };

  const handleGoogleLogin = () => {
    // บอก NextAuth ว่า Login เสร็จแล้ว ให้วิ่งไปที่ไฟล์ Handler ที่เราสร้างไว้
    signIn("google", { callbackUrl: "/" });
  };

  const handleLineLogin = () => {
    // บอก NextAuth ว่า Login เสร็จแล้ว ให้วิ่งไปที่ไฟล์ Handler ที่เราสร้างไว้
    signIn("line", { callbackUrl: "/" });
  };

  const handleFacebookLogin = () => {
    // บอก NextAuth ว่า Login เสร็จแล้ว ให้วิ่งไปที่ไฟล์ Handler ที่เราสร้างไว้
    signIn("facebook", { callbackUrl: "/" });
  }
  return (
    <Box sx={{ width: "100%", maxWidth: 420, display: "flex", flexDirection: "column", gap: 1.5, p: 4, background: COLORS.white, borderRadius: 3, border: "1px solid #ddd", boxShadow: 2 }}>

      {/* LOGO */}
      <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
        <Box component="img" src="/logo.png" sx={{ width: { xs: "30dvw", md: "10dvw" }, maxWidth: 200 }} />
      </Box>

      <Typography variant="h4" sx={{ color: COLORS.brandPrimary }}>
        ลงชื่อเข้าใช้งาน ดำเนินการด้วย
      </Typography>

      <Input id="login-email" label="Email" value={payload.email} onChange={(v) => onFieldChange("email", v)} />
      <Input id="login-password" label="Password" type="password" value={payload.password} onChange={(v) => onFieldChange("password", v)} />

      <StoreButton onClick={submit} disabled={submitting}>
        เข้าสู่ระบบ
      </StoreButton>
      {error && (
        <Box sx={{ background: COLORS.brandError || "#fee2e2", p: 1 }}>
          <Typography variant="body2" sx={{ color: COLORS.textError }}>{error}</Typography>
        </Box>
      )}

      <Divider><Typography variant="body2">หรือ</Typography></Divider>

      {/* Social Buttons */}
      {/* MICROSOFT */}
      <SocialLoginButton
        icon={<img
          src="/Microsoft-icon.svg"
        />}
        label="ดำเนินการด้วย Microsoft"
        hoverColor="#00A4EF"
        onClick={handleAzureLogin}
      />

      <SocialLoginButton
        icon={<img
          src="/google-icon.svg"
        />}
        label="ดำเนินการด้วย Google"
        hoverColor="#00A4EF"
        onClick={handleGoogleLogin}
      />

      <SocialLoginButton
        icon={<img
          src="/line-icon.svg"
        />}
        label="ดำเนินการด้วย LINE"
        hoverColor="#06C755"
        onClick={handleLineLogin}
      />
      {/* FACEBOOK */}
      <SocialLoginButton
        icon={<FacebookIcon sx={{ color: "#1877F2" }} />}
        label="ดำเนินการด้วย Facebook"
        hoverColor="#1877F2"
        onClick={handleFacebookLogin}
      />

      <Box sx={{ display: "flex", justifyContent: "center", gap: 1, mt: 1 }}>
        <Typography variant="body2" sx={{ color: COLORS.gray }}>ยังไม่มีบัญชี?</Typography>
        <Button variant="text" href="/register" sx={{ typography: "body2", textTransform: "none", p: 0, minWidth: "auto" }}>
          สมัครบัญชีใหม่ที่นี่
        </Button>
      </Box>
      <Popup
        open={popupState.open}
        type={popupState.type}
        title={popupState.title}
        message={popupState.message}
        onClose={closePopup}
      />
    </Box>
  );
}

// Helper Component สำหรับปุ่ม Social
function SocialLoginButton({ icon, label, hoverColor, onClick }: any) {
  return (
    <Button
      variant="outlined"
      fullWidth
      onClick={onClick}
      sx={{
        justifyContent: "flex-start",
        gap: 1.5,
        color: COLORS.black,
        borderRadius: "999px",
        borderWidth: 2,
        borderColor: "#B2B2B2",
        textTransform: "none", // ป้องกันตัวพิมพ์ใหญ่ทั้งหมด
        py: 1, // เพิ่มช่องว่าง บน-ล่าง ให้ปุ่มดูสวยขึ้น
        "&:hover": {
          borderColor: hoverColor,
          borderWidth: 2,
          backgroundColor: "transparent"
        }
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center", // จัดให้อยู่กึ่งกลาง Box
          ml: 1,
          width: 24, // เพิ่มขนาด Box นิดหนึ่งเพื่อให้ดูไม่เบียด
          height: 24,
          // 👇 จุดสำคัญ: บังคับให้ลูกทุกตัว (svg, img) มีขนาดเท่ากัน
          "& svg, & img": {
            width: "100%",
            height: "100%",
            objectFit: "contain"
          }
        }}
      >
        {icon}
      </Box>
      <Typography variant="body2" sx={{ fontWeight: 500 }}>
        {label}
      </Typography>
    </Button>
  );
}