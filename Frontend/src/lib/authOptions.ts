import { DefaultSession, NextAuthOptions, Session } from "next-auth";
import AzureADProvider from "next-auth/providers/azure-ad";
import GoogleProvider from "next-auth/providers/google";
import LineProvider from "next-auth/providers/line";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";
import api from "../services/api";
import axios from "axios";


declare module "next-auth" {
  interface Session {
    accessToken?: string;
    refreshToken?: string;
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"]
  }

  interface User {
    accessToken: string;
    refreshToken: string;
    role: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    AccessToken?: string;
    IdToken?: string;
    needsBackendJwt?: boolean;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          // ยิงเข้า Spring Boot (ระวัง Port: ปกติ Spring เป็น 8080)
          const res = await axios.post("http://localhost:8080/api/v1/auth/login", credentials);
          if (res.data && res.data.accessToken) {
            return {
              id: res.data.user.id,
              name: res.data.user.name,
              email: res.data.user.email,
              role: res.data.user.role,
              accessToken: res.data.accessToken, // JWT จาก Backend
              refreshToken: res.data.refreshToken,
            };
          }
          return null;
        } catch (error) { return null; }
      }
    }),
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID!,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
      tenantId: process.env.AZURE_AD_TENANT_ID!,
      authorization: {
        params: {
          prompt: "select_account"
        },
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "select_account"
        },
      }
    }),
    LineProvider({
      clientId: process.env.LINE_CLIENT_ID!,
      clientSecret: process.env.LINE_CLIENT_SECRET!,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "email,public_profile", // ระบุแบบนี้ให้ชัดเจน
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, user }) {
      // ครั้งแรกที่ Login (ไม่ว่าจะ Provider หรือ Credentials)
      if (account && user) {
        // ถ้าเป็น Social Provider
        if (account.provider !== "credentials") {
          try {
            // 🚩 ยิงไปแลก Token ที่ Backend (Spring Boot)
            const backendRes = await axios.post("http://localhost:8080/api/v1/auth/social-login", {
              provider: account.provider,
              idToken: account.id_token, // สำหรับ Google/Azure
              accessToken: account.access_token // สำหรับ Line/Facebook
            });

            // เอา JWT ของ Backend มาทับใน token
            token.accessToken = backendRes.data.accessToken;
            token.role = backendRes.data.user.role;
            token.id = backendRes.data.user.id;
          } catch (error) {
            console.error("Social Exchange Error", error);
          }
        } else {
          // ถ้าเป็น Credentials (ได้มาจากการ return ใน authorize อยู่แล้ว)
          token.accessToken = user.accessToken;
          token.role = user.role;
          token.id = user.id;
        }
      }
      return token;
    },

    async session({ session, token }) {
      // ส่งค่าที่จำเป็นไปที่หน้าบ้าน (Frontend)
      if (token) {
        session.accessToken = token.accessToken as string;
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login", // หน้า Login
  },
  session: {
    strategy: "jwt",
  },
};