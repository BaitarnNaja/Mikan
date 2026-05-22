// src/app/(main)/(not-seller)/orders/[id]/cancel/page.tsx
"use client";
import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Box, Typography, Paper, IconButton, CircularProgress } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { COLORS } from '@/src/styles';
import { useCancelOrder } from '@/src/feature/cart/hook/useCancelOrder';
import Popup from '@/src/components/Popup';

const CANCEL_REASONS = [
    { 
        code: "DAMAGED", 
        title: "ได้รับสินค้าที่มีความเสียหาย หรือสภาพไม่ได้", 
        detail: "สินค้าที่ได้รับมีร่องรอยขีดข่วน แตกหัก รั่ว/หก หรือการใช้งานไม่สมบูรณ์" 
    },
    { 
        code: "WRONG_ITEM", 
        title: "ได้รับสินค้ามาผิด หรือไม่ใช่สินค้าที่สั่ง", 
        detail: "สินค้าที่ได้รับมาไม่ใช่สินค้าที่สั่ง/ มีความแตกต่างจากรายละเอียด/ ผิดลิขสิทธิ์" 
    },
    { 
        code: "INCOMPLETE", 
        title: "ได้รับสินค้าไม่ครบ หรือยังไม่ได้รับพัสดุ", 
        detail: "ได้รับสินค้าไม่ครบตามจำนวนที่สั่ง/ มีชิ้นส่วนบางชิ้นหายไป/ ได้รับกล่องเปล่า" 
    }
];

export default function CancelOrderPage() {
    const params = useParams();
    const router = useRouter();
    const orderId = params.id as string;
    const { handleCancelOrder, isCancelling } = useCancelOrder();

    const [popupOpen, setPopupOpen] = useState(false);

    const onSelectReason = async (reason: typeof CANCEL_REASONS[0]) => {
        await handleCancelOrder(orderId, reason.code, reason.detail, () => {
            setPopupOpen(true); // แสดง Popup สำเร็จ
        });
    };

    return (
        <Box sx={{ 
            display: 'flex', flexDirection: 'column', alignItems: 'center', 
            width: '100%', minHeight: '100vh', pt: 4,
        }}>
            <Box sx={{ width: '90%', maxWidth: '600px' }}>
                <Typography variant="h2" sx={{ color: COLORS.f5, fontWeight: 'bold', mb: 4 }}>
                    โปรดระบุปัญหาที่พบ
                </Typography>

                {CANCEL_REASONS.map((reason) => (
                    <Paper 
                        key={reason.code}
                        onClick={() => !isCancelling && onSelectReason(reason)}
                        elevation={0}
                        sx={{ 
                            p: 3, mb: 2, borderRadius: 3, cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            '&:hover': { backgroundColor: '#FDF2EB' },
                            opacity: isCancelling ? 0.6 : 1,
                            border: '1px solid #eee'
                        }}
                    >
                        <Box sx={{ pr: 2 }}>
                            <Typography sx={{ color: COLORS.f5, fontWeight: 'bold', fontSize: '1.1rem', mb: 0.5 }}>
                                {reason.title}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#888' }}>
                                {reason.detail}
                            </Typography>
                        </Box>
                        {isCancelling ? <CircularProgress size={20} /> : <ArrowForwardIosIcon sx={{ fontSize: 18, color: COLORS.f5 }} />}
                    </Paper>
                ))}
            </Box>

            <Popup 
                open={popupOpen}
                type="success"
                title="สำเร็จ"
                message="ส่งคำขอยกเลิกเรียบร้อยแล้ว"
                onClose={() => router.push(`/orders/${orderId}`)} // กลับไปหน้าเดิมหลังปิด
            />
        </Box>
    );
}