import api from "./api";
// นำเข้า Type มาจากไฟล์ useRegister หรือไฟล์ types ที่คุณเก็บไว้
import { RegisterPayload } from "@/src/feature/auth/hooks/useRegister";

export const authService = {
  login: async (payload: any) => {
    const res = await api.post("/v1/auth/login", payload);
    return res.data;
  },

  register: async (payload: Omit<RegisterPayload, "confirmPassword">) => {
    const res = await api.post("/v1/auth/register", payload);
    return res.data;
  },
  logout: async (refreshToken: string) => {
    const res = await api.post("/v1/auth/logout", { refreshToken });
    return res.data;
  }

};