"use client";

import React, { useState } from 'react';
import {
    Box, Typography, Checkbox, FormControlLabel, TextField,
    Divider, FormGroup, IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { CATEGORY_FILTERS, PRODUCT_CATEGORIES } from '@/src/constants/products';
import { COLORS } from '@/src/styles';
import { StoreButton } from '@/src/components/StoreButton';
import { GetProductRequest } from '../type/products';
import ProductSort from './ProductSort';

interface ProductFilterProps {
    isMobile?: boolean;
    onClose?: () => void;
    onApply?: (filters: GetProductRequest) => void;
    currentSort?: string | null;
}

const ProductFilter: React.FC<ProductFilterProps> = ({ isMobile, onClose, onApply, currentSort }) => {
    const [selectedCats, setSelectedCats] = useState<string[]>([]);
    const [price, setPrice] = useState({ min: '', max: '' });
    const [isStock, setIsStock] = useState<boolean | null>(null);
    const [shopTypes, setShopTypes] = useState<string[]>([]);

    // ⭐️ 1. State มารับค่าการเรียงลำดับ และ State สำหรับเก็บ Error ของราคา
    const [sortValue, setSortValue] = useState<string | null>(currentSort || null);
    const [priceError, setPriceError] = useState<string>('');

    React.useEffect(() => {
        setSortValue(currentSort || null);
    }, [currentSort]);

    const handleCatChange = (val: string) => {
        setSelectedCats(prev =>
            prev.includes(val) ? prev.filter(i => i !== val) : [...prev, val]
        );
    };

    const handleShopTypeChange = (val: string) => {
        setShopTypes(prev =>
            prev.includes(val) ? prev.filter(i => i !== val) : [...prev, val]
        );
    };

    const handlePriceChange = (field: 'min' | 'max') => (e: React.ChangeEvent<HTMLInputElement>) => {
        setPriceError(''); // ⭐️ เคลียร์ Error ออกทันทีเมื่อผู้ใช้เริ่มพิมพ์แก้ราคาใหม่
        setPrice(prev => ({ ...prev, [field]: e.target.value }));
    };

    const handleApplyFilters = () => {
        const minPriceNum = price.min !== '' ? Number(price.min) : null;
        const maxPriceNum = price.max !== '' ? Number(price.max) : null;

        // ⭐️ 2. ดักจับเงื่อนไข ราคาจาก ต้องไม่มากกว่า ราคาถึง (เช็คเมื่อมีการกรอกทั้ง 2 ช่อง)
        if (minPriceNum !== null && maxPriceNum !== null && minPriceNum > maxPriceNum) {
            setPriceError('ราคาเริ่มต้นต้องไม่มากกว่าราคาสิ้นสุด');
            return; // หยุดการทำงานตรงนี้ ไม่ส่งค่าไป API
        }

        const finalData = {
            type: selectedCats.length > 0 ? selectedCats : undefined,
            sortType: sortValue !== null ? sortValue : undefined,
            minPrice: minPriceNum,
            maxPrice: maxPriceNum,
            isStock: isStock,
            shopType: shopTypes.length > 0 ? shopTypes : undefined
        } as any;

        if (onApply) onApply(finalData);
        if (onClose) onClose();
    };

    return (
        <Box
            sx={{
                width: { xs: '100dvw', sm: '30dvw', md: '25dvw' },
                background: { xs: COLORS.cream, sm: 'transparent' },
                height: 'auto',
                position: { xs: 'absolute', sm: 'relative' },
                top: { xs: '3rem', sm: '0' },
                left: 0,
                zIndex: { xs: 99, sm: 1 },
                p: 3,
                pl: { xs: 6 },
                overflowY: 'auto'
            }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h2" sx={{ fontSize: '1.4rem', color: COLORS.f1 }}>
                    ตัวกรอง
                </Typography>
                <IconButton onClick={onClose} sx={{ display: { xs: 'inline-flex', sm: 'none' }, color: COLORS.f2 }}>
                    <CloseIcon fontSize="large" />
                </IconButton>
            </Box>

            <Box sx={{ flexGrow: 1 }}>
                <Divider sx={{ display: { xs: 'block', sm: 'none' }, borderColor: '#D2B48C', opacity: 0.5, mb: 2 }} />

                {/* 1. ประเภท */}
                <Box sx={{ mb: 2 }}>
                    <Typography variant="h3" sx={{ color: COLORS.f2, mb: 1 }}>ประเภท</Typography>
                    <FormGroup>
                        {CATEGORY_FILTERS.map((cat: any, index: number) => (
                            <FormControlLabel
                                key={`filter-${cat.type}-${index}`}
                                control={
                                    <Checkbox
                                        size="small"
                                        checked={selectedCats.includes(cat.type)}
                                        onChange={() => handleCatChange(cat.type)}
                                        sx={{ color: COLORS.f2, '&.Mui-checked': { color: COLORS.f2 } }}
                                    />
                                }
                                label={<Typography variant='body2' sx={{ color: COLORS.f2 }}>{cat.title}</Typography>}
                            />
                        ))}
                    </FormGroup>
                </Box>
                <Divider sx={{ borderColor: '#D2B48C', opacity: 0.5, mb: 2 }} />
                
                {/* ProductSort สำหรับแสดงเฉพาะบนมือถือ (xs) */}
                <Box sx={{ display: { xs: 'block', sm: 'none' }, mb: 2 }}>
                    <ProductSort
                        value={sortValue}
                        onSortChange={(value) => {
                            setSortValue(value);
                        }}
                    />
                </Box>

                {/* 2. ราคา */}
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h3" sx={{ mb: 2, color: COLORS.f2 }}>ราคา</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <TextField
                            placeholder="จากราคา" size="small" fullWidth
                            type="number" value={price.min} onChange={handlePriceChange('min')}
                            error={!!priceError} // ⭐️ เปลี่ยนสีกรอบเป็นสีแดงเมื่อมี Error
                            sx={{ bgcolor: 'white', '& fieldset': { borderColor: priceError ? 'error.main' : '#D2B48C' } }}
                        />
                        <TextField
                            placeholder="ถึงราคา" size="small" fullWidth
                            type="number" value={price.max} onChange={handlePriceChange('max')}
                            error={!!priceError} // ⭐️ เปลี่ยนสีกรอบเป็นสีแดงเมื่อมี Error
                            sx={{ bgcolor: 'white', '& fieldset': { borderColor: priceError ? 'error.main' : '#D2B48C' } }}
                        />
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 'bold', color: COLORS.f2 }}>THB</Typography>
                    </Box>
                    {/* ⭐️ 3. แสดงข้อความเตือนเมื่อมี Error */}
                    {priceError && (
                        <Typography variant="body2" sx={{ color: 'error.main', mt: 1, fontSize: '0.8rem' }}>
                            {priceError}
                        </Typography>
                    )}
                </Box>
                <Divider sx={{ borderColor: '#D2B48C', opacity: 0.5, mb: 3 }} />

                {/* 3. คลังสินค้า */}
                <Box sx={{ mb: 2 }}>
                    <Typography variant="h3" sx={{ color: COLORS.f2, mb: 1 }}>คลังสินค้า</Typography>
                    <FormGroup>
                        <FormControlLabel
                            control={<Checkbox size="small" checked={isStock === true} onChange={() => setIsStock(true)} sx={{ color: COLORS.f2, '&.Mui-checked': { color: COLORS.f2 } }} />}
                            label={<Typography variant='body2' sx={{ color: COLORS.f2 }}>สินค้ามีสต๊อก</Typography>}
                        />
                        <FormControlLabel
                            control={<Checkbox size="small" checked={isStock === false} onChange={() => setIsStock(false)} sx={{ color: COLORS.f2, '&.Mui-checked': { color: COLORS.f2 } }} />}
                            label={<Typography variant='body2' sx={{ color: COLORS.f2 }}>สินค้าไม่มีสต๊อก</Typography>}
                        />
                    </FormGroup>
                </Box>
                <Divider sx={{ borderColor: '#D2B48C', opacity: 0.5, mb: 3 }} />

                {/* 4. ประเภทร้านค้า */}
                <Box sx={{ mb: 2 }}>
                    <Typography variant="h3" sx={{ color: COLORS.f2, mb: 1 }}>ประเภทร้านค้า</Typography>
                    <FormGroup>
                        {[
                            { label: 'Official', value: 'official' },
                            { label: 'Creator Shop', value: 'creator' },
                            { label: 'Agent Shop', value: 'agent' }
                        ].map((shop) => (
                            <FormControlLabel
                                key={shop.value}
                                control={
                                    <Checkbox
                                        size="small"
                                        checked={shopTypes.includes(shop.value)}
                                        onChange={() => handleShopTypeChange(shop.value)}
                                        sx={{ color: COLORS.f2, '&.Mui-checked': { color: COLORS.f2 } }}
                                    />
                                }
                                label={<Typography variant='body2' sx={{ color: COLORS.f2 }}>{shop.label}</Typography>}
                            />
                        ))}
                    </FormGroup>
                </Box>
                <Divider sx={{ borderColor: '#D2B48C', opacity: 0.5, mb: 2 }} />
            </Box>

            <Box sx={{ mt: 4, pb: isMobile ? 4 : 0, display: 'flex', justifyContent: 'flex-end' }}>
                <StoreButton size="large" onClick={handleApplyFilters}>
                    ตกลง
                </StoreButton>
            </Box>
        </Box>
    );
};

export default ProductFilter;