'use client';

import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import { COLORS } from '@/src/styles'; // ตรวจสอบ Path ของสีคุณ

interface ResponsiveMediaCardProps {
    imageUrl: string;
    title: string;
    text: string;
}

export default function ResponsiveMediaCard({
    imageUrl,
    text,
    title
}: ResponsiveMediaCardProps) {
    return (
        <Box
            sx={{
                width: '100%',
                display: 'flex',
                flexDirection: {
                    xs: 'row',
                    sm: 'column',
                },
                // ระยะห่างระหว่างรูปและข้อความ
                gap: {
                    xs: 2,
                    sm: 1,
                },
                p: 1.5,
                bgcolor: 'transparent',
                borderRadius: 2,
            }}>
            {/* 1. ส่วนของรูปภาพ (Avatar) */}
            <Avatar
                src={imageUrl}
                alt="Product/User Image"
                variant="circular"
                sx={{
                    width: {
                        xs: 60,
                        sm: 100,
                    },
                    height: {
                        xs: 60,
                        sm: 100,
                    },
                    // ---------------------------------
                    border: '1px solid rgba(0,0,0,0.1)', // ขอบจางๆ
                    flexShrink: 0, // ป้องกันรูปโดนบีบ
                }}
            />

            <Box sx={{display:'flex',flexDirection: 'column',}}>
                <Typography
                    variant="h3"
                    sx={{
                        color: COLORS.f2, // ตรวจสอบสีของคุณ
                        display: '-webkit-box',
                        overflow: 'hidden',
                        WebkitBoxOrient: 'vertical',
                        // กำหนดจำนวนบรรทัดสูงสุด
                        WebkitLineClamp: {
                            xs: 2, // xs โชว์ 2 บรรทัด
                            sm: 1, // sm โชว์ 1 บรรทัด (ตามภาพตัวอย่าง)
                        },
                        width: '100%',
                        wordBreak: 'break-word',
                        mb:1
                    }}
                >
                    {title}
                </Typography>
                <Typography
                    variant="body2"
                    sx={{
                        color: COLORS.f2, 
                        opacity: 0.6,
                        display: '-webkit-box',
                        overflow: 'hidden',
                        WebkitBoxOrient: 'vertical',
                        // กำหนดจำนวนบรรทัดสูงสุด
                        WebkitLineClamp: {
                            xs: 2, // xs โชว์ 2 บรรทัด
                            sm: 1, // sm โชว์ 1 บรรทัด (ตามภาพตัวอย่าง)
                        },
                        width: '100%',
                        wordBreak: 'break-word',
                        lineHeight: 1.4,
                    }}
                >
                    {text}
                </Typography>
            </Box>

        </Box>
    );
}