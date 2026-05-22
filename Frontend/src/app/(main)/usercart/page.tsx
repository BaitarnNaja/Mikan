'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Box,
    Container,
    Typography,
    Checkbox,
    IconButton,
    Divider,
    Stack,
    useMediaQuery,
    useTheme,
    CircularProgress
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Popup from '@/src/components/Popup';
import { useCart } from '@/src/feature/cart/hook/useCart';
import { StoreButton } from '@/src/components/StoreButton';

export default function ShoppingCartPage() {
    const router = useRouter();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [popupOpen, setPopupOpen] = useState(false);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<string | null>(null);

    const {
        cartData,
        isLoading,
        totalPrice,
        hasSelectedItems,
        handleSelectAll,
        handleToggleStore,
        handleToggleItem,
        handleUpdateQuantity,
        handleDeleteSelected,
        deleteSingleItem
    } = useCart();

    // แก้ไขฟังก์ชัน handleCheckout ในไฟล์ src/app/usercart/page.tsx
    const handleCheckout = () => {
        if (!hasSelectedItems) {
            setPopupOpen(true);
            return;
        }

        // 1. ดึงของจริงที่เลือก: สกัดออกมาเป็น Array ของข้อมูลวัตถุ [ {productOptionId, quantity} ]
        const selectedItemsPayload = cartData
            .flatMap(store => store.items)
            .filter(item => item.selected)
            .map(item => ({
                productId: item.productId, // ใส่คีย์ออปชันจริง
                quantity: Number(item.quantity)               // จำนวนจริงในตะกร้า
            }));

        // 2. ดึงไอดีตะกร้าสินค้าจริง
        const selectedCartIds = cartData
            .flatMap(store => store.items)
            .filter(item => item.selected)
            .map(item => item.cartItemId);

        console.log("ของจริงที่จะส่งไปพรีวิว:", { selectedItemsPayload, selectedCartIds });

        const params = new URLSearchParams();

        // แปลงก้อน Array วัตถุให้กลายเป็นข้อความด้วย JSON.stringify เพื่อส่งข้ามเลนผ่าน URL
        params.set('items', JSON.stringify(selectedItemsPayload));
        params.set('ids', selectedCartIds.join(','));

        router.push(`/usercart/checkout?${params.toString()}`);
    };

    const onDecreaseQuantity = (cartItemId: string, currentQuantity: number) => {
        if (currentQuantity === 1) {
            setItemToDelete(cartItemId);
            setDeleteConfirmOpen(true);
        } else {
            handleUpdateQuantity(cartItemId, currentQuantity, -1);
        }
    };

    const confirmDelete = async () => {
        if (itemToDelete) {
            await deleteSingleItem(itemToDelete);
            setDeleteConfirmOpen(false);
            setItemToDelete(null);
        }
    };

    if (isLoading && cartData.length === 0) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress color="warning" />
            </Box>
        );
    }

    const isAllSelected = cartData.length > 0 && cartData.every(store => store.items.every(item => item.selected));

    return (
        /* 
           จุดที่ 3: ปรับโครงสร้างหลักเป็น Relative และใช้ pb (Padding Bottom) 
           เพื่อให้เนื้อหาไม่ถูกแถบ Footer บังเวลาเลื่อนไปล่างสุด 
        */
        <Box sx={{ position: 'relative', minHeight: '100vh', pb: isMobile ? '120px' : '100px' }}>
            <Container maxWidth="md" sx={{ mt: isMobile ? 2 : 4, px: isMobile ? 1.5 : 2 }}>
                <Stack direction="row" sx={{ alignItems: "center", mb: 2, fontWeight: "bold" }} spacing={1} >
                    <Typography variant={isMobile ? "h6" : "h5"} color="#D35400" >
                        🛒 ตระกร้าของฉัน
                    </Typography>
                </Stack>

                {cartData.map((store) => {
                    const isStoreSelected = store.items.length > 0 && store.items.every((item) => item.selected);
                    const isSomeSelected = store.items.some((item) => item.selected) && !isStoreSelected;
                    console.log("Store: ", store)
                    console.log("Cart: ", cartData)

                    return (
                        <Box key={store.shopId} sx={{ bgcolor: '#FFF2DE', borderRadius: 4, p: isMobile ? 2 : 3, mb: 3 }}>
                            <Stack direction="row" spacing={1} sx={{ mb: 1.5, alignItems: "center" }}>
                                <Checkbox
                                    size={isMobile ? "small" : "medium"}
                                    color="warning"
                                    checked={isStoreSelected}
                                    indeterminate={isSomeSelected}
                                    onChange={(e) => handleToggleStore(store.shopId, e.target.checked)}
                                />
                                {/* จุดที่ 1: เพิ่ม onClick เพื่อไปที่หน้าร้านค้า และ cursor: pointer */}
                                <Typography
                                    variant={isMobile ? "body1" : "h6"}
                                    color="#8B4513"
                                    onClick={() => router.push(`/shop/${store.shopId}`)}
                                    sx={{ cursor: 'pointer', '&:hover': { opacity: 0.8 }, fontWeight: "bold" }}
                                >
                                    🏠 {store.storeName}
                                </Typography>
                            </Stack>
                            <Divider sx={{ mb: 2 }} />

                            {store.items.map((item) => (
                                <Stack
                                    key={item.cartItemId}
                                    direction="row"
                                    spacing={isMobile ? 1 : 2}
                                    sx={{ alignItems: isMobile ? "flex-start" : "center", mb: 3 }}
                                >
                                    <Checkbox
                                        size={isMobile ? "small" : "medium"}
                                        color="warning"
                                        checked={item.selected}
                                        onChange={() => handleToggleItem(store.shopId, item.cartItemId)}
                                        sx={{ mt: isMobile ? 0.5 : 0 }}
                                    />

                                    {/* จุดที่ 2: เพิ่ม onClick ที่รูปภาพเพื่อไปหน้าสินค้า */}
                                    <Box
                                        component="img"
                                        src={item.imageUrl}
                                        onClick={() => router.push(`/product/${item.productId}`)}
                                        sx={{
                                            width: isMobile ? 60 : 100,
                                            height: isMobile ? 60 : 100,
                                            borderRadius: 2,
                                            objectFit: 'cover',
                                            bgcolor: 'white',
                                            cursor: 'pointer'
                                        }}
                                    />

                                    <Stack
                                        direction={isMobile ? "column" : "row"}

                                        spacing={isMobile ? 1 : 2}
                                        sx={{ flexGrow: 1, alignItems: isMobile ? "flex-start" : "center" }}
                                    >
                                        {/* จุดที่ 2: เพิ่ม onClick ที่ชื่อสินค้าเพื่อไปหน้าสินค้า */}
                                        <Box sx={{ flexGrow: 1, minWidth: isMobile ? 'auto' : '200px' }}>
                                            <Typography
                                                variant={isMobile ? "body2" : "subtitle1"}
                                                onClick={() => router.push(`/product/${item.productId}`)}
                                                sx={{ cursor: 'pointer', '&:hover': { color: '#D35400' }, fontWeight: "bold" }}
                                            >
                                                {item.name}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {item.description}
                                            </Typography>
                                        </Box>

                                        <Stack
                                            direction="row"
                                            sx={{ width: isMobile ? '100%' : 'auto', gap: isMobile ? 0 : 4, alignItems: "center", justifyContent: "space-between" }}
                                        >
                                            <Stack
                                                direction="row"
                                                sx={{ border: '1px solid #eee', borderRadius: 1, px: 0.5, bgcolor: 'white', alignItems: "center" }}
                                            >
                                                <IconButton size="small"
                                                    onClick={() => onDecreaseQuantity(item.cartItemId, item.quantity)} >
                                                    <RemoveIcon fontSize="small" />
                                                </IconButton>
                                                <Typography sx={{ mx: 1, minWidth: '20px', textAlign: 'center' }}>
                                                    {item.quantity}
                                                </Typography>
                                                <IconButton size="small" onClick={() => handleUpdateQuantity(item.cartItemId, item.quantity, 1)}>
                                                    <AddIcon fontSize="small" />
                                                </IconButton>
                                            </Stack>

                                            <Typography
                                                sx={{
                                                    fontWeight: 'bold',
                                                    color: '#D35400',
                                                    minWidth: isMobile ? 'auto' : '100px',
                                                    textAlign: 'right'
                                                }}>
                                                {(item.price * item.quantity).toLocaleString()} THB
                                            </Typography>
                                        </Stack>
                                    </Stack>
                                </Stack>
                            ))}
                        </Box>
                    );
                })}

                {cartData.length === 0 && !isLoading && (
                    <Typography color="text.secondary" sx={{ mt: 5, textAlign: "center" }}>
                        ไม่มีสินค้าในตะกร้า
                    </Typography>
                )}

                {/* 
                    จุดที่ 3: ปรับแต่ง Fixed Footer 
                    เพิ่ม max-width ให้เท่ากับ Container เพื่อให้ตำแหน่งตรงกันในจอใหญ่
                */}
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        bgcolor: isMobile ? '#FFF9C4' : 'white',
                        position: 'fixed',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        width: '100%',
                        p: isMobile ? 1.5 : 2,
                        boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
                        zIndex: 1100 // ให้สูงกว่า UI อื่นๆ
                    }}
                >
                    <Stack
                        direction="row"
                        sx={{ width: '100%', maxWidth: 'md', alignItems: "center", justifyContent: "space-between" }} // จำกัดความกว้างให้เท่ากับ Container
                    >
                        <Stack direction="row" sx={{ alignItems: "center" }} spacing={isMobile ? 0.5 : 2}>
                            <Checkbox
                                size={isMobile ? "small" : "medium"}
                                checked={isAllSelected}
                                onChange={(e) => handleSelectAll(e.target.checked)}
                                color="warning"
                            />
                            <Typography sx={{ fontSize: isMobile ? 13 : 16 }}>เลือกทั้งหมด</Typography>
                            <Typography
                                color={hasSelectedItems ? "error" : "text.secondary"}
                                onClick={hasSelectedItems ? handleDeleteSelected : undefined}
                                sx={{ cursor: hasSelectedItems ? 'pointer' : 'default', fontSize: isMobile ? 13 : 16, ml: 1 }}
                            >
                                ลบ
                            </Typography>
                        </Stack>

                        <Stack direction="row" sx={{ alignItems: "center", fontWeight: "bold" }} spacing={isMobile ? 1.5 : 3}>
                            <Typography variant={isMobile ? "body2" : "h6"} >
                                ยอดรวม <span style={{ color: '#D35400' }}>{totalPrice.toLocaleString()} THB</span>
                            </Typography>
                            <StoreButton
                                bg="brandPrimary"
                                typography={isMobile ? "caption" : "body1"}
                                size={isMobile ? "small" : "large"}
                                onClick={handleCheckout}
                            >
                                ชำระเงิน
                            </StoreButton>
                        </Stack>
                    </Stack>
                </Box>

                {/* Popup ต่างๆ */}
                <Popup
                    open={deleteConfirmOpen}
                    type="error"
                    title="ยืนยันการลบ"
                    message="คุณต้องการลบสินค้าชิ้นนี้ออกจากตะกร้าใช่หรือไม่?"
                    onClose={() => setDeleteConfirmOpen(false)}
                    onConfirm={confirmDelete}
                />
                <Popup
                    open={popupOpen}
                    type="error"
                    title="แจ้งเตือน"
                    message="กรุณาเลือกสินค้าก่อนยืนยันคำสั่งซื้อ"
                    onClose={() => setPopupOpen(false)}
                />
            </Container>
        </Box>
    );
}