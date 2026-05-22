import NextAuth, { DefaultSession } from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
  /**
   * ขยาย interface Session เพื่อให้รองรับค่าที่มาจาก Azure
   */
  interface Session {
    azureAccessToken?: string
    azureIdToken?: string
    needsBackendJwt?: boolean
    user: {
      /** เพิ่ม property อื่นๆ ที่ต้องการใน user ได้ที่นี่ */
    } & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  /**
   * ขยาย interface JWT เพื่อให้รองรับค่าที่เราเก็บไว้ใน token
   */
  interface JWT {
    azureAccessToken?: string
    azureIdToken?: string
    needsBackendJwt?: boolean
  }
}