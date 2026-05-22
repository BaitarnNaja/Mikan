import axios from 'axios';
import { getSession } from "next-auth/react";

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    // 1. ดึง Session ปัจจุบันออกมา (NextAuth จะไปอ่านจาก Cookie ให้เอง)
    const session = await getSession();

    // 2. ตรวจสอบว่ามี accessToken ที่เราเก็บไว้ในตอน Login หรือไม่
    // (ต้องเป็นชื่อเดียวกับที่คุณตั้งไว้ใน callbacks.session ใน authOptions)
    if (session?.accessToken) {
      config.headers.Authorization = `Bearer ${session.accessToken}`;
    } else {
      // ถ้าไม่มี token ให้ลบ header ออกเพื่อความปลอดภัย
      delete config.headers.Authorization;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401) {
      // 1. ตรวจสอบก่อนว่า URL ที่ Error ใช่ตัว refresh เองไหม?
      // ถ้าตัว refresh พังเอง (401) แปลว่า Refresh Token ตายสนิทแล้ว ให้ Login ใหม่ทันที
      if (originalRequest.url === '/auth/refresh' || originalRequest.url === '/api/auth/refresh') {
        localStorage.removeItem("access_token");
        if (typeof window !== 'undefined') window.location.href = "/login";
        return Promise.reject(error);
      }

      // 2. ถ้าเป็น API อื่นๆ (เช่น /products) ถึงจะเข้าสู่กระบวนการ Retry 3 ครั้ง
      originalRequest._retryCount = originalRequest._retryCount || 0;
      const MAX_RETRY_ATTEMPTS = 3;
      if (originalRequest._retryCount < MAX_RETRY_ATTEMPTS) {
        originalRequest._retryCount += 1;

        try {
          // ใช้ axios ตัวใหม่ (หรือตัวที่ไม่มี interceptor นี้) เพื่อเลี่ยง loop
          await axios.post('/api/auth/refresh', {}, { withCredentials: true });

          return api(originalRequest);
        } catch (refreshError) {
          // ถ้า Refresh ล้มเหลว (catch ฝั่งนี้) ให้เด้ง Login เลย
          localStorage.removeItem("access_token");
          if (typeof window !== 'undefined') window.location.href = "/login";
          return Promise.reject(refreshError);
        }
      }

      // ถ้าลองครบ 3 ครั้งแล้วยัง 401 อยู่
      localStorage.removeItem("access_token");
      if (typeof window !== 'undefined') window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;