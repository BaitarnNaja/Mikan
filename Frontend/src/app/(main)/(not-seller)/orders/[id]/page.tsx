// src/app/(main)/(not-seller)/orders/[id]/page.tsx
"use client";
import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { Box, Typography, Button, Divider, CircularProgress, Paper, Dialog, DialogTitle, DialogContent, Rating } from '@mui/material';
import { COLORS } from '@/src/styles';
import dayjs from 'dayjs';
import buddhistEra from 'dayjs/plugin/buddhistEra';
import 'dayjs/locale/th';
import { useOrderDetail } from '@/src/feature/cart/hook/useOrderDetail';
import { useRouter } from 'next/navigation';
import { useSubmitRating } from '@/src/feature/cart/hook/ีuseSumitRating';
dayjs.extend(buddhistEra);
dayjs.locale('th');

export default function OrderDetailPage() {
    const params = useParams();
    const router = useRouter();
    const orderId = params.id as string;
    const { order, loading, error, mutate } = useOrderDetail(orderId);
    const { handleSubmitRating, isSubmitting } = useSubmitRating();

    const onSubmitRating = async () => {
        if (ratingValue) {
            await handleSubmitRating(orderId, ratingValue, () => {
                setRatingOpen(false);
                setShowSuccess(true);
                if (mutate) mutate(); // รีเฟรชสถานะหน้าจอ
            });
        }
    };
    const [ratingOpen, setRatingOpen] = useState(false);
    const [ratingValue, setRatingValue] = useState<number | null>(4); // ค่าเริ่มต้น 4 ดาวตามรูป
    const [showSuccess, setShowSuccess] = useState(false);

    if (loading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
            <CircularProgress sx={{ color: COLORS.f1 }} />
        </Box>
    );

    if (error || !order) return (
        <Typography sx={{ textAlign: 'center', mt: 10, color: 'red' }}>{error || "ไม่พบข้อมูล"}</Typography>
    );

    let actionButton = null;

    if (order.status === 'pending') {
        actionButton = (
            <Button
                variant="outlined"
                onClick={() => router.push(`/orders/${orderId}/cancel`)}
                sx={{ color: COLORS.f1, borderColor: COLORS.f1, borderRadius: '10px', px: 4 }}
            >
                ยกเลิกคำสั่งซื้อ
            </Button>
        );
    } else if (order.status === 'cancelled') {
        actionButton = (
            <Button
                variant="outlined"
                onClick={() => router.push(`/userprofile`)}
                sx={{ color: COLORS.f1, borderColor: COLORS.f1, borderRadius: '10px', px: 4 }}
            >
                กลับหน้าหลัก
            </Button>
        );
    } else if (order.status === 'success') {
        actionButton = (
            <Button
                variant="contained"
                onClick={() => setRatingOpen(true)}
                sx={{
                    backgroundColor: COLORS.f1,
                    color: '#fff',
                    borderRadius: '10px',
                    px: 4,
                    '&:hover': { backgroundColor: '#c5531d' }
                }}
            >
                ให้คะแนนร้านค้า
            </Button>
        );
    }

    const statusMap: Record<string, string> = {
        'PENDING_PAYMENT': 'ยังไม่ชำระเงิน',
        'PENDING': 'รอจัดส่ง',
        'SHIPPED': 'จัดส่งแล้ว',
        'SUCCESS': 'พัสดุถูกจัดส่งสำเร็จแล้ว',
        'CANCELLED': 'ยกเลิกแล้ว'
    };
    const handleCancelButtonClick = () => {
        window.location.href = `/orders/${orderId}/cancel`;
    };
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', minHeight: '100vh', pb: 8, pt: 4 }}>
            <Box sx={{ width: '90%', maxWidth: '800px' }}>
                <Typography variant="h2" sx={{ color: COLORS.f5, mb: 3 }}>
                    รายละเอียดคำสั่งซื้อ
                </Typography>

                {/* ส่วนสถานะ */}
                <Paper elevation={0} sx={{ p: 3, borderRadius: 3, mb: 2, backgroundColor: '#FCF8F5' }}>
                    <Box sx={{ display: 'flex', mb: 1 }}>
                        <Typography variant="h6" sx={{ color: COLORS.f5, fontWeight: 'bold', width: 150 }}>สถานะคำสั่งซื้อ:</Typography>
                        <Typography sx={{ color: COLORS.f1 }}>{statusMap[order.status] || order.status}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', mb: 2 }}>
                        <Typography variant="h6" sx={{ color: COLORS.f5, fontWeight: 'bold', width: 150 }}>ข้อมูลการจัดส่ง:</Typography>
                        <Typography sx={{ color: '#666' }}>{order.tracking.tracking_number || '-'}</Typography>
                    </Box>

                    {/* ส่วนจัดการปุ่ม Action ตามสถานะ */}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2, pt: 2, borderTop: '1px solid #eee' }}>

                        {/* 1. ยังไม่ชำระเงิน: ยกเลิกได้ + กลับหน้าหลัก */}
                        {order.status === 'PENDING_PAYMENT' && (
                            <>
                                <Button
                                    variant="outlined"
                                    color="error"
                                    onClick={handleCancelButtonClick}
                                    sx={{ borderRadius: 2 }}
                                >
                                    ยกเลิกคำสั่งซื้อ
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={() => router.push('/')}
                                    sx={{ borderRadius: 2, backgroundColor: COLORS.f5 }}
                                >
                                    กลับหน้าหลัก
                                </Button>
                            </>
                        )}

                        {/* 2. ยกเลิกแล้ว หรือ สถานะอื่นๆ ที่ไม่ใช่ความสำเร็จ: กลับหน้าหลัก */}
                        {(order.status === 'CANCELLED' || order.status === 'PENDING' || order.status === 'SHIPPED') && (
                            <Button
                                variant="contained"
                                onClick={() => router.push('/')}
                                sx={{ borderRadius: 2, backgroundColor: COLORS.f5 }}
                            >
                                กลับหน้าหลัก
                            </Button>
                        )}

                        {/* 3. สำเร็จแล้ว: ให้คะแนน (รอ Integrate) */}
                        {order.status === 'SUCCESS' && (
                            <Button
                                variant="contained"
                                disabled
                                sx={{ borderRadius: 2 }}
                            >
                                ให้คะแนน (เร็วๆ นี้)
                            </Button>
                        )}

                    </Box>
                </Paper>

                {/* ส่วนที่อยู่ */}
                <Paper elevation={0} sx={{ p: 3, borderRadius: 3, mb: 2, backgroundColor: '#FCF8F5' }}>
                    <Typography variant="h6" sx={{ color: COLORS.f5, fontWeight: 'bold', mb: 1 }}>ที่อยู่ในการจัดส่ง</Typography>
                    <Typography sx={{ fontWeight: 'bold' }}>
                        {order.shippingAddress.firstname} {order.shippingAddress.lastname} ({order.shippingAddress.phone})
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#555', mt: 0.5 }}>
                        ถนน {order.shippingAddress.road} แขวง {order.shippingAddress.subdistrict} เขต {order.shippingAddress.district}
                        จังหวัด {order.shippingAddress.province} {order.shippingAddress.postcode}
                    </Typography>
                </Paper>

                {/* ส่วนรายการสินค้า */}
                <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, borderRadius: 3, backgroundColor: '#FCF8F5' }}>
                    <Typography variant="h6" sx={{ color: COLORS.f5, fontWeight: 'bold', mb: 1 }}>
                        รายละเอียดคำสั่งซื้อ
                    </Typography>
                    {/* Header: ร้านค้า และ วันที่ */}
                    <Box sx={{
                        display: 'flex',
                        flexDirection: { xs: 'row', md: 'row' }, // จอเล็กเรียงลง, จอใหญ่เรียงแถว (เหมือนเดิม)
                        justifyContent: 'space-between',
                        mb: 2,
                        gap: { xs: 1, md: 0 } // เพิ่มช่องว่างตอนแยกบรรทัดในจอเล็ก
                    }}>
                        {/* ส่วนร้านค้า */}
                        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 0, md: 1 } }}>
                            <Typography sx={{ color: COLORS.f1, fontWeight: 'bold' }}>
                                ร้านค้า
                            </Typography>
                            <Typography sx={{ color: '#333' }}>
                                {order.merchant.shop_name}
                            </Typography>
                        </Box>

                        {/* ส่วนวันที่ */}
                        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 0, md: 1 } }}>
                            <Typography sx={{ color: COLORS.f1, fontWeight: 'bold' }}>
                                วันที่
                            </Typography>
                            <Typography>
                                {dayjs(order.created_at).format('DD/MM/BBBB HH:mm')}
                            </Typography>
                        </Box>
                    </Box>

                    {order.items.map((item, idx) => (
                        <Box key={idx} sx={{
                            display: 'flex',
                            gap: 2,
                            mb: 2,
                            alignItems: 'flex-start'
                        }}>
                            {/* รูปสินค้า */}
                            <Box sx={{
                                width: { xs: 70, md: 80 },
                                height: { xs: 70, md: 80 },
                                borderRadius: 1,
                                backgroundColor: '#eee',
                                backgroundImage: `url(${item.image})`,
                                backgroundSize: 'cover',
                                flexShrink: 0
                            }} />

                            {/* รายละเอียดสินค้า + ราคา/จำนวน */}
                            <Box sx={{
                                display: 'flex',
                                flex: 1,
                                flexDirection: { xs: 'column', md: 'row' }, // จอเล็กเอาจำนวน/ราคาลงข้างล่าง
                                justifyContent: 'space-between',
                                alignItems: { xs: 'flex-start', md: 'center' }
                            }}>
                                <Box sx={{ mb: { xs: 1, md: 0 } }}>
                                    <Typography sx={{ fontWeight: 'bold', fontSize: { xs: '0.9rem', md: '1rem' } }}>
                                        {item.product_name}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#666' }}>
                                        {item.option_name}
                                    </Typography>
                                </Box>

                                {/* จำนวน และ ราคา */}
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: { xs: 'row', md: 'column' }, // จอเล็กวางข้างกัน, จอใหญ่เรียงบนล่าง
                                    justifyContent: { xs: 'space-between', md: 'flex-end' },
                                    width: { xs: '100%', md: 'auto' },
                                    textAlign: { md: 'right' },
                                    gap: { xs: 0, md: 0 }
                                }}>
                                    <Typography variant="body2" sx={{ color: '#333' }}>
                                        x{item.quantity}
                                    </Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#333', ml: { xs: 'auto', md: 0 } }}>
                                        {item.price} THB
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    ))}

                    <Divider sx={{ my: 2 }} />

                    {/* สรุปยอดเงิน (ปรับให้กระชับในจอเล็ก) */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
                        <Box sx={{ display: 'flex', width: { xs: '100%', sm: '250px' }, justifyContent: 'space-between' }}>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>ราคาสินค้า</Typography>
                            <Typography variant="body2" sx={{ color: COLORS.f1 }}>{order.summary.subtotal} THB</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', width: { xs: '100%', sm: '250px' }, justifyContent: 'space-between' }}>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>ค่าส่ง</Typography>
                            <Typography variant="body2" sx={{ color: COLORS.f1 }}>{order.summary.shipping_fee} THB</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', width: { xs: '100%', sm: '250px' }, justifyContent: 'space-between', mt: 1 }}>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>ยอดรวม</Typography>
                            <Typography variant="body2" sx={{ color: COLORS.f1, fontWeight: 'bold' }}>{order.summary.total} THB</Typography>
                        </Box>
                    </Box>
                </Paper>

                {/* ปุ่มยกเลิก */}
                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                    {actionButton}
                </Box>
            </Box>

            <Dialog
                open={ratingOpen}
                onClose={() => setRatingOpen(false)}
                PaperProps={{ sx: { borderRadius: '20px', p: 2, textAlign: 'center', maxWidth: '400px', width: '100%' } }}
            >
                <DialogTitle sx={{ color: COLORS.f1, fontWeight: 'bold', fontSize: '1.5rem' }}>
                    ให้คะแนนร้านค้า
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                        <Rating
                            value={ratingValue}
                            onChange={(event, newValue) => setRatingValue(newValue)}
                            size="large"
                            sx={{ fontSize: '3.5rem', color: '#ff9800' }}
                        />
                    </Box>
                    <Button
                        fullWidth
                        variant="contained"
                        disabled={isSubmitting}
                        onClick={onSubmitRating}
                        sx={{
                            mt: 2, py: 1.5, borderRadius: '12px',
                            backgroundColor: COLORS.f1,
                            '&:hover': { backgroundColor: '#c5531d' }
                        }}
                    >
                        {isSubmitting ? 'กำลังส่ง...' : 'ตกลง'}
                    </Button>
                </DialogContent>
            </Dialog>
        </Box>
    );
}