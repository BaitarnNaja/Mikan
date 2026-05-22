"use client";

import { useEffect } from "react";
import { Box, CardMedia, Typography, CircularProgress } from "@mui/material";
import AiSearchBar from "@/src/components/AiSearchBar";
import RecommendedCategories from "@/src/feature/products/componant/RecommendedCategories";
import Banner from "@/src/feature/products/componant/Banner";
import ProductSlider from "@/src/feature/products/componant/ProductSlider";
import { COLORS } from "@/src/styles";
import ResponsiveMediaCard from "@/src/components/MediaCard";
import { useNewProductSearch } from "@/src/feature/products/hook/useNewProductSearch";

export default function HomeContent() {
  // ดึง state และ function มาจาก Hook
  const { productData, submitting, searchNewProducts } = useNewProductSearch();

  // ยิง API ทันทีที่โหลดหน้า
  useEffect(() => {
    searchNewProducts();
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        minHeight: "100vh",
        py: 5,
        gap: { xs: '1.5rem', md: '1.5rem', lg: '2rem' }
      }}
    >
      <Typography variant="h3" sx={{ color: COLORS.f1 }}>หาสินค้า...</Typography>
      <Typography variant="h2" sx={{ color: COLORS.f2 }}>อยากได้ของสะสม...</Typography>
      <AiSearchBar isMobileSearchOpen={false} setIsMobileSearchOpen={() => { }} alwaysFullWidth={true} />
      <RecommendedCategories />
      <Banner />

      <Box sx={{ width: '90%', maxWidth: '1100px' }}>
        {/* ใส่เงื่อนไข Loading ตรงนี้ */}
        {submitting || !productData ? (
          <CircularProgress sx={{ display: 'block', mx: 'auto', my: 3, color: COLORS.f1 }} />
        ) : (
          <>
            <ProductSlider id="new-arrival" response={productData} title="ลองเข้ามาดูสินค้าใหม่ๆสิ มีแต่ของดีๆทั้งนั้น(^. .^)∫" />
            <ProductSlider id="recommended" response={productData} title="อยากได้ shikishi ของไอดอลที่ชอบ" />
          </>
        )}
      </Box>

      <Box id="about-us" sx={{ width: '90%', maxWidth: '1100px', scrollMarginTop: '6rem' }}>        <Typography variant="h3" sx={{ color: COLORS.f1, mb: 1 }}>ทำไมเราต้องใช้ Mikan?</Typography>
        <Typography variant="h2" sx={{ color: COLORS.f2 }}>เรามีระบบค้นหาจากสิ่งที่คิดอยู่ในหัว ขอเพียงคุณอธิบายสิ่งที่คุณคิด</Typography>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, mt: 2 }}>
          <ResponsiveMediaCard
            imageUrl="/path-to-your-image.jpg"
            title="แหล่งรวบรวมสินค้าคนรักอนิเมะ"
            text="อยากได้ shikishi ของไอดอลที่ชอบ"
          />
          <ResponsiveMediaCard
            imageUrl="/path-to-your-image.jpg"
            title="รับประกันคุณภาพสินค้า"
            text="สินค้าถูกลิขสิทธิ์"
          />
        </Box>
        <Typography variant="h2" sx={{ color: COLORS.f1, mt: 2 }}>เริ่มค้นหาสิ่งที่ต้องการได้ที่ Mikan</Typography>

        <Box sx={{
          display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '3fr 2fr' },
        }}>
          <Box sx={{
            display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
          }}>
            <Box>
              <Typography variant="h3" sx={{ color: COLORS.f2, mt: 2 }}>1. ใส่จินตนาการของคุณลงไป</Typography>
              <Typography variant="body2" sx={{ color: COLORS.f2, mt: 1 }}>ใส่สิ่งที่คุณคิดในช่องค้นหาได้อย่างอิสระ</Typography>
            </Box>
            <Box>
              <Typography variant="h3" sx={{ color: COLORS.f2, mt: 2 }}>2. ค้นหาสิ่งที่ใช่สำหรับคุณ</Typography>
              <Typography variant="body2" sx={{ color: COLORS.f2, mt: 1 }}>เลือกสินค้าได้อย่างอิสระ</Typography>
            </Box>
            <Box>
              <Typography variant="h3" sx={{ color: COLORS.f2, mt: 2 }}>3. ชำระเงินผ่าน...</Typography>
              <Typography variant="body2" sx={{ color: COLORS.f2, mt: 1 }}>Mikan รับประกันไม่บิดและถูกลิขสิทธิ์</Typography>
            </Box>
            <Box>
              <Typography variant="h3" sx={{ color: COLORS.f2, mt: 2 }}>4. รอรับสินค้าตามที่ตกลงกับผู้ขาย</Typography>
              <Typography variant="body2" sx={{ color: COLORS.f2, mt: 1 }}>ตรวจสอบสินค้าที่ได้รับ และกดยินยอม</Typography>
            </Box>
          </Box>
          <CardMedia
            component="img"
            image="/video.svg"
            sx={{
              minHeight: '1rem',
              borderRadius: 3,
              objectFit: 'cover'
            }}
          />
        </Box>
      </Box>

    </Box>
  );
}