import Button from "@mui/material/Button";
import type { ReactNode } from "react";
import { COLORS } from "../styles";

interface StoreButtonProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  bg?: keyof typeof COLORS;
  size?: "small" | "medium" | "large";
  typography?: "h1" | "h2" | "body1" | "body2" | "caption";
  color?: keyof typeof COLORS;
}

export function StoreButton({
  children,
  onClick,
  disabled = false,
  bg = "brandPrimary",
  size = "small",
  typography = "body2",
  color = "white",
}: StoreButtonProps) {
  return (
    <Button
      variant="contained"
      size={size}
      disabled={disabled}
      onClick={onClick}
      sx={{
        borderRadius: "999px",
        typography,
        color: COLORS[color],
        backgroundColor: COLORS[bg],
      }}
    >
      {children}
    </Button>
  );
}