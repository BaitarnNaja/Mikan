// src/feature/products/componant/ProductCard.tsx (หรือ path ที่คุณเก็บไว้)
"use client";

import { Card, CardContent, CardMedia, Typography, Box } from '@mui/material';
import { useRouter } from 'next/navigation'; // ⭐️ เพิ่ม useRouter
import { Product } from '../type/products';
import { COLORS } from '@/src/styles';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const router = useRouter(); // ⭐️ เรียกใช้งาน router

  return (
    <Card
      onClick={() => router.push(`/product/${product.id}`)} 
      elevation={0}
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 4,
        border: '1px solid #f0f0f0',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        p: 1.5,
        transition: '0.2s',
        cursor: 'pointer', // ⭐️ เพิ่ม cursor ให้รู้ว่ากดได้
        '&:hover': { transform: 'translateY(-4px)' }
      }}
    >
      <CardMedia
        component="img"
        image= {product.img}
        alt={product.productName}
        sx={{
          width: '100%',
          aspectRatio: '1/1',
          borderRadius: 3,
          objectFit: 'cover'
        }}
      />

      <CardContent sx={{ p: 1, pt: 1, '&:last-child': { pb: 0 } ,flexGrow: 1}}>
        <Typography
          sx={{
            fontWeight: 400,
            fontSize: { xs: '0.65rem', md: '0.85rem' },
            color: COLORS.f3,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            height: { xs: '1rem', md: '2rem' },
            lineHeight: 1.3
          }}
        >
          {product.productName}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.4 }}>
          <Typography
            sx={{
              fontWeight: 600,
              color: COLORS.f1,
              fontSize: { xs: '0.85rem', md: '1rem' }
            }}
          >
            {product.price.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </Typography>
          <Typography sx={{ fontWeight: 700, color: '#E67E22', fontSize: '0.8rem' }}>
            {product.price.currency}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProductCard;