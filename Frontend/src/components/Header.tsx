"use client";

import React, { useState, useEffect } from 'react';
import {
    AppBar, Toolbar, Typography, IconButton, Badge, Box,
    Drawer, ListItemButton, ListItemText, Button, Collapse,
    Divider, useMediaQuery, useTheme
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AiSearchBar from './AiSearchBar';
import { usePathname, useRouter } from 'next/navigation'; // ⭐️ นำเข้า useRouter
import { COLORS } from '../styles';
import { PRODUCT_CATEGORIES } from '../constants/products';
import CloseIcon from '@mui/icons-material/Close';
import { useProductSearch } from '../feature/products/hook/useProductSearch';
import { useCart } from '../feature/cart/hook/useCart';

const Header: React.FC = () => {
    const pathname = usePathname();
    const router = useRouter(); // ⭐️ เรียกใช้งาน router
    const theme = useTheme();

    const isMobileSize = useMediaQuery(theme.breakpoints.down('md'));
    const showSearchBar = pathname !== '/';

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const { fetchAndNavigate } = useProductSearch();
    const { fetchCartCount, cartCount } = useCart(); 

    useEffect(() => {
        setMounted(true);
        fetchCartCount(); 
    }, []);

    const handleClickMenu = async (path: string, type?: string) => {
        setIsMenuOpen(false); 
        await fetchAndNavigate(path, type); 
    };

    // ⭐️ ฟังก์ชันสำหรับ "เกี่ยวกับเรา"
    const handleAboutUsClick = () => {
        setIsMenuOpen(false);
        if (pathname === '/') {
            // ถ้าอยู่หน้าแรกอยู่แล้ว ให้เลื่อนไปที่ id="about-us"
            const element = document.getElementById('about-us');
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            // ถ้าอยู่หน้าอื่น ให้ย้อนกลับไปหน้าแรกพร้อมพ่วง Hash #about-us
            router.push('/#about-us');
        }
    };

    // ⭐️ ฟังก์ชันสำหรับ "ติดต่อเรา"
    const handleContactUsClick = () => {
        setIsMenuOpen(false);
        // เลื่อนไปล่างสุดของเอกสาร (Footer ของทุกหน้า)
        window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: 'smooth'
        });
    };

    if (!mounted) return null;

    const ProductMenuContent = ({ isMobile = false }: { isMobile?: boolean }) => (
        <Box sx={{ bgcolor: COLORS.cream, p: isMobile ? 2 : 4, width: '100dvw' }}>
            {/* โค้ดเมนูสินค้าเหมือนเดิม ... */}
            <Box
                sx={{
                    maxWidth: '1200px', mx: 'auto', display: 'flex', 
                    flexDirection: isMobile ? 'column' : 'row', flexWrap: 'wrap',
                }}
            >
                {PRODUCT_CATEGORIES.map((cat) => (
                    <Box key={cat.title} sx={{ mx: 2, mb: 2 }}>
                        <Typography
                            variant="h4"
                            onClick={() => handleClickMenu(`/products/${cat.path}`, (cat as any).type)}
                            sx={{ cursor: 'pointer', mb: 1 }}
                        >
                            {cat.title}
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {cat.items.map((item, id) => (
                                <Typography
                                    key={id}
                                    variant="body2"
                                    onClick={() => handleClickMenu(`/products/${cat.path}/${item.path}`, (item as any).type)}
                                    sx={{ color: COLORS.f1, cursor: 'pointer' }}
                                >
                                    {item.name}
                                </Typography>
                            ))}
                        </Box>
                    </Box>
                ))}
            </Box>

            {isMobile && (
                <Box sx={{ mt: 1, pt: 2, borderTop: '1px solid rgba(0,0,0,0.1)' }}>
                    {/* ⭐️ ใส่ onClick ในเมนูมือถือ */}
                    <ListItemButton onClick={handleAboutUsClick}>
                        <ListItemText primary="เกี่ยวกับเรา" sx={{ color: '#4E342E' }} />
                    </ListItemButton>
                    <ListItemButton onClick={handleContactUsClick}>
                        <ListItemText primary="ติดต่อเรา" sx={{ color: '#4E342E' }} />
                    </ListItemButton>
                </Box>
            )}
        </Box>
    );

    return (
        <AppBar position="fixed" sx={{ backgroundColor: '#fff', color: '#E16424', boxShadow: 'none', borderBottom: '1px solid #eee' }}>
            <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 0, sm: '5dvw' }, mx: { xs: 1 }, position: 'relative', height: '3rem' }}>
                {!isMobileSearchOpen && (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton edge="start" color="inherit" sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} onClick={toggleMenu}>
                            <MenuIcon />
                        </IconButton>
                        <Box sx={{ display: "flex", alignItems: "center", gap: { md: 2, lg: 6 } }}>
                            <Box sx={{ display: "flex", alignItems: "center", mr: 2 }}>
                                <a href='/'>
                                    <Box component="img" src="/logo.png" sx={{ height: '3rem', width: 'auto', cursor: 'pointer' }} />
                                </a>
                            </Box>
                            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
                                <Button color="inherit" endIcon={<ExpandMoreIcon sx={{ transform: isMenuOpen ? 'rotate(180deg)' : 'none', transition: '0.3s' }} />} sx={{ fontWeight: 'bold' }} onClick={toggleMenu}>
                                    <Typography variant="body2">สินค้า</Typography>
                                </Button>
                                {/* ⭐️ ใส่ onClick ในปุ่ม Desktop */}
                                <Button color="inherit" sx={{ fontWeight: 'bold' }} onClick={handleAboutUsClick}>
                                    <Typography variant="body2">เกี่ยวกับเรา</Typography>
                                </Button>
                                <Button color="inherit" sx={{ fontWeight: 'bold' }} onClick={handleContactUsClick}>
                                    <Typography variant="body2">ติดต่อเรา</Typography>
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                )}

                <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 2 }, ml: 'auto' }}>
                    {showSearchBar && <AiSearchBar isMobileSearchOpen={isMobileSearchOpen} setIsMobileSearchOpen={setIsMobileSearchOpen} />}
                    {!isMobileSearchOpen && (
                        <>
                            <IconButton color="inherit">
                                <Badge badgeContent={cartCount} color="error" sx={{ '& .MuiBadge-badge': { backgroundColor: '#E65100' } }}>
                                    <a href='/usercart' style={{ textDecoration: 'none', color: '#E16424' }}><ShoppingCartIcon /></a>
                                </Badge>
                            </IconButton>
                            <IconButton color="inherit">
                                <a href='/userprofile' style={{ textDecoration: 'none', color: '#E16424' }}><AccountCircleIcon fontSize="large" /></a>
                            </IconButton>
                        </>
                    )}
                </Box>

                {!isMobileSize && (
                    <Collapse in={isMenuOpen} sx={{ position: 'absolute', top: '100%', left: 0, width: '100%', bgcolor: COLORS.cream, zIndex: 5, borderBottom: '1px solid #eee' }}>
                        <Box sx={{ display: 'flex', justifyContent: "space-around" }}>
                            <ProductMenuContent />
                        </Box>
                    </Collapse>
                )}

                <Drawer anchor="left" open={isMenuOpen && isMobileSize} onClose={() => setIsMenuOpen(false)} PaperProps={{ sx: { backgroundColor: COLORS.cream, width: 250 } }}>
                    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }} role="presentation">
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 0.5 }}>
                            <IconButton onClick={() => setIsMenuOpen(false)} sx={{ color: '#E66625' }}><CloseIcon fontSize="small" /></IconButton>
                        </Box>
                        <Divider sx={{ opacity: 0.5 }} />
                        <Box>
                            <ProductMenuContent isMobile={true} />
                        </Box>
                    </Box>
                </Drawer>
            </Toolbar>
        </AppBar>
    );
};

export default Header;