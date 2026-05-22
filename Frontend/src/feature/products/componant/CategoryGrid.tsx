'use client';
import { Box, Typography, Paper, Stack, ButtonBase } from '@mui/material';
import { styled } from '@mui/material/styles';
import { RECOMMENDED_CATEGORIES } from '@/src/constants/products';
import { useRouter } from 'next/navigation'; // นำเข้า useRouter
import { COLORS } from '@/src/styles';
import { useProductSearch } from '../hook/useProductSearch';

const ItemCard = styled(Paper)({
    position: 'relative',
    borderRadius: '10px',
    overflow: 'hidden',
    height: '70px',
    width: '100%',
    border: '1px solid #eee',
    backgroundColor: '#f9f9f9',
});

export const RecommendedGrid = () => {
    const router = useRouter(); // สร้าง instance ของ router
    const { fetchAndNavigate } = useProductSearch();

    const row6 = RECOMMENDED_CATEGORIES[0]?.items6 || [];
    const row8 = RECOMMENDED_CATEGORIES[1]?.items8 || [];

    const handleClickMenu = async (path: string, type?: string) => {
        console.log('type', type);
        await fetchAndNavigate(path, type);
    };

    return (
        <Box sx={{ width: '100%' }}>

            {/* ส่วนที่ 1: แถวละ 6 อัน */}
            <Box
                sx={{
                    display: 'flex',
                    gap: 1,
                    mb: 2,
                    width: '100%',
                    flexWrap: { xs: 'wrap', md: 'nowrap' },
                }}
            >
                {row6.map((item, idx) => (
                    <Box key={`row6-${idx}`} sx={{ minWidth: 0, flex: { xs: '1 1 calc(33.33% - 8px)', md: 1 } }}>
                        {/* ใช้ ButtonBase เพื่อให้คลิกได้และมี Ripple Effect */}
                        <ButtonBase
                            onClick={() => handleClickMenu(`/products/${item.catPath}/${item.path}`, (item as any).type)} sx={{ width: '100%', display: 'block', borderRadius: '10px' }}
                        >
                            <Stack alignItems="center">
                                <ItemCard elevation={0}>
                                    <Box
                                        component="img"
                                        src={item.img}
                                        sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                    <Box
                                        sx={{
                                            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                                            backgroundColor: 'rgba(0, 0, 0, 0.31)',
                                        }}
                                    />
                                </ItemCard>
                                <Typography variant='h4' sx={{
                                    color: COLORS.f1, textAlign: 'center',
                                    marginTop: '4px',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    width: '100%',
                                }} >{item.name}</Typography >
                            </Stack>
                        </ButtonBase>
                    </Box>
                ))}
            </Box>

            {/* ส่วนที่ 2: 2 แถว แถวละ 4 */}
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: 'repeat(4    , 1fr)', sm: 'repeat(4, 1fr)' },
                    gap: { xs: 0.5, sm: 1.5 },
                    width: '100%'
                }}
            >
                {row8.map((item, idx) => (
                    <ButtonBase
                        key={`row8-${idx}`}
onClick={() => handleClickMenu(`/products/${item.catPath}/${item.path}`, (item as any).type)}                        sx={{ width: '100%', display: 'block', borderRadius: '10px' }}
                    >
                        <Box sx={{ minWidth: 0 }}>
                            <ItemCard elevation={0}>
                                <Box
                                    component="img"
                                    src={item.img}
                                    sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                                {/* เลเยอร์คุมสี */}
                                <Box
                                    sx={{
                                        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                                        backgroundColor: 'rgba(0, 0, 0, 0.31)',
                                    }}
                                />
                                <Typography variant='h4' sx={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    width: '100%',
                                    padding: '4px 8px',
                                    background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                                    color: COLORS.f4,
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    textAlign: 'left'
                                }}>{item.name}</Typography>
                            </ItemCard>
                        </Box>
                    </ButtonBase>
                ))}
            </Box>

        </Box>
    );
};