"use client";
import { useState, useEffect } from "react";
import { globalTheme } from "@/src/theme/globalTheme";
import { ThemeProvider } from "@mui/material/styles";

export default function MainLayout({ children }: any) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // ถ้ายังโหลดไม่เสร็จ ให้ซ่อนไว้ก่อนเพื่อป้องกัน HTML Mismatch
  if (!mounted) {
    return <div style={{ visibility: 'hidden' }}>{children}</div>;
  }
  return (
    <ThemeProvider theme={globalTheme}>
      {children}
    </ThemeProvider>
  );
}