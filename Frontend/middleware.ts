import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 1. กำหนดรายการ Path ที่เข้าได้โดย "ไม่ต้อง Login" (Public Paths)
const publicPaths = [""];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 2. ดึง Token จาก NextAuth (ตรวจสอบ Session)
  // getToken จะอ่านจากชื่อ Cookie ที่ NextAuth สร้างให้โดยอัตโนมัติ
  const token = await getToken({ 
    req, 
    secret: process.env.NEXTAUTH_SECRET 
  });

  console.log("Middleware Check:", { pathname, tokenExists: !!token });

  const protectedPaths = ['/usercart', '/userprofile']
  const isProtected = protectedPaths.some(path => pathname.startsWith(path))

  // 3. ตรวจสอบว่าเป็น Public Path หรือไม่
  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

  if (isProtected && !token) {
    // ถ้าจะเข้าหน้าหวงกั้น แต่ไม่มี Token ให้ส่งไปหน้า Login
    // พร้อมแนบ URL เดิมไว้ เพื่อให้ Login เสร็จแล้วเด้งกลับมาที่เดิมได้
    const loginUrl = new URL('/login', req.url)
    loginUrl.searchParams.set('callback', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // --- LOGIC การตรวจสอบ ---

  // กรณี A: ถ้าไม่มี Token และพยายามเข้าหน้าที่ไม่ได้อยู่ใน Public Paths
  // ให้ Redirect ไปที่หน้า /login
  if (!token && !isPublicPath) {
    const url = new URL("/login", req.url);
    // เก็บ URL เดิมไว้ใน callbackUrl เพื่อให้ Login เสร็จแล้วเด้งกลับมาที่เดิม
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  // กรณี B: ถ้ามี Token อยู่แล้ว แต่พยายามจะเข้าหน้า Login หรือ Register
  // ให้ส่งกลับไปหน้าแรก (Home) เพราะเขา Login แล้ว ไม่ควรเห็นหน้าสมัครสมาชิกอีก
  if (token && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // กรณี C: ถ้าทุกอย่างถูกต้อง ให้ดำเนินงานต่อไปตามปกติ
  return NextResponse.next();
}

// 4. กำหนด Matcher เพื่อบอกว่าให้ Middleware ทำงานที่ Path ไหนบ้าง
// ท่าที่ปลอดภัยที่สุดคือให้ตรวจทุก Path ยกเว้นไฟล์ Static ของระบบ
export const config = {
  matcher: [
    '/'
      /*
       * Match all request paths except for the ones starting with:
       * - api (แต่เรายกเว้น /api/auth ไว้ข้างบนแล้ว)
       * - _next/static (static files)
       * - _next/image (image optimization files)
       * - favicon.ico (favicon file)
       */
    // '/usercart/:path*', 
    // '/userprofile/:path*',  
    // '/((?!api|_next/static|_next/image|favicon.ico).*)'
    // "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};