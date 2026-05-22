import { useState } from "react";
import { authService } from "@/src/services/authService";
import { handleSubmit } from "@/src/utils/handleSubmit";
import { useLoading } from "@/src/components/LoadingContext";
import { useRouter } from "next/navigation"; // นำเข้า useRouter เพื่อเปลี่ยนหน้า
import { signIn } from "next-auth/react";

export interface LoginPayload {
    email: string;
    password: string;
}

export const useLogin = (openPopup: (t: string, m: string, type?: any) => void) => {
    const router = useRouter(); // เตรียมตัวแปรสำหรับ redirect
    const [payload, setPayload] = useState<LoginPayload>({ email: "", password: "" });
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const { showLoading, hideLoading } = useLoading();

    const onFieldChange = (field: keyof LoginPayload, value: string) => {
        // ✨ เพิ่ม: ล้างข้อความ Error ทันทีที่ผู้ใช้เริ่มแก้ไขข้อมูลใหม่
        if (error) setError("");
        setPayload((prev) => ({ ...prev, [field]: value }));
    };

    const submit = async () => {
        const cleanEmail = payload.email.trim();
        const currentPassword = payload.password;

        // 1. Validation (เหมือนเดิม)
        if (!cleanEmail || !currentPassword) {
            setError("กรุณากรอก Email และ Password ให้ครบถ้วน");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(cleanEmail)) {
            setError("รูปแบบอีเมลไม่ถูกต้อง");
            return;
        }

        if (currentPassword.length < 8) {
            setError("รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร");
            return;
        }

        setError("");

        await handleSubmit({
            action: async () => {
                try {
                    console.log("เริ่มเรียก signIn...");
                    const result = await signIn("credentials", {
                        redirect: false,
                        email: cleanEmail,
                        password: currentPassword,
                        callbackUrl: "http://localhost:3000",
                    });
                    console.log("SignIn Result:", result);
                    if (result?.error) throw result;
                    return result;
                } catch (err) {
                    // ถ้าขึ้น Invalid URL ตรงนี้ แสดงว่าเป็นที่การตั้งค่า NextAuth (NEXTAUTH_URL)
                    console.error("Internal signIn crash:", err);
                    throw err;
                }
            },
            setSubmitting: (isSubmitting) => {
                setSubmitting(isSubmitting);
                if (isSubmitting) showLoading();
                else hideLoading();
            },

            onSuccess: (res) => {
                console.log("Success", res);
                router.push("/");
            },
            onError: (err: any) => {
                const serverMessage = err.response?.data?.message || "ล็อกอินไม่สำเร็จ กรุณาตรวจสอบข้อมูล";
                setError(serverMessage);
            },
            openPopup,
            successMessage: "เข้าสู่ระบบสำเร็จ",
            failMessage: "อีเมลหรือรหัสผ่านไม่ถูกต้อง"
        });
    };

    return { payload, error, submitting, onFieldChange, submit };
};