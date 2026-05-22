import TextField from "@mui/material/TextField";
import { SxProps, Theme, InputAdornment, IconButton } from "@mui/material";
import { useState } from "react";
// อย่าลืมลง npm install @mui/icons-material
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

type InputProps = {
    id?: string;
    label?: string;
    value?: string;
    onChange?: (value: string) => void;
    type?: "text" | "password" | "email"; // ระบุประเภทให้ชัดเจนขึ้น
    disabled?: boolean;
    readOnly?: boolean;
    placeholder?: string;
    className?: string;
    borderRadius?: number;
    typography?: string;
    color?: string;
    sx?: SxProps<Theme>;
};

export default function Input({
    id,
    label,
    value,
    onChange,
    type = "text",
    disabled = false,
    readOnly = false,
    placeholder = "",
    className = "",
    borderRadius = 50,
    typography = "body1",
    color = "secondary",
    sx
}: InputProps) {
    // 1. สร้าง State สำหรับควบคุมการมองเห็น (เฉพาะกรณี password)
    const [showPassword, setShowPassword] = useState(false);

    const isPassword = type === "password";

    return (
        <TextField
            size="small"
            id={id}
            label={label}
            value={value}
            // 2. ถ้าเป็น password ให้สลับ type ตาม state showPassword
            type={isPassword ? (showPassword ? "text" : "password") : type}
            placeholder={placeholder}
            disabled={disabled}
            onChange={(e) => onChange?.(e.target.value)}
            fullWidth
            InputProps={{
                readOnly,
                // 3. เพิ่ม Icon ลูกตาเฉพาะเมื่อ type เป็น password
                endAdornment: isPassword ? (
                    <InputAdornment position="end">
                        <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            size="small"
                            sx={{ mr: 0.5 }} // ปรับระยะห่างนิดหน่อย
                        >
                            {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                        </IconButton>
                    </InputAdornment>
                ) : null,
            }}
            className={className}
            sx={{
                "& .MuiOutlinedInput-root": {
                    borderRadius: `${borderRadius}px`,
                    // ปรับ padding ขวาเผื่อให้ไอคอนลูกตาไม่เบียด
                    pr: isPassword ? 1 : undefined 
                },
                "& input": {
                    typography,
                    color: (theme) =>
                        color
                            ? theme.palette.text[color as keyof typeof theme.palette.text]
                            : theme.palette.text.secondary
                },
                "& .MuiInputBase-input": { fontSize: "0.875rem" },
                "& .MuiInputLabel-root": { fontSize: "0.875rem" },
                ...sx
            }}
        />
    );
}