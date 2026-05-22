'use client'

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
    Box,
    Container,
    Typography,
    Stack,
    Divider,
    Paper,
    CircularProgress
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import HomeIcon from '@mui/icons-material/Home';
import { StoreButton } from '@/src/components/StoreButton';
import { useCheckout } from '@/src/feature/payment/hooks/usePaymentPreview';
import { useCheckoutStore } from '@/src/feature/itemstore/checkout';
import { orderService } from '@/src/services/orderService';
import { CreateOrderPayload } from '@/src/services/orderService';
import { paymentService } from '@/src/services/paymentService';

export default function CheckoutPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const idsString = searchParams.get('ids');

    // 💡 ดึงสถานะโหลดเฉพาะฝั่ง Address (ที่อยู่จัดส่ง) ของ Hook ออกมาคุมสถานะ
    const { isLoading, address } = useCheckout(idsString);

    const [loading, setLoading] = useState<boolean>(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const previewData = useCheckoutStore((state) => state.previewData);
    const setPreviewData = useCheckoutStore((state) => state.setPreviewData);
    const setOrderResultData = useCheckoutStore((state) => state.setOrderResultData);

    // ================= [ ลำดับการเช็คสถานะโหลดที่ถูกต้อง ] =================
    // แก้ไขในบล็อก useEffect ของไฟล์ src/app/usercart/checkout/page.tsx
    useEffect(() => {
        const fetchPreviewData = async () => {
            const cartItemIdsParam = searchParams.get('ids');
            const itemsParam = searchParams.get('items'); // ดึงก้อนข้อมูล JSON ที่ส่งมาจากหน้ารถเข็น
            const optionid = searchParams.get('optionid');

            if (!cartItemIdsParam && !optionid) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);

                // ==========================================
                // 💡 เคสที่ 1: มาจากหน้ารถเข็น (ดึงข้อมูลจริงมาถอดรหัส)
                // ==========================================
                if (cartItemIdsParam && itemsParam) {
                    const selectedCartItemIds = cartItemIdsParam.split(',').map(id => id.trim());

                    // 🎯 แกะข้อความ JSON ออกมาเป็นโครงสร้าง Array วัตถุข้อมูลจริง [ {productOptionId, quantity} ]
                    const realItemsFromCart = JSON.parse(itemsParam);

                    const payload = {
                        // items: [], // ✨ ของจริงแท้แน่นอน มีทั้งเลข Option ID และจำนวนชิ้นจริงจากรถเข็น
                        selectedCartItemIds: selectedCartItemIds,
                        valid: true
                    };

                    console.log("ยิงพรีวิวรถเข็นด้วยข้อมูลจริง 100% ตามสเปก Swagger:", payload);

                    const response = await paymentService.previewPaymentCart(payload);
                    console.log(response)
                    if (response?.code === "200" || response?.data) {
                        setPreviewData(response.data || response);
                    }
                    return;
                }

                // ==========================================
                // เคสที่ 2: มาจาก Buy Now ตัวเดิม
                // ==========================================
                if (optionid) {
                    const payload = {
                        items: [{
                            productOptionId: String(optionid),
                            quantity: 1
                        }],
                        selectedCartItemIds: [],
                        valid: true
                    };

                    const response = await paymentService.previewPayment(payload);
                    if (response?.code === "200" || response?.data) {
                        setPreviewData(response.data || response);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch preview data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPreviewData();
    }, [searchParams, setPreviewData]);

    // 1. ระหว่างที่สตรีมดึงข้อมูลที่อยู่ ให้ขึ้นตัวหมุนรอโหลดก่อน (หลุดค้างแน่นอน)
    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress color="warning" />
            </Box>
        );
    }

    // 2. ตรวจสอบว่ามีข้อมูล previewData ยิงส่งข้ามมาจากหน้าแรกจริงไหม 
    if (!previewData || !previewData.shops || previewData.shops.length === 0) {
        return (
            <Box sx={{ p: 5, textAlign: 'center', mt: 8 }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                    ไม่พบข้อมูลรายการสั่งซื้อ หรือเซสชันหมดอายุ
                </Typography>
                <StoreButton bg="brandPrimary" onClick={() => router.push('/')}>
                    กลับไปเลือกสินค้า
                </StoreButton>
            </Box>
        );
    }

    // =================================================================

    const handleSubmit = async () => {
        try {
            setIsSubmitting(true);

            const optionid = searchParams.get('optionid');

            const orderItemsPayload = previewData?.shops?.flatMap((shop: any) => {
                // ดักจับ: ลองเช็คทั้งคีย์ productItems หรือ items ของแต่ละร้านค้า
                const itemsList = shop.productItems || shop.items || [];

                return itemsList.flatMap((item: any) => {

                    // 💡 เคสที่ 1: ถ้าเป็นข้อมูลจากรถเข็น สินค้าจะซ่อนอยู่ใน optionItems เป็นอาเรย์
                    if (item.optionItems && item.optionItems.length > 0) {
                        return item.optionItems.map((opt: any) => ({
                            productOptionId: opt.optionId || opt.productOptionId || "",
                            quantity: Number(opt.quantity) || 1
                        }));
                    }

                    // 💡 เคสที่ 2: ถ้าเป็นเคส Buy Now (ไม่มี optionItems ซ้อนข้างใน) ให้แกะจากตัวมันเองตรงๆ
                    const finalOptionId = optionid || item.productOptionId || item.optionId || "";
                    return [{
                        productOptionId: finalOptionId,
                        quantity: Number(item.quantity) || 1
                    }];
                });
            }) || [];

            console.log("Payload รถเข็น/Buy Now สรุปท้ายสุด:", orderItemsPayload);

            const payload: CreateOrderPayload = {
                shippingAddress: {
                    firstname: address.firstname,
                    lastname: address.lastname,
                    address: address.address,
                    road: address.road || "",
                    district: address.district,
                    subdistrict: address.subdistrict,
                    province: address.province,
                    postcode: address.postcode,
                    phone: address.phone
                },
                items: orderItemsPayload
            };

            // ยิงสร้างออเดอร์ไปยังเส้น POST /api/v1/orders
            const response = await orderService.postOrder(payload);
            console.log("Preview Response ดิบๆ จากหลังบ้าน:", response);

            if (response.code === "200") {
                setOrderResultData(response.data);
                const orderId = response.data.orderId;
                router.push(`/usercart/checkout/checkstatus?orderId=${orderId}`);
            } else {
                alert(response.message || "เกิดข้อผิดพลาดในการสั่งซื้อสินค้า");
            }

        } catch (error) {
            console.error("Failed to place order:", error);
            alert("ระบบขัดข้อง ไม่สามารถสั่งซื้อสินค้าได้ในขณะนี้");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Box sx={{ minHeight: '100vh' }}>
            <Container maxWidth="md" sx={{ mt: 4, pb: 15 }}>

                {/* 1. ส่วนที่อยู่จัดส่ง */}
                <Paper
                    variant="outlined"
                    sx={{
                        p: 2,
                        borderRadius: 3,
                        borderColor: '#E67E22',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 2,
                        mb: 4,
                        position: 'relative'
                    }}
                >
                    <LocationOnIcon sx={{ color: '#E67E22', mt: 0.5 }} />
                    <Box sx={{ flexGrow: 1 }}>
                        {address ? (
                            <>
                                <Stack direction="row" spacing={1} sx={{ alignItems: "center", fontWeight: "bold" }}>
                                    <Typography color="#E67E22">
                                        {address.firstname} {address.lastname}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        ({address.phone})
                                    </Typography>
                                </Stack>
                                <Typography variant="body2" sx={{ mt: 0.5 }}>
                                    {address.address} {address.road && `ถ.${address.road}`} {address.subdistrict} {address.district}
                                </Typography>
                                <Typography variant="body2">
                                    จ.{address.province} {address.postcode}
                                </Typography>
                            </>
                        ) : (
                            <Typography color="text.secondary">กรุณาเพิ่มที่อยู่จัดส่ง</Typography>
                        )}
                    </Box>
                    <Typography
                        variant="body2"
                        sx={{ color: '#E67E22', cursor: 'pointer', mt: 0.5 }}
                        onClick={() => router.push(`/userprofile`)}
                        style={{
                            position: 'absolute',
                            top: '50%',
                            right: '16px',
                            transform: 'translateY(-50%)',
                        }}
                    >
                        เปลี่ยน
                    </Typography>
                </Paper>

                {/* 2. รายการสินค้าและยอดรวม แยกตามร้านค้า */}
                {previewData.shops.map((shop: any, sIdx: number) => (
                    <Box key={sIdx} sx={{ mb: 4 }}>
                        <Stack direction="row" spacing={1} sx={{ mb: 1.5, alignItems: "center", fontWeight: "bold" }}>
                            <HomeIcon sx={{ color: '#8B4513', fontSize: 20 }} />
                            <Typography color="#8B4513">
                                {shop.shopName || 'Unknown Store'}
                            </Typography>
                        </Stack>

                        <Box sx={{ bgcolor: '#FFF2DE', borderRadius: 4, p: 3, minWidth: '100%' }}>
                            {shop.productItems?.map((product: any, pIdx: number) => (
                                product.optionItems?.map((item: any, iIdx: number) => (
                                    <Box key={item.cartItemId || iIdx}>
                                        <Stack direction="row" sx={{ alignItems: "center", fontWeight: "bold" }} spacing={2}>
                                            <Box
                                                component="img"
                                                src={item.image || '/item.png'}
                                                sx={{ width: 80, height: 80, borderRadius: 1, bgcolor: '#fff', objectFit: 'cover' }}
                                            />
                                            <Box sx={{ flexGrow: 1 }}>
                                                <Typography variant="body2" >{product.productName}</Typography>
                                                <Typography variant="caption" color="text.secondary">{item.optionName}</Typography>
                                            </Box>
                                            <Typography variant="body2" sx={{ minWidth: 50, textAlign: 'center' }}>
                                                x{item.quantity}
                                            </Typography>
                                        </Stack>
                                        <Divider sx={{ my: 2, opacity: 0.5 }} />
                                    </Box>
                                ))
                            ))}

                            {shop.shopSummary && (
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', mt: 2, fontWeight: "bold" }}>
                                    <Stack spacing={1} sx={{ minWidth: 200 }}>
                                        <Stack direction="row" sx={{ justifyContent: "space-between" }}>
                                            <Typography variant="body2" color="text.secondary">ราคาสินค้า</Typography>
                                            <Typography variant="body2" >
                                                {shop.shopSummary.subtotal || 0} <Typography component="span" variant="caption">THB</Typography>
                                            </Typography>
                                        </Stack>
                                        <Stack direction="row" sx={{ justifyContent: "space-between", fontWeight: "bold" }}>
                                            <Typography variant="body2" color="text.secondary">ค่าส่ง</Typography>
                                            <Typography variant="body2" >
                                                {shop.shopSummary.shippingFee || 0} <Typography component="span" variant="caption">THB</Typography>
                                            </Typography>
                                        </Stack>
                                        <Stack direction="row" sx={{ justifyContent: "space-between", mt: 1, fontWeight: "bold" }}>
                                            <Typography variant="subtitle2" color="#E67E22">ยอดรวมร้านนี้</Typography>
                                            <Typography variant="subtitle2" color="#E67E22">
                                                {(shop.shopSummary.subtotal || 0) + (shop.shopSummary.shippingFee || 0)} <Typography component="span" variant="caption">THB</Typography>
                                            </Typography>
                                        </Stack>
                                    </Stack>
                                </Box>
                            )}
                        </Box>
                    </Box>
                ))}

                {/* 3. แถบสรุปยอดรวมสุทธิ Fixed ด้านล่าง */}
                <Box
                    sx={{
                        position: 'fixed', bottom: 0, left: 0, right: 0,
                        bgcolor: 'white', boxShadow: '0 -2px 10px rgba(0,0,0,0.05)',
                        p: 2, display: 'flex', justifyContent: 'flex-end', alignItems: 'center',
                        zIndex: 1000, gap: 3
                    }}
                >
                    <Stack direction="row" sx={{ alignItems: "center", fontWeight: "bold" }} spacing={2}>
                        <Typography variant="subtitle1" >ยอดชำระทั้งหมด</Typography>
                        <Typography variant="h6" color="#E67E22">
                            {previewData.summary?.total || 0} <Typography component="span" variant="caption">THB</Typography>
                        </Typography>
                    </Stack>
                    <StoreButton
                        bg="brandPrimary"
                        size="large"
                        onClick={handleSubmit}
                        disabled={!address || isSubmitting}
                    >
                        {isSubmitting ? "กำลังสั่งซื้อ..." : "สั่งสินค้า"}
                    </StoreButton>
                </Box>

            </Container>
        </Box>
    );
}