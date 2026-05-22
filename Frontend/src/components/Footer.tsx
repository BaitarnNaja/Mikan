import { Box, Container, Grid, Typography, Link, Stack, CardMedia } from '@mui/material';

const Footer = () => {
    return (
        <Box
            component="footer"
            sx={{
                backgroundColor: '#D35400',
                color: '#FFFFFF',
                py: { xs: 4, md: 6 },
            }}
        >
            <Container maxWidth="lg">
                <Grid container spacing={5}>

                    {/* ส่วนที่ 1: LOGO - ใช้ size แทนการเขียน xs={12} md={6} แยกกัน */}
                    <Grid size={{ xs: 12, md: 7 }}>
                        <Stack spacing={1}>
                            <Box>
                                <Box
                                    component="img"
                                    src="/logo.png"
                                    sx={{ height: '3rem', width: 'auto', cursor: 'pointer' }}
                                />
                            </Box>
                            <Typography variant="body2">
                                แหล่งรวมสินค้าจาก Idol ของคุณ และค้นหาสินค้าในสไตล์ที่ใช่
                            </Typography>
                            <Box sx={{ pt: { md: 4 }, display: { xs: 'none', md: 'block' } }}>
                                <Typography variant="caption">
                                    Copyright ©2026 xxxxx
                                </Typography>
                            </Box>
                        </Stack>
                    </Grid>

                    {/* ส่วนที่ 2: บัญชีของฉัน */}
                    <Grid size={{ xs: 6, md: 2 }}>
                        <Typography variant="h4" gutterBottom>
                            บัญชีของฉัน
                        </Typography>
                        <Stack spacing={1}>
                            <Link href="#" color="inherit" underline="hover">
                                จัดการบัญชี
                            </Link>
                            <Link href="#" color="inherit" underline="hover">
                                ออกจากระบบ
                            </Link>
                        </Stack>
                    </Grid>

                    {/* ส่วนที่ 3: ติดต่อเรา */}
                    <Grid size={{ xs: 6, md: 3 }}>
                        <Typography variant="h4" gutterBottom>
                            ติดต่อเรา
                        </Typography>
                        <Stack spacing={1}>
                            <Typography variant="body2">อีเมล :xxxxxx@mail.com</Typography>
                            <Typography variant="body2">เบอร์ติดต่อ : 0123456789</Typography>
                            <Typography variant="body2">ไลน์ : xxxxxxx</Typography>
                        </Stack>
                    </Grid>

                    {/* Copyright สำหรับ Mobile */}
                    <Grid size={{ xs: 12 }} sx={{ display: { xs: 'block', md: 'none' }, pt: 2 }}>
                        <Typography variant="body2">
                            Copyright ©2026 xxxxx
                        </Typography>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default Footer;