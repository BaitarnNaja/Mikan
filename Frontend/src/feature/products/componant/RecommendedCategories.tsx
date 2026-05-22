// components/ShopBox.tsx
import { Box } from '@mui/material';
import { RecommendedGrid } from './CategoryGrid';

export default function RecommendedCategories() {
  return (
   <Box
  sx={{
    display:'flex',
    boxSizing: 'border-box',
    backgroundColor: '#fff',
    borderRadius: '24px',
    border: '1px solid #E66625', 
    p: { xs: 2, sm: 3 },
    m:0,
    width: '90%',
    maxWidth: '1100px',
    boxShadow: '0px 4px 25.8px -16px rgba(230, 102, 37, 1)',
    
  }}
>
      <RecommendedGrid />
    </Box>
  );
}