import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        // 1. ให้ Path ที่เกี่ยวกับ auth ทั้งหมด (รวม Google) วิ่งเข้า Next.js เอง
        source: '/api/auth/:path*',
        destination: '/api/auth/:path*',
      },
      {
        // 2. ส่วน API อื่นๆ (รวมถึง Login ด้วย Email ถ้าคุณทำที่ Backend) ให้ไป 3001
        source: '/api/:path*',
        destination: 'http://localhost:8080/api/:path*',
      },
    ];
  },
  reactStrictMode: false,
};

export default nextConfig;