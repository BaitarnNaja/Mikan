//src\app\(main)\(not-seller)\userprofile\page.tsx// src/app/userprofile/page.tsx
"use client";
import buddhistEra from 'dayjs/plugin/buddhistEra';
import React, { useState } from 'react';
import {
    Box, Typography, Button, TextField, Grid, Divider, Avatar, IconButton, CircularProgress
} from '@mui/material';
import { COLORS } from '@/src/styles'; // ปรับ Path ตามจริง
import { useUserProfile } from '@/src/feature/profile/hook/useUserProfile';
import Popup from '@/src/components/Popup';
import dayjs from 'dayjs';
import 'dayjs/locale/th';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useLogout } from '@/src/feature/auth/hooks/useLogout';
import { useRouter } from 'next/navigation';
export default function UserProfilePage() {
    const {
        addresses,
        orders,
        loadingAddresses,
        loadingOrders,
        handleDeleteAddress,
        orderFilters,
        updateFilter,
        clearFilters,
        fetchOrders,
        errors
    } = useUserProfile();
    const router = useRouter();
    const [popupConfig, setPopupConfig] = useState({
        open: false,
        type: "info" as "info" | "success" | "error" | "confirm",
        title: "",
        message: "",
        idToDelete: null as string | null
    });

    const { logout } = useLogout();

    const closePopup = () => setPopupConfig(prev => ({ ...prev, open: false }));
    dayjs.extend(buddhistEra);
    dayjs.locale('th');

    // helper แปลงเป็น พ.ศ.
    const formatThaiDate = (dateStr: string) => {
        if (!dateStr) return '';
        return dayjs(dateStr).format('DD/MM/BBBB'); // BBBB = พ.ศ.
    };    // ฟังก์ชันเมื่อกดปุ่ม "ลบ" ที่ UI
    const onConfirmDelete = (id: string) => {
        setPopupConfig({
            open: true,
            type: "confirm",
            title: "ยืนยันการลบ",
            message: "คุณแน่ใจหรือไม่ที่จะลบที่อยู่นี้?",
            idToDelete: id
        });
    };

    const handleOrderClick = (orderId: string) => {
        window.location.href = `/orders/${orderId}`;
    };

    // ฟังก์ชันที่ทำงานจริงเมื่อกดยืนยันใน Popup
    const executeDelete = async () => {
        const id = popupConfig.idToDelete;
        if (!id) return;

        try {
            await handleDeleteAddress(id);
            setPopupConfig({
                open: true,
                type: "success",
                title: "สำเร็จ",
                message: "ลบที่อยู่เรียบร้อยแล้ว",
                idToDelete: null
            });
        } catch (error) {
            setPopupConfig({
                open: true,
                type: "error",
                title: "เกิดข้อผิดพลาด",
                message: "ไม่สามารถลบที่อยู่ได้ กรุณาลองใหม่อีกครั้ง",
                idToDelete: null
            });
        }
    };

    const handleLogout = async () => {
        try {
            await logout();

            setPopupConfig({
                open: true,
                type: "confirm",
                title: "ยืนยันการออกจากระบบ",
                message: "คุณแน่ใจหรือไม่ที่จะออกจากระบบ?",
                idToDelete: null
            });

            setTimeout(() => window.location.href = "/", 1500);

        } catch {
            setPopupConfig({
                open: true,
                type: "error",
                title: "เกิดข้อผิดพลาด",
                message: "มีบางอย่างผิดปกติ แต่ระบบได้นำคุณออกจากระบบแล้ว",
                idToDelete: null
            });

            setTimeout(() => window.location.href = "/login", 1500);
        }
    };

    return (
        <Box sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            minHeight: "100vh", pb: 8
        }}>
            {/* พื้นหลัง Gradient ด้านบน */}
            <Box
                sx={{
                    pt: { xs: 4, md: 6 },
                    pb: 2,
                    width: '90%', maxWidth: '900px',
                    px: { xs: 1, md: 4 }
                }}
            >
                <Typography variant="h2" sx={{ color: COLORS.f1, fontWeight: 'bold', mb: 4 }}>
                    Natdanai
                </Typography>

                {/* Section 1: ที่อยู่ */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h5" sx={{ color: COLORS.f1, fontWeight: 'bold' }}>ที่อยู่</Typography>
                    <Button onClick={() => router.push("/userprofile/address/manage")} variant="contained" sx={{ backgroundColor: COLORS.f1, borderRadius: '20px', px: 3, '&:hover': { backgroundColor: '#c5531d' } }}>
                        เพิ่มที่อยู่
                    </Button>
                </Box>

                <Box sx={{ position: 'relative' }}>

                    {loadingAddresses ? (
                        <CircularProgress sx={{ display: 'block', mx: 'auto', my: 3, color: COLORS.f1 }} />
                    ) : (
                        addresses.map((addr, index) => (
                            <Box key={addr.id} sx={{ mb: 2 }}>
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: { xs: 'column', md: 'row' },
                                    justifyContent: 'space-between',
                                    alignItems: { xs: 'flex-start', md: 'flex-start' },
                                    gap: { xs: 1, md: 0 }
                                }}>
                                    <Box>
                                        <Typography sx={{ fontWeight: 'bold', color: '#333' }}>
                                            {addr.firstname} {addr.lastname} <span style={{ color: '#666', fontWeight: 'normal' }}>({addr.phone})</span>
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: '#555', maxWidth: { xs: '100%', md: '70%' }, mt: 0.5 }}>
                                            ถนน {addr.road || '-'} แขวง {addr.subdistrict} เขต {addr.district} จังหวัด {addr.province} {addr.postcode}
                                        </Typography>
                                    </Box>

                                    {/* ส่วนปุ่มกดและสถานะ */}
                                    <Box sx={{
                                        textAlign: { xs: 'left', md: 'right' },
                                        minWidth: '100px',
                                        width: { xs: '100%', md: 'auto' },
                                        display: 'flex',
                                        // จอเล็กให้กระจายซ้ายขวา (ค่าเริ่มต้นอยู่ซ้าย แก้ไข/ลบอยู่ขวา), จอใหญ่เรียงคอลัมน์ชิดขวา
                                        flexDirection: { xs: 'row', md: 'column' },
                                        justifyContent: 'space-between',
                                        alignItems: { xs: 'center', md: 'flex-end' },
                                        mt: { xs: 1, md: 0 }
                                    }}>
                                        {addr.isDefault && (
                                            <Typography variant="body2" sx={{ color: COLORS.f1, fontWeight: 'bold' }}>ค่าเริ่มต้น</Typography>
                                        )}
                                        <Box sx={{ display: 'flex', gap: 2 }}>
                                            <Typography onClick={() => router.push(`/userprofile/address/manage?id=${addr.id}`)} component="span" sx={{ color: COLORS.f1, cursor: 'pointer', fontSize: '0.875rem' }}>แก้ไข</Typography>
                                            <Typography
                                                component="span"
                                                onClick={() => onConfirmDelete(addr.id)}
                                                sx={{ color: COLORS.f1, cursor: 'pointer', fontSize: '0.875rem' }}
                                            >
                                                ลบ
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                                {index !== addresses.length - 1 && <Divider sx={{ my: 2, borderStyle: 'dashed' }} />}

                                <Popup
                                    open={popupConfig.open}
                                    type={popupConfig.type}
                                    title={popupConfig.title}
                                    message={popupConfig.message}
                                    onClose={closePopup}
                                    onConfirm={popupConfig.type === "confirm" ? executeDelete : closePopup}
                                />
                            </Box>
                        ))
                    )}
                </Box>
            </Box>
            {/* Section 2: การสั่งซื้อของฉัน */}
            <Box sx={{ width: '90%', maxWidth: '900px', px: { xs: 0, md: 4 }, mt: 4 }}>
                <Typography variant="h5" sx={{ color: COLORS.f1, fontWeight: 'bold', mb: 3 }}>
                    การสั่งซื้อของฉัน
                </Typography>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="th">
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', sm: 'row' },
                            gap: 2,
                            mb: 4,
                            justifyContent: 'center',
                            maxWidth: '1100px',
                            mx: 'auto',
                            alignItems: { xs: 'stretch', sm: 'flex-end' },
                            width: '100%',
                            px: 2
                        }}
                    >
                        {/* 1. จากวันที่ */}
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="body2" sx={{ mb: 1, color: '#555', fontWeight: 'bold' }}>
                                จากวันที่
                            </Typography>

                            <Box sx={{ position: 'relative' }}>
                                <TextField
                                    type="date"
                                    fullWidth
                                    size="small"
                                    value={orderFilters.startDate || ''}
                                    error={!!errors.startDate}
                                    onChange={(e) => updateFilter('startDate', e.target.value)}
                                    sx={{
                                        '& .MuiOutlinedInput-root': { borderRadius: 2 },
                                        cursor: 'pointer',

                                        '& input::-webkit-datetime-edit-fields-wrapper': {
                                            visibility: 'hidden' 
                                        }
                                    }}
                                        />

                                        <Typography
                                            sx={{
                                                position: 'absolute',
                                                top: '50%',
                                                left: '14px',
                                                transform: 'translateY(-50%)',
                                                color: orderFilters.startDate ? '#000' : '#aaa',
                                                pointerEvents: 'none',
                                                fontSize: '0.9rem',
                                                cursor: 'pointer',
                                            }}
                                        >
                                            {orderFilters.startDate
                                                ? formatThaiDate(orderFilters.startDate)
                                                : 'วว/ดด/ปปปป'}
                                        </Typography>
                            </Box>
                            <Box sx={{ minHeight: '20px', mt: 0.5 }}>
                                {errors.startDate && (
                                    <Typography sx={{ color: 'red', fontSize: '0.75rem' }}>
                                        {errors.startDate}
                                    </Typography>
                                )}
                            </Box>
                        </Box>

                        {/* 2. ถึงวันที่ (เพิ่มเข้ามา) */}
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="body2" sx={{ mb: 1, color: '#555', fontWeight: 'bold' }}>
                                ถึงวันที่
                            </Typography>

                            <Box sx={{ position: 'relative' }}>
                                <TextField
                                    type="date"
                                    fullWidth
                                    size="small"
                                    value={orderFilters.endDate || ''}
                                    error={!!errors.endDate}
                                    onChange={(e) => updateFilter('endDate', e.target.value)}
                                    sx={{
                                        '& .MuiOutlinedInput-root': { borderRadius: 2 },
                                        '& input::-webkit-datetime-edit-fields-wrapper': {
                                            visibility: 'hidden' 
                                        },
                                        cursor: 'pointer'
                                    }}
                                />

                                <Typography
                                    sx={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '14px',
                                        transform: 'translateY(-50%)',
                                        color: orderFilters.endDate ? '#000' : '#aaa',
                                        pointerEvents: 'none',
                                        fontSize: '0.9rem',
                                    }}
                                >
                                    {orderFilters.endDate
                                        ? formatThaiDate(orderFilters.endDate)
                                        : 'วว/ดด/ปปปป'}
                                </Typography>
                            </Box>
                            <Box sx={{ minHeight: '20px', mt: 0.5 }}>
                                {errors.endDate && (
                                    <Typography sx={{ color: 'red', fontSize: '0.75rem' }}>
                                        {errors.endDate}
                                    </Typography>
                                )}
                            </Box>
                        </Box>

                        {/* 3. หมายเลขคำสั่งซื้อ */}
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="body2" sx={{ mb: 1, color: '#555', fontWeight: 'bold' }}>
                                หมายเลขคำสั่งซื้อ
                            </Typography>
                            <TextField
                                placeholder="ค้นหาหมายเลข..."
                                fullWidth
                                size="small"
                                value={orderFilters.orderId}
                                onChange={(e) => updateFilter('orderId', e.target.value)}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                            />
                            <Box sx={{ minHeight: '20px', mt: 0.5 }}></Box>
                        </Box>

                        {/* 4. ปุ่ม */}
                        <Box
                            sx={{
                                flex: 0.5, // ปรับให้เท่ากับช่อง Input อื่นๆ เพื่อให้สมดุล
                                display: 'flex',
                                gap: 2,
                                alignItems: 'center', // จัดให้อยู่กลางแนวตั้ง
                                justifyContent: { xs: 'center', sm: 'flex-start' }, // จอเล็กอยู่กลาง จอใหญ่อยู่ซ้ายของบล็อกตัวเอง
                                // ปรับแก้ระยะห่างด้านล่างให้เท่ากับพวกที่มี Error Message
                                pb: { xs: 2, sm: 3 }
                            }}
                        >
                            <Typography
                                onClick={clearFilters}
                                sx={{ color: COLORS.f1, cursor: 'pointer', fontWeight: 'bold' }}
                            >
                                ล้าง
                            </Typography>
                            <Typography
                                onClick={() => fetchOrders()}
                                sx={{ color: COLORS.f1, cursor: 'pointer', fontWeight: 'bold' }}
                            >
                                ค้นหา
                            </Typography>
                        </Box>


                    </Box>
                </LocalizationProvider>
                {/* Order List */}
                {loadingOrders ? (
                    <CircularProgress sx={{ display: 'block', mx: 'auto', my: 3, color: COLORS.f1 }} />
                ) : (
                    orders.map((order) => (
                        <Box key={order.id} onClick={() => handleOrderClick(order.id)} sx={{ backgroundColor: '#FCF8F5', borderRadius: 2, p: { xs: 1, md: 3 }, mb: { xs: 2, md: 3 } }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                <Typography variant='body1' sx={{ color: COLORS.f1, cursor: 'default' }}>ร้านค้า <span style={{ color: '#333', cursor: 'pointer' }}>{order.shopName}</span></Typography>
                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    <Typography variant='body1' sx={{ color: COLORS.f1 }}>วันที่</Typography>
                                    <Typography variant='body1' sx={{ color: '#333' }}>{order.createAt}</Typography>
                                </Box>
                            </Box>

                            {order.orderItems.map((item, idx) => (
                                <Box key={idx} sx={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    mb: 2,
                                    gap: 2
                                }}>
                                    {/* รูปสินค้า */}
                                    <Box sx={{
                                        width: 80,
                                        height: 80,
                                        backgroundColor: '#ddd',
                                        borderRadius: 1,
                                        flexShrink: 0,
                                        backgroundImage: `url(${item.img})`,
                                        backgroundSize: 'cover'
                                    }} />

                                    {/* รายละเอียดสินค้า */}
                                    <Box sx={{
                                        display: 'flex',
                                        flex: 1,
                                        // จอเล็กให้เรียงข้อมูลเป็นแนวตั้ง (ชื่อบน จำนวน/ราคากลาง/ล่าง)
                                        flexDirection: { xs: 'column', md: 'row' },
                                        alignItems: { xs: 'flex-start', md: 'center' },
                                        justifyContent: 'space-between'
                                    }}>
                                        <Typography variant='h4' sx={{ color: '#333', mb: { xs: 0.5, md: 0 } }}>
                                            {item.productName}
                                        </Typography>

                                        <Box sx={{
                                            display: 'flex',
                                            width: { xs: '100%', md: 'auto' },
                                            justifyContent: { xs: 'space-between', md: 'flex-end' },
                                            alignItems: 'center',
                                            gap: { md: 4 }
                                        }}>
                                            <Typography variant='h4' sx={{ color: '#333' }}>
                                                x{item.quantity}
                                            </Typography>
                                            <Typography variant='h4' sx={{ color: '#333', minWidth: { md: '100px' }, textAlign: 'right' }}>
                                                {item.price} THB
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            ))}

                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mt: 3, pt: 2, borderTop: '1px solid #EAEAEA' }}>
                                <Typography variant='h4' sx={{ color: '#333', mr: 2 }}>ยอดรวม</Typography>
                                <Typography variant='h4' sx={{ color: COLORS.f1 }}>{order.totalAmount} THB</Typography>
                            </Box>
                        </Box>
                    ))
                )}

                {/* Footer Buttons */}
                <Box sx={{ mt: 6, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                    <Button
                        variant="contained"
                        fullWidth
                        sx={{
                            maxWidth: '600px',
                            backgroundColor: COLORS.f1,
                            color: '#fff',
                            borderRadius: 2,
                            py: 1.5,
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            '&:hover': { backgroundColor: '#c5531d' }
                        }}
                    >
                        ขายกับเรา
                    </Button>
                    <Typography
                        onClick={handleLogout}
                        sx={{ color: '#FF0000', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', mt: 1 }}
                    >
                        ออกจากระบบ
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
}