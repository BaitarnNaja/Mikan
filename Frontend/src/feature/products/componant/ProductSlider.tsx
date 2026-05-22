'use client';
import { Box, Typography, IconButton, Container } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
// 1. ตรวจสอบ: Import โมดูลให้ครบ
import { Navigation, Pagination, FreeMode, Mousewheel } from 'swiper/modules';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

// 2. ตรวจสอบ: Import CSS ให้ครบ (ถ้า TypeScript ฟ้องแดง ให้แก้ .d.ts ตามเดิม)
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/free-mode';

import { ApiResponse, ProductListResponse } from '../type/products';
import ProductCard from './ProductCart';
import { COLORS } from '@/src/styles';

interface ProductSliderProps {
    response?: ProductListResponse | null;
    title?: string;
    id: string;
}

const ProductSlider = ({ response, title, id }: ProductSliderProps) => {
    console.log("Slider Response:", response)
    if (!response || !response.data) return null;

    const nextBtnClass = `next-${id}`;
    const prevBtnClass = `prev-${id}`;
    const paginationClass = `pagination-${id}`;
    return (
        <Box sx={{ pt: { xs: 1, md: 4 }, maxWidth: '1100px', width: '100%' }}>
            <Typography
                variant="h2"
                sx={{ color: COLORS.f1, mb: { xs: 2, md: 2 } }}
            >
                {title}
            </Typography>

            <Box sx={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
                <Swiper
                    modules={[Navigation, Pagination, FreeMode, Mousewheel]}
                    spaceBetween={16}
                    slidesPerView={'auto'} // กลับมาใช้ auto เหมือนเดิม
                    grabCursor={true}
                    freeMode={true}
                    mousewheel={{ forceToAxis: true }}
                    navigation={{
                        nextEl: `.${nextBtnClass}`,
                        prevEl: `.${prevBtnClass}`,
                    }}
                    pagination={{
                        el: `.${paginationClass}`,
                        type: 'progressbar',
                    }}
                    breakpoints={{
                        600: { spaceBetween: 10 },
                        900: { spaceBetween: 12 },
                    }}
                    style={{
                        paddingBottom: '20px',
                        width: '100%',
                    }}
                >
                    {response.data.map((product) => (
                        <SwiperSlide
                            key={product.id}
                            style={{
                                width: 'auto',   // ให้กว้างตาม Content ข้างใน
                                height: 'auto'   // ให้การ์ดทุกใบสูงเท่ากัน
                            }}
                        >
                            <Box
                                sx={{
                                    // ย้ายความกว้างที่เคยอยู่ในการ์ด มาไว้ที่กล่องครอบตรงนี้แทน!
                                    width: {
                                        xs: '8.125rem',
                                        sm: '10rem',
                                        md: '11rem',
                                        lg: '14rem'
                                    },
                                    height: '100%', // ดันให้สูงเต็ม SwiperSlide
                                    boxSizing: 'border-box',
                                }}
                            >
                                <ProductCard product={product} />
                            </Box>
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* 3. แถบควบคุมด้านล่าง (ปุ่ม + Scrollbar) */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: { xs: 1, md: 2 }, px: 1 }}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        {/* ต้องมี Class ที่ตรงกับที่ตั้งใน Navigation */}
                        <IconButton className={prevBtnClass} sx={{ bgcolor: '#F5F5F5', '&:hover': { bgcolor: '#EEEEEE' }, width: 35, height: 35, zIndex: 10 }}>
                            <ArrowBackIosNewIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                        <IconButton className={nextBtnClass} sx={{ bgcolor: '#F5F5F5', '&:hover': { bgcolor: '#EEEEEE' }, width: 35, height: 35, zIndex: 10 }}>
                            <ArrowForwardIosIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                    </Box>

                    {/* Progress Bar (Scrollbar) - **ไม่มีสีพื้นหลังตามโจทย์** */}
                    <Box className={paginationClass} sx={{
                        flexGrow: 1,
                        position: 'relative !important',
                        height: '4px !important',
                        bgcolor: 'rgba(0,0,0,0.05) !important',
                        borderRadius: 2,
                        overflow: 'hidden',
                        borderBottom: '1px solid rgba(0,0,0,0.05)',
                        '& .swiper-pagination-progressbar-fill': {
                            bgcolor: '#E67E22 !important',
                        }
                    }} />
                </Box>
            </Box>
        </Box>
    );
};

export default ProductSlider;