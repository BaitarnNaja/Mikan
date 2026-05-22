"use client";

import { Box, Button, Divider, Typography, Checkbox, FormControlLabel, Link } from "@mui/material"; 
import Input from "@/src/components/Input";
import { StoreButton } from "@/src/components/StoreButton";
import { COLORS } from "@/src/styles";
import { useRegister } from "../hooks/useRegister";
import { useState } from "react";
import Popup from "@/src/components/Popup";

export default function RegisterForm() {
  const [popupState, setPopupState] = useState({
    open: false,
    title: "",
    message: "",
    type: "info" as "info" | "success" | "error" | "confirm"
  });

  // 1. เพิ่ม State สำหรับตรวจสอบการยอมรับเงื่อนไข
  const [isAgreed, setIsAgreed] = useState(false);

  const openPopup = (title: string, message: string, type: any = "info") => {
    setPopupState({ open: true, title, message, type });
  };
  const closePopup = () => {
    setPopupState(prev => ({ ...prev, open: false }));
  };

  const { payload, error, onFieldChange, submit } = useRegister(openPopup);

  return (
    <Box sx={{ width: "100%", maxWidth: 420, display: "flex", flexDirection: "column", gap: 1.5, p: 4, background: COLORS.white, borderRadius: 3, border: "1px solid #ddd", boxShadow: 2 }}>

      {/* LOGO */}
      <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
        <Box component="img" src="/logo.png" sx={{ width: { xs: "30dvw", md: "10dvw" }, maxWidth: 200 }} />
      </Box>

      <Typography variant="h4" sx={{ color: COLORS.brandPrimary }}>
        สร้างบัญชีใหม่
      </Typography>

      <Input id="register-username" label="Username" value={payload.username} onChange={(v) => onFieldChange("username", v)} />
      <Input id="register-email" label="Email" value={payload.email} onChange={(v) => onFieldChange("email", v)} />
      <Input id="register-password" label="Password" type="password" value={payload.password} onChange={(v) => onFieldChange("password", v)} />
      <Input id="register-confirm" label="Confirm Password" type="password" value={payload.confirmPassword} onChange={(v) => onFieldChange("confirmPassword", v)} />
      {error && (
        <Box sx={{ background: COLORS.brandError || "#fee2e2", p: 1, borderRadius: 1 }}>
          <Typography variant="body2" sx={{ color: COLORS.textError }}>{error}</Typography>
        </Box>
      )}
      {/* 2. เพิ่มส่วนข้อกำหนดและเงื่อนไข */}
      <Box sx={{ mt: 1 }}>
        <FormControlLabel
          control={
            <Checkbox
              size="small"
              checked={isAgreed}
              onChange={(e) => setIsAgreed(e.target.checked)}
              sx={{ color: COLORS.brandPrimary, '&.Mui-checked': { color: COLORS.brandPrimary } }}
            />
          }
          label={
            <Typography variant="caption" sx={{ color: "#666" }}>
              เมื่อคุณสร้างบัญชี ถือว่าคุณยอมรับ{" "}
              <Link href="/terms" target="_blank" sx={{ color: COLORS.brandPrimary, fontWeight: 'bold', textDecoration: 'none' }}>
                ข้อกำหนดและเงื่อนไขรวมถึงนโยบายความเป็นส่วนตัว
              </Link>
            </Typography>
          }
        />
      </Box>

      {/* 3. ปรับปุ่มให้ Disabled ถ้ายังไม่ติ๊กยอมรับ */}
      <StoreButton
        onClick={submit}
        disabled={!isAgreed}
      >
        สร้างบัญชีใหม่
      </StoreButton>


      <Box sx={{ display: "flex", justifyContent: "center", gap: 1, mt: 1 }}>
        <Typography variant="body2" sx={{ color: COLORS.gray }}>มีบัญชีอยู่แล้วใช่ไหม? </Typography>
        <Button variant="text" href="/login" sx={{ typography: "body2", textTransform: "none", p: 0, minWidth: "auto"  }}>
          เข้าสู่ระบบ        </Button>
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