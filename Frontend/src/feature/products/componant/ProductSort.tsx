// src/feature/products/componant/ProductSort.tsx
"use client";

import React, { useState } from 'react';
import {
    MenuItem, FormControl, Select, SelectChangeEvent,
    Box, styled
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const StyledFormControl = styled(FormControl)({
    '& .MuiOutlinedInput-root': {
        borderRadius: '8px',
        color: '#d35400',
        fontWeight: 'bold',
        backgroundColor: '#ffffff',
        '& fieldset': { borderColor: '#e67e22' },
        '&:hover fieldset': { borderColor: '#d35400' },
        '&.Mui-focused fieldset': { borderColor: '#d35400' },
    },
});

const sortOptions = [
    { value: 'new', label: 'สินค้าใหม่' },
    { value: 'az', label: 'ตัวอักษร A-Z' },
    { value: 'za', label: 'ตัวอักษร Z-A' },
    { value: 'price_low', label: 'ราคาจากต่ำ-สูง' },
    { value: 'price_high', label: 'ราคาจากสูง-ต่ำ' },
    { value: 'date_new', label: 'วันออกสินค้าใหม่-เก่า' },
    { value: 'date_old', label: 'วันออกสินค้าเก่า-ใหม่' },
];

interface ProductSortProps {
    value?: string | null;
    onSortChange?: (value: string) => void;
}

export default function ProductSort({ value,onSortChange }: ProductSortProps) {
    const [sortBy, setSortBy] = useState('');

    const handleChange = (event: SelectChangeEvent) => {
        const value = event.target.value;
        setSortBy(value);
        if (onSortChange) onSortChange(value);
    };

    return (
        <Box sx={{ minWidth: 100 }}>
            <StyledFormControl fullWidth size="small">
                <Select
                    value={value || ""}
                    onChange={handleChange}
                    displayEmpty
                    renderValue={(selected) => {
                        if (selected === "") {
                            return <span style={{ color: '#d35400' }}>จัดหมวดหมู่</span>;
                        }
                        const selectedOption = sortOptions.find(opt => opt.value === selected);
                        return selectedOption ? selectedOption.label : "";
                    }}
                    IconComponent={KeyboardArrowDownIcon}
                    MenuProps={{
                        PaperProps: {
                            sx: {
                                borderRadius: '8px',
                                mt: 1,
                                boxShadow: '0px 4px 20px rgba(0,0,0,0.1)',
                                '& .MuiMenuItem-root': {
                                    fontSize: '0.9rem',
                                    py: 1,
                                    color: '#d35400',
                                    '&.Mui-selected': {
                                        backgroundColor: '#e67e22',
                                        color: '#fff',
                                        '&:hover': { backgroundColor: '#d35400' },
                                    },
                                    '&:hover': { backgroundColor: '#fff3e0' },
                                },
                            },
                        },
                    }}
                >
                    {sortOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </Select>
            </StyledFormControl>
        </Box>
    );
}