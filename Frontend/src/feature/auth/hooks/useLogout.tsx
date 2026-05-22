import { authService } from "@/src/services/authService";
import { useState } from "react";

export const useLogout = () => {
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const logout = async (onSuccess?: () => void, onError?: (err: any) => void) => {
        setIsLoggingOut(true);
        try {
            const refreshToken = localStorage.getItem("refreshToken");

            if (refreshToken) {
                await authService.logout(refreshToken);
            }

            // เคลียร์ Token และข้อมูลในเครื่อง
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            // ถ้ามีข้อมูลอื่นๆ เช่น ข้อมูล User ก็เคลียร์ที่นี่ได้เลย
            // localStorage.clear(); 

            if (onSuccess) onSuccess();
        } catch (error) {
            console.error("Logout failed:", error);
            
            // กรณี Error (เช่น Token หมดอายุ) ก็ควรลบ Token ในเครื่องออกอยู่ดี
            localStorage.clear();
            
            if (onError) onError(error);
        } finally {
            setIsLoggingOut(false);
        }
    };

    return { logout, isLoggingOut };
};