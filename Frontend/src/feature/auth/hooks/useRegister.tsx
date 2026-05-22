//src\feature\auth\hooks\useRegister.ts
import { useState } from "react";
import { authService } from "@/src/services/authService";
import { handleSubmit } from "@/src/utils/handleSubmit";
import { useLoading } from "@/src/components/LoadingContext";
import { useRouter } from "next/navigation";
export interface RegisterPayload {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
}
export const useRegister = (openPopup: (t: string, m: string) => void) => {
    const router = useRouter();
    const [payload, setPayload] = useState<RegisterPayload>({ username: "", email: "", password: "", confirmPassword: "" }); const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const { showLoading, hideLoading } = useLoading();

    const onFieldChange = (field: keyof RegisterPayload, value: string) => {
        setPayload((prev) => ({ ...prev, [field]: value }));
    };

    const submit = async () => {
        const cleanEmail = payload.email.trim();
        const { password, confirmPassword, username } = payload;

        // 1. ดักค่าว่างทุกฟิลด์
        if (!username || !cleanEmail || !password || !confirmPassword) {
            setError("กรุณากรอกข้อมูลให้ครบทุกช่อง");
            return;
        }

        // 2. ดักรูปแบบอีเมล
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(cleanEmail)) {
            setError("รูปแบบอีเมลไม่ถูกต้อง");
            return;
        }

        // 3. ดักความยาวรหัสผ่าน
        if (password.length < 8) {
            setError("รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร");
            return;
        }

        // 4. เช็คว่ารหัสผ่านตรงกันไหม (แก้ไขตรงนี้)
        if (password !== confirmPassword) {
            setError("รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน");
            return;
        }

        setError(""); // ล้าง error ก่อนยิง api

        await handleSubmit({
            action: () => authService.register({
                username: payload.username,
                email: cleanEmail,
                password: password
            }),
            setSubmitting: (isSubmitting) => {
                setSubmitting(isSubmitting);
                if (isSubmitting) showLoading();
                else hideLoading();
            },
            onSuccess: (res) => {
                console.log("Register Success", res);
                router.push("/login");
            },
            onError: (err) => {
                // ดึง error จาก backend มาโชว์ถ้ามี หรือใช้ค่า default
                setError(err?.message || "ลงทะเบียนไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
            },
            openPopup,
            successMessage: "สร้างบัญชีสำเร็จ!",
            failMessage: "ไม่สามารถสร้างบัญชีได้"
        });
    };

    return { payload, error, submitting, onFieldChange, submit };
};