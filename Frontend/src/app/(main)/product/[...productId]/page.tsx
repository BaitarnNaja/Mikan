// src/app/(main)/product/[productId]/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Box, Typography, Button, CircularProgress, IconButton, Avatar, Grid } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import DynamicBreadcrumbs from "@/src/feature/products/componant/DynamicBreadcrumbs";
import { COLORS } from "@/src/styles";
import { useProductDetail } from "@/src/feature/products/hook/useProductDetail";
import ProductSlider from "@/src/feature/products/componant/ProductSlider";
import { useProductSearch } from "@/src/feature/products/hook/useProductSearch";
import { ProductOption } from "@/src/feature/products/type/products";
import { useProductRecommendations } from "@/src/feature/products/hook/useProductRecommendations";
import ProductCard from "@/src/feature/products/componant/ProductCart";
import { useAddToCart } from "@/src/feature/cart/hook/useAddToCart";
import Popup from "@/src/components/Popup";
import { paymentService } from "@/src/services/paymentService";
import { PaymentPreviewRequest } from "@/src/feature/payment/type/payment";
import api from "@/src/services/api";
import { useCheckoutStore } from "@/src/feature/itemstore/checkout";

export default function ProductDetailPage() {
    const params = useParams();
    const router = useRouter();

    // เช็คว่าถ้าเป็น Array ให้ดึงค่าแรกออกมา แต่ถ้าเป็น String อยู่แล้วก็ใช้ได้เลย
    const productId = Array.isArray(params?.productId)
        ? params?.productId[0]
        : params?.productId as string;

    const { product, loading, error } = useProductDetail(productId);
    const { recommendations, loadingRec } = useProductRecommendations();

    const { addToCart, loading: isAddingToCart } = useAddToCart();

    const [mainImage, setMainImage] = useState<string>('');
    const [selectedOption, setSelectedOption] = useState<ProductOption | null>(null);
    const [quantity, setQuantity] = useState<number>(1);

    const setPreviewData = useCheckoutStore((state) => state.setPreviewData);

    const [popup, setPopup] = useState({
        open: false,
        type: "info" as "success" | "error" | "info",
        title: "",
        message: ""
    });

    const closePopup = () => setPopup({ ...popup, open: false });

    useEffect(() => {
        if (product && product.images && product.images.length > 0) {
            setMainImage(product.images[0]);
        }
    }, [product]);

    // ฟังก์ชันกดเลือก Option (สี)
    const handleOptionClick = (opt: ProductOption) => {
        setSelectedOption(opt);
        // เปลี่ยนรูปหลักตาม Option
        if (opt.image) {
            setMainImage(opt.image);
        }
        setQuantity(1); // รีเซ็ตจำนวน
    };

    // ฟังก์ชันเพิ่ม-ลดจำนวน
    const handleDecrease = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));
    const handleIncrease = () => {
        const maxQty = selectedOption ? Number(selectedOption.quantity) : 99;
        setQuantity(prev => (prev < maxQty ? prev + 1 : prev));
    };

    const handleAddToCart = async () => {
        // 1. เช็คว่ามี Option ให้เลือกไหม ถ้ามีต้องบังคับให้เลือกก่อน
        if (product?.option && product.option.length > 0 && !selectedOption) {
            setPopup({
                open: true,
                type: "error",
                title: "แจ้งเตือน",
                message: "กรุณาเลือกตัวเลือกสินค้าก่อนเพิ่มลงตะกร้า"
            });
            return;
        }

        try {
            // สมมติว่ามีสถานะ loading อยู่แล้ว (isAddingToCart)
            await addToCart({
                productId: productId,
                productOptionId: selectedOption?.id || "",
                quantity: quantity
            });

            // 2. แสดง Popup เมื่อสำเร็จ
            setPopup({
                open: true,
                type: "success",
                title: "สำเร็จ!",
                message: "เพิ่มสินค้าลงในตะกร้าเรียบร้อยแล้ว"
            });

        } catch (err) {
            // 3. แสดง Popup เมื่อเกิด Error (เช่น สินค้าหมด หรือ Server มีปัญหา)
            setPopup({
                open: true,
                type: "error",
                title: "เกิดข้อผิดพลาด",
                message: "ไม่สามารถเพิ่มสินค้าได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง"
            });
        }
    };


    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <CircularProgress sx={{ color: '#E66625' }} />
            </Box>
        );
    }

    if (error || !product) {
        return <Typography sx={{ textAlign: 'center', mt: 10, color: 'red' }}>{error || "ไม่พบข้อมูลสินค้า"}</Typography>;
    }


    //  คำนวณราคาปัจจุบัน (ถ้ามี Option ให้ใช้ราคา Option ถ้าไม่มีใช้ราคาหลัก)
    const currentPrice = selectedOption?.price
        ? Number(selectedOption.price)
        : product.price?.amount;

    const handleBuyNow = async () => {
        try {
            // 1. ตรวจสอบว่าสินค้ามี option ให้เลือกไหม ถ้ามีต้องบังคับเลือกก่อน
            if (product?.option && product.option.length > 0 && !selectedOption) {
                setPopup({
                    open: true,
                    type: "error",
                    title: "แจ้งเตือน",
                    message: "กรุณาเลือกตัวเลือกสินค้าก่อนดำเนินการชำระเงิน"
                });
                return;
            }

            // const optionId = selectedOption?.id || "";

            const payload: PaymentPreviewRequest = {
                items: [
                    {
                        productOptionId: selectedOption?.id,
                        quantity: quantity
                    }
                ],
            };

            console.log("Preview:", payload.items);

            const response = await paymentService.previewPayment(payload);
            console.log("Preview Response:", response);

            // const res = await api.post('/v1/orders', payload);
            if (response.code === "200") {
                setPreviewData(response.data);
                const optionId = selectedOption?.id || "";
                router.push(`/usercart/checkout?optionid=${optionId}`)
                //     // router.push(`/usercart/checkout/checkstatus?orderId=${orderId}`);
            } else {
                // ถ้าหลังบ้านส่ง Error อะไรกลับมา (รวมถึงพวก Validation) ให้พ่นเตือนตรงนี้
                alert(response.message || "ไม่สามารถดึงข้อมูลพรีวิวสินค้าได้");
            }

        } catch (error) {
            console.error("Payment preview failed:", error);
            setPopup({
                open: true,
                type: "error",
                title: "เกิดข้อผิดพลาด",
                message: "ไม่สามารถดำเนินการชำระเงินได้ในขณะนี้ กรุณาลองใหมี่อีกครั้ง"
            });
        }
    };

    return (
        <Box sx={{ minHeight: '100dvh', pb: 8 }}>
            <DynamicBreadcrumbs
                items={[
                    { label: 'หน้าหลัก', path: '/' },
                    { label: 'สินค้าทั้งหมด', path: '/products/all' },
                    { label: product.productName }
                ]}
            />

            <Box sx={{ maxWidth: '1200px', mx: 'auto', p: { xs: 2, md: 4 } }}>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 4, md: 6 } }}>

                    {/* ==============================================
              ฝั่งซ้าย: รูปภาพ
              ============================================== */}
                    <Box sx={{ width: { xs: '100%', md: '45%' }, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {/* รูปภาพหลัก */}
                        <Box
                            component="img"
                            src={mainImage || product?.images?.[0] || undefined}
                            alt={product.productName}
                            sx={{
                                width: '100%', aspectRatio: '1/1', objectFit: 'cover',
                                borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                                border: '1px solid #f0f0f0'
                            }}
                        />

                        {/* กล่องเลือกรูปภาพ (Thumbnails) */}
                        <Box sx={{ display: 'flex', gap: 1.5, overflowX: 'auto', pb: 1 }}>

                            {/* 1. รูปภาพทั่วไปจาก product.images */}
                            {product.images?.map((img, index) => (
                                <Box
                                    key={`img-${index}`}
                                    component="img"
                                    src={img}
                                    onClick={() => setMainImage(img)}
                                    sx={{
                                        width: '80px', height: '80px', objectFit: 'cover', borderRadius: 2, cursor: 'pointer',
                                        border: mainImage === img ? '2px solid #E66625' : '1px solid #e0e0e0',
                                        transition: '0.2s', flexShrink: 0,
                                        '&:hover': { borderColor: '#E66625' }
                                    }}
                                />
                            ))}

                            {/* 2. รูปภาพจาก Option (ถ้ามี) */}
                            {product.option?.map((opt) => {
                                // ถ้า Option ไหนไม่มีรูป ให้ข้ามไป ไม่ต้องแสดง Thumbnail
                                if (!opt.image) return null;

                                return (
                                    <Box
                                        key={`opt-${opt.id}`}
                                        component="img"
                                        src={opt.image}
                                        // สั่งให้เรียกฟังก์ชันเลือก Option ตัวเดียวกับปุ่มกดเลย
                                        onClick={() => handleOptionClick(opt)}
                                        sx={{
                                            width: '80px', height: '80px', objectFit: 'cover', borderRadius: 2, cursor: 'pointer',
                                            // เช็คสถานะเพื่อตีกรอบสีส้ม (เช็คจาก mainImage ว่าตรงกับรูป opt ไหม)
                                            border: mainImage === opt.image ? '2px solid #E66625' : '1px solid #e0e0e0',
                                            transition: '0.2s', flexShrink: 0,
                                            '&:hover': { borderColor: '#E66625' }
                                        }}
                                    />
                                );
                            })}

                        </Box>
                    </Box>

                    {/* ==============================================
              ฝั่งขวา: รายละเอียด ราคา และตัวเลือก
              ============================================== */}
                    <Box sx={{ width: { xs: '100%', md: '55%' }, display: 'flex', flexDirection: 'column' }}>

                        <Typography variant="h2" sx={{ color: '#D35400', mb: 3 }}>
                            {product.productName}
                        </Typography>

                        {/* แถบราคา (เปลี่ยนตาม Option อัตโนมัติ) */}
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: '#FFF3E0', borderRadius: 2, p: 2, mb: 4 }}>
                            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#E66625' }}>
                                {currentPrice?.toFixed(2)} {product.price?.currency || 'THB'}
                            </Typography>

                            {product.merchant && (
                                <Box onClick={() => router.push(`/shop/${product.merchant.id}`)}
                                    sx={{ display: 'flex', alignItems: 'center', gap: 1, bgcolor: '#FFF', px: 1.5, py: 0.5, borderRadius: 5 }}>
                                    <Avatar src={product.merchant.logImg} sx={{ width: 24, height: 24 }} />
                                    <Typography sx={{ fontSize: '0.85rem', fontWeight: 500, color: '#555', cursor: 'pointer', }}>
                                        {product.merchant.shopName}
                                    </Typography>
                                </Box>
                            )}
                        </Box>

                        {/* ตัวเลือกสินค้า (สี) */}
                        {product.option && product.option.length > 0 && (
                            <Box sx={{ mb: 4 }}>
                                <Typography sx={{ fontWeight: 'bold', color: COLORS.f1, mb: 1.5 }}>สี / รูปแบบ</Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                                    {product.option.map((opt) => (
                                        <Button
                                            key={opt.id}
                                            variant="outlined"
                                            onClick={() => handleOptionClick(opt)}
                                            disabled={Number(opt.quantity) <= 0}
                                            sx={{
                                                color: selectedOption?.id === opt.id ? '#E66625' : '#555',
                                                borderColor: selectedOption?.id === opt.id ? '#E66625' : '#e0e0e0',
                                                bgcolor: selectedOption?.id === opt.id ? '#FFF5F0' : 'transparent',
                                                borderRadius: 2, px: 3, py: 1, textTransform: 'none',
                                                '&:hover': { borderColor: '#E66625', bgcolor: '#FFF5F0' }
                                            }}
                                        >
                                            {opt.optionName}
                                        </Button>
                                    ))}
                                </Box>
                            </Box>
                        )}

                        {/* จำนวน (Quantity) */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 5 }}>
                            <Typography sx={{ fontWeight: 'bold', color: COLORS.f1 }}>จำนวน</Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid #e0e0e0', borderRadius: 2 }}>
                                <IconButton size="small" onClick={handleDecrease} disabled={quantity <= 1}>
                                    <RemoveIcon fontSize="small" />
                                </IconButton>
                                <Typography sx={{ width: '40px', textAlign: 'center', fontWeight: 500 }}>
                                    {quantity}
                                </Typography>
                                <IconButton
                                    size="small"
                                    onClick={handleIncrease}
                                    disabled={selectedOption ? quantity >= Number(selectedOption.quantity) : false}
                                >
                                    <AddIcon fontSize="small" />
                                </IconButton>
                            </Box>

                            {selectedOption && (
                                <Typography sx={{ fontSize: '0.85rem', color: '#888' }}>
                                    มีสินค้า {selectedOption.quantity} ชิ้น
                                </Typography>
                            )}
                        </Box>

                        {/* ปุ่ม Actions */}
                        <Box sx={{ display: 'flex', gap: 2, mt: 'auto' }}>
                            <Button
                                variant="outlined"
                                startIcon={isAddingToCart ? <CircularProgress size={20} color="inherit" /> : <ShoppingCartOutlinedIcon />}
                                onClick={handleAddToCart}
                                disabled={isAddingToCart || (product?.option?.length > 0 && !selectedOption)}
                                sx={{
                                    flex: 1, color: '#E66625', borderColor: '#E66625', py: 1.5, fontSize: '1rem', fontWeight: 'bold', borderRadius: 2,
                                    '&:hover': { borderColor: '#D35400', bgcolor: '#FFF5F0' },
                                    '&:disabled': { opacity: 0.7 }
                                }}
                            >
                                {isAddingToCart ? 'กำลังเพิ่ม...' : 'เพิ่มในตะกร้า'}
                            </Button>
                            <Popup
                                open={popup.open}
                                type={popup.type}
                                title={popup.title}
                                message={popup.message}
                                onClose={closePopup}
                            />
                            <Button
                                variant="contained"
                                sx={{
                                    flex: 1, bgcolor: '#E66625', color: '#fff', py: 1.5, fontSize: '1rem', fontWeight: 'bold', borderRadius: 2, boxShadow: 'none',
                                    '&:hover': { bgcolor: '#D35400', boxShadow: 'none' }
                                }}
                                onClick={handleBuyNow}

                            >
                                ซื้อตอนนี้
                            </Button>
                        </Box>

                    </Box>
                </Box>
            </Box>

            {/* ==============================================
          ส่วนล่าง: รายละเอียดสินค้า 
          ============================================== */}
            {/* สินค้าที่คุณอาจชอบ */}
            <Box sx={{ maxWidth: '1200px', mx: 'auto', px: { xs: 2, md: 4 }, mt: 6 }}>
                <Box sx={{ bgcolor: '#FFF8F0', p: 2, borderRadius: 1, mb: 2 }}>
                    <Typography sx={{ fontWeight: 'bold', color: '#333' }}>
                        รายละเอียดสินค้า
                    </Typography>
                </Box>
                <Box sx={{ px: 2 }}>
                    <Typography sx={{ color: '#555', lineHeight: 1.8, fontSize: '0.95rem' }}>
                        {product.description}
                    </Typography>
                </Box>
                <Box sx={{ bgcolor: COLORS.cream, py: 1.5, px: 2, mb: 3 }}>
                    <Typography sx={{ fontWeight: 'bold', color: COLORS.f3 }}>สินค้าที่คุณอาจชอบ</Typography>
                </Box>

                <ProductSlider id="recommend-slider" response={recommendations} title="" />

            </Box>
        </Box>
    );
}