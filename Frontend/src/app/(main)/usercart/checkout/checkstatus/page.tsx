'use client'

import React, { useEffect, useState } from 'react';
import {
    Box,
    Container,
    Typography,
    Stack,
    Avatar,
    CircularProgress,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { StoreButton } from '@/src/components/StoreButton';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { OrderDetail } from '@/src/feature/cart/type/cart';
import { orderService } from '@/src/services/orderService';
import { useCheckoutStore } from '@/src/feature/itemstore/checkout';
import { useTheme, useMediaQuery } from '@mui/material';

export default function OrderSuccessPage() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId');
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [orderData, setOrderData] = useState<OrderDetail | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const previewData = useCheckoutStore((state) => state.previewData);
    const orderResultData = useCheckoutStore((state) => state.orderResultData);

    useEffect(() => {
        const fetchOrderData = async () => {
            try {
                setLoading(true);

                if (orderResultData) {
                    const combinedData = {
                        ...orderResultData,
                        items: orderResultData.items ||
                            orderResultData.productItems ||
                            previewData?.shops?.[0]?.productItems ||
                            previewData?.shops?.[0]?.items || []
                    };
                    setOrderData(combinedData);
                    setLoading(false);
                    return;
                }

                if (orderId) {
                    const response = await orderService.getOrderDetail(orderId);
                    const resData = response?.data || response;

                    const formattedData = {
                        ...resData,
                        items: resData?.items || resData?.productItems || []
                    };
                    setOrderData(formattedData);
                }
            } catch (error) {
                console.error("Failed to load order details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrderData();
    }, [orderId, orderResultData, previewData]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <CircularProgress sx={{ color: '#E66625' }} />
            </Box>
        );
    }

    if (!orderData) {
        return (
            <Container maxWidth="sm" sx={{ mt: 8, textAlign: 'center' }}>
                <Typography color="error" variant="h6" sx={{ fontWeight: 'bold', mb: 4 }}>
                    ไม่พบข้อมูลคำสั่งซื้อ
                </Typography>
                <Link href="/" passHref style={{ textDecoration: 'none' }}>
                    <StoreButton bg="brandPrimary" size="large">
                        กลับหน้าหลัก
                    </StoreButton>
                </Link>
            </Container>
        );
    }

    const finalTotalPrice = (orderData as any)?.totalAmount || (orderData as any)?.summary?.total || 0;
    const finalOrderId = orderData.id || (orderData as any).orderId || orderId;

    return (
        <Box sx={{ minHeight: '100vh', pt: isMobile ? 4 : 8, pb: 8 }}>
            <Container maxWidth="md" sx={{ textAlign: 'center' }}>
                
                {/* 1. วงกลมเครื่องหมายถูกสีเขียว (Success Icon) */}
                <Avatar
                    sx={{
                        width: isMobile ? 90 : 110,
                        height: isMobile ? 90 : 110,
                        bgcolor: '#66BB6A',
                        margin: '0 auto',
                        mb: 3,
                        boxShadow: '0 4px 10px rgba(102, 187, 106, 0.2)'
                    }}
                >
                    <CheckIcon sx={{ fontSize: isMobile ? 55 : 70, color: '#fff' }} />
                </Avatar>
                <Typography 
                    variant={isMobile ? "h5" : "h2"} 
                    sx={{ fontWeight: "bold", color: "#C05621", mb: 1, letterSpacing: '0.5px' }}
                >
                    ขอบคุณสำหรับการสั่งซื้อ
                </Typography>
                <Typography variant="body1" sx={{ color: '#C05621', mb: 6, fontWeight: 500 }}>
                    หมายเลขคำสั่งซื้อ <span style={{ color: '#C05621' }}>#{finalOrderId}</span>
                </Typography>

                {/* 3. กล่องแสดงสรุปรายการคำสั่งซื้อสไตล์มินิมอลตามรูปภาพ */}
                <Box sx={{ textAlign: 'left', maxWidth: '600px', margin: '0 auto', mb: 6, px: isMobile ? 2 : 0 }}>
                    <Typography 
                        variant="subtitle1" 
                        sx={{ mb: 3, fontWeight: 'bold', color: '#C05621', fontSize: '1.1rem' }}
                    >
                        สรุปรายการคำสั่งซื้อ
                    </Typography>

                    <Stack spacing={3}>
                        {orderData?.items?.map((item: any, index: number) => {
                            const productName = item.productName || "ไม่ระบุชื่อสินค้า";

                            return (
                                <Box key={index} sx={{ width: '100%' }}>
                                    {/* วนลูปย่อยแสดงตัวเลือกตามสเปกแถวเรียงแนวนอนแบบคลีน ไม่ตีกรอบ */}
                                    {item.optionItems?.map((option: any, optIndex: number) => {
                                        const optionName = option.optionName || option.optionId || "มาตรฐาน";
                                        const basePrice = option.amount || option.price || 0;
                                        const quantity = option.quantity || 1;
                                        const currentOptionTotalPrice = basePrice * quantity;
                                        const itemImage = option.image || option.imageUrl;

                                        return (
                                            <Stack 
                                                key={optIndex} 
                                                direction="row" 
                                                sx={{ alignItems: "center", justifyContent: "space-between", mb: 2 }} 
                                                spacing={3}
                                            >
                                                {/* ฝั่งซ้าย: รูปภาพ และ ชื่อสินค้า+ตัวเลือก */}
                                                <Stack direction="row" spacing={2} sx={{ alignItems: "center", flexGrow: 1 }}>
                                                    {/* รูปสินค้าทรงสี่เหลี่ยมพื้นหลังเทาจาง */}
                                                    <Box
                                                        component="img"
                                                        src={itemImage || '/item.png'}
                                                        alt={productName}
                                                        sx={{
                                                            width: isMobile ? 65 : 75,
                                                            height: isMobile ? 65 : 75,
                                                            bgcolor: '#E2E8F0',
                                                            objectFit: 'cover',
                                                            borderRadius: 0, // รูปร่างเหลี่ยมตามดีไซน์ของคุณ
                                                            flexShrink: 0
                                                        }}
                                                        onError={(e: any) => {
                                                            e.target.src = '/item.png';
                                                        }}
                                                    />

                                                    {/* รายละเอียดข้อความ */}
                                                    <Box>
                                                        <Typography variant="body2" sx={{ fontWeight: "500", color: "#1A202C", lineHeight: 1.3 }}>
                                                            {productName}
                                                        </Typography>
                                                        <Typography variant="caption" sx={{ color: '#4A5568', display: 'block', mt: 0.3 }}>
                                                            {optionName} {quantity > 1 ? `(x${quantity})` : ''}
                                                        </Typography>
                                                    </Box>
                                                </Stack>

                                                {/* ฝั่งขวา: ราคาสรุปของแถวนั้น ๆ */}
                                                <Typography 
                                                    variant="body2" 
                                                    sx={{ fontWeight: "500", color: "#1A202C", whiteSpace: 'nowrap' }}
                                                >
                                                    {Number(currentOptionTotalPrice).toLocaleString()} ฿ THB
                                                </Typography>
                                            </Stack>
                                        );
                                    })}
                                </Box>
                            );
                        })}
                    </Stack>

                    {/* ท่อนราคารวมสุทธิล่างสุด (ซ่อนไว้หรือแสดงตามความเหมาะสม หากต้องการแบบรูปภาพเป๊ะ ๆ สามารถเปิดคอมเมนต์ท่อนนี้ได้ครับ) */}
                    {/* <Box sx={{ mt: 4, pt: 2, borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#C05621' }}>ยอดชำระสุทธิ</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#C05621' }}>{Number(finalTotalPrice).toLocaleString()} ฿ THB</Typography>
                    </Box> 
                    */}
                </Box>

                {/* 4. ปุ่มกลับหน้าหลักสีส้มอิฐตรงกลาง */}
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <Link href="/" passHref style={{ textDecoration: 'none' }}>
                        <StoreButton 
                            bg="brandPrimary" 
                            size="large"
                            // sx={{ 
                            //     bgcolor: '#D36135', // ส้มอิฐตามดีไซน์ UI ของคุณ
                            //     px: 4, 
                            //     py: 1, 
                            //     borderRadius: '6px',
                            //     '&:hover': { bgcolor: '#B84A22' } 
                            // }}
                        >
                            กลับหน้าหลัก
                        </StoreButton>
                    </Link>
                </Box>

            </Container>
        </Box>
    );
}