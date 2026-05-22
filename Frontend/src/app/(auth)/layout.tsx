import { LoadingProvider } from "@/src/components/LoadingContext";


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
        <LoadingProvider>
          {children}
        </LoadingProvider>
  );
}