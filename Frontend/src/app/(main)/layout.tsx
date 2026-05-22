import Footer from "@/src/components/Footer";
import Header from "../../components/Header";
import { Box } from "@mui/material";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <Box
        sx={{
          minHeight: '100dvh',
          width: '100dvw',
          background: 'linear-gradient(180deg, #FFB886 3%, #FFD6A4 7%, #FFFFFF 19%)',
          pt: '60px',
        }}
      >
        <main>{children}</main>
      </Box>
      <Footer/>
    </>
  );
}