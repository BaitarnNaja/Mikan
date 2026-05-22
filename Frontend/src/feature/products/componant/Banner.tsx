// components/ShopBox.tsx
import { Box } from '@mui/material';

export default function Banner() {
    return (
        <Box
            sx={{
                backgroundColor: '#fff',
                borderRadius: '24px',
                width: '90%',
                maxWidth: '1100px',
                height: '5rem',
                display: 'flex',      
                overflow: 'hidden',   
            }}
        >
            <Box
                component="img"
                src="https://picsum.photos/900/200?sig=1" 
                alt="Banner Image"
                sx={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '16px', 
                    objectFit: 'cover',   
                    objectPosition: 'center'
                }}
            />
        </Box>
    );
}