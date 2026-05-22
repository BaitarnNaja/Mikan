// src/app/layout.tsx
import { Andika, Noto_Sans_Thai } from "next/font/google";
import { CssBaseline } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import MainLayout from "./MainLayout"; 
import { LoadingProvider } from "../components/LoadingContext";

const andika = Andika({
  subsets: ["latin"],
  weight: ["400", "700"],
});

const notoThai = Noto_Sans_Thai({ subsets: ["thai"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" suppressHydrationWarning>
      <body className={`${andika.className} ${notoThai.className}`}
        style={{
          margin: 0,
          padding: 0,
          maxWidth: '100%',
          overflowX: 'hidden',
          minHeight: '100dvh'
        }}>
        <AppRouterCacheProvider>
          <CssBaseline />
          
          <LoadingProvider>
            <MainLayout>
              {children}
            </MainLayout>
          </LoadingProvider>
          
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}