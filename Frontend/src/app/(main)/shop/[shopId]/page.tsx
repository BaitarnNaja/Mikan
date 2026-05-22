// src/app/(main)/shop/[shopId]/page.tsx
"use client";

import { useParams } from "next/navigation";
import { useEffect, useState, ChangeEvent } from "react";
import { Box, Typography, Avatar, CircularProgress, Tabs, Tab, Pagination } from "@mui/material";
import ProductCard from "@/src/feature/products/componant/ProductCart"; // ตรวจสอบ Path ให้ตรงกับของคุณ
import { useShop } from "@/src/feature/products/hook/useShop";

export default function ShopPage() {
    const params = useParams();
    const shopId = params?.shopId as string;
    useEffect(() => {
        console.log("Current Shop ID from URL:", shopId);
    }, [shopId]);

    const { shopDetail, products, metadata, loadingDetail, loadingProducts, fetchShopProducts } = useShop(shopId);
    console.log("shop detail: ",shopDetail)

    const [activeTab, setActiveTab] = useState<string>(""); // ค่าว่าง = หน้าหลัก/ทั้งหมด
    const [page, setPage] = useState<number>(1);
    const limit = 12; // กำหนดจำนวนต่อหน้า
    const selectedCategory = shopDetail?.category?.find(
        (cat: any) => cat.categoryId === activeTab
    );
    useEffect(() => {
        if (shopId) {
            fetchShopProducts({
                categoryId: activeTab || undefined,
                page: page,
                limit: limit
            });
        }
    }, [shopId, activeTab, page, fetchShopProducts]);

    const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
        setActiveTab(newValue);
        setPage(1);
    };

    const handlePageChange = (event: ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    if (loadingDetail) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <CircularProgress sx={{ color: '#E66625' }} />
            </Box>
        );
    }

    if (!shopDetail) {
        return <Typography sx={{ textAlign: 'center', mt: 10, color: 'red' }}>ไม่พบข้อมูลร้านค้า</Typography>;
    }

    // คำนวณจำนวนหน้าทั้งหมดสำหรับการทำ Pagination
    const totalPages = Math.ceil((metadata?.total || 0) / limit);

    return (
        <Box sx={{ minHeight: '100dvh', pb: 8, width: '100dvw', }}>

            {/* Banner ส่วนหัวร้านค้า */}
            <Box sx={{ width: '100%', maxWidth: '1200px', mx: 'auto' }}>
                <Box sx={{
                    bgcolor: '#E66625', // หรือใส่เป็น Gradient background: 'linear-gradient(to right, #E66625, #f39c12)'
                    color: 'white',
                    p: { xs: 2, md: 3 },
                    m: { xs: 3, md: 3 },
                    borderRadius: ' 20px',
                    display: 'flex',
                    justifyContent: 'center',
                    maxWidth: { xs: '400px', md: '500px' }
                }}>
                    <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', }}>
                        {/* ข้อมูลซ้าย */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar
                                src={shopDetail.img || ""} // ปรับตาม response จริง
                                sx={{ width: 50, height: 50, border: '3px solid white' }}
                            />
                        </Box>
                        <Box sx={{ flex: 1, display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>

                            <Box sx={{ display: 'flex', flex: 0.6, alignItems: 'center' }}>
                                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                                    {shopDetail.shopName}
                                </Typography>
                            </Box>
                            {/* เส้นคั่น (แสดงเฉพาะหน้าจอใหญ่) */}
                            <Box sx={{ height: 60, width: '1px', bgcolor: 'rgba(255,255,255,0.5)', display: { xs: 'none', md: 'block' }, mr: 2 }} />
                            <Box sx={{ width: '100%', height: '3px', bgcolor: 'rgba(255,255,255,0.5)', display: { xs: 'block', md: 'none' }, my: 1 }} />

                            {/* ข้อมูลขวา (สถิติ) */}
                            <Box sx={{ display: 'flex', flex: 0.4, flexDirection: 'column', }}>
                                <Typography variant="body1">Products: {shopDetail.productQuantity}</Typography>
                                <Typography variant="body1">Rating: {shopDetail.rating?.toFixed(1) || "N/A"}</Typography>
                            </Box>
                        </Box>

                    </Box>
                </Box>
            </Box>


            <Box sx={{ maxWidth: '1200px', width: '100%', mx: 'auto', px: { xs: 2, md: 4 } }}>

                {/* แถบ Tabs หมวดหมู่ */}
                <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
                    <Tabs
                        value={activeTab}
                        onChange={handleTabChange}
                        variant="scrollable"
                        scrollButtons="auto"
                        TabIndicatorProps={{ style: { backgroundColor: '#E66625' } }}
                        sx={{
                            '& .MuiTab-root.Mui-selected': { color: '#E66625', fontWeight: 'bold' },
                            '& .MuiTab-root': { color: '#666', fontSize: '1rem' }
                        }}
                    >
                        <Tab label="หน้าหลัก" value="" />
                        {shopDetail.category?.map((cat: any) => (
                            <Tab key={cat.categoryId} label={cat.categoryName} value={cat.categoryId} />
                        ))}
                    </Tabs>
                </Box>

                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#E66625', mb: 3 }}>
                    {activeTab
                        ? selectedCategory?.categoryName || 'ไม่พบหมวดหมู่'
                        : 'สินค้าทั้งหมด'}
                </Typography>

                {/* Grid แสดงสินค้า */}
                {loadingProducts ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                        <CircularProgress sx={{ color: '#E66625' }} />
                    </Box>
                ) : products.length > 0 ? (
                    <>
                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: {
                                    xs: 'repeat(2, 1fr)',
                                    sm: 'repeat(3, 1fr)',
                                    md: 'repeat(4, 1fr)',
                                    lg: 'repeat(4, 1fr)'
                                },
                                gap: 2
                            }}
                        >
                            {products.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </Box>

                        {/* Pagination เลื่อนหน้า */}
                        {totalPages > 1 && (
                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                                <Pagination
                                    count={totalPages}
                                    page={page}
                                    onChange={handlePageChange}
                                    shape="rounded"
                                    sx={{
                                        '& .MuiPaginationItem-root.Mui-selected': {
                                            backgroundColor: '#E66625',
                                            color: 'white',
                                            '&:hover': { backgroundColor: '#D35400' }
                                        }
                                    }}
                                />
                            </Box>
                        )}
                    </>
                ) : (
                    <Typography sx={{ textAlign: 'center', color: '#888', py: 10 }}>ไม่มีสินค้าในหมวดหมู่นี้</Typography>
                )}
            </Box>
        </Box>
    );
}