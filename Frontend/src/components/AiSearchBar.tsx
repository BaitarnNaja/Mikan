import React, { useState, useEffect } from 'react';
import { Box, InputBase, IconButton, Typography, useMediaQuery, useTheme } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useRouter } from 'next/navigation'; // ⭐️ 1. Import useRouter

interface Props {
  isMobileSearchOpen: boolean;
  setIsMobileSearchOpen: (open: boolean) => void;
  alwaysFullWidth?: boolean; 
}

const AiSearchBar: React.FC<Props> = ({ 
  isMobileSearchOpen, 
  setIsMobileSearchOpen, 
  alwaysFullWidth = false 
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [mounted, setMounted] = useState(false);
  const theme = useTheme();
  
  const router = useRouter(); // ⭐️ 2. เรียกใช้งาน router สำหรับเปลี่ยนหน้า

  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSearch = () => {
    if (searchValue.trim()) {
      // ⭐️ 3. สั่งเปลี่ยนหน้าไปที่ /search/คำที่พิมพ์มา
      router.push(`/search/${encodeURIComponent(searchValue.trim())}`);
      
      // (Option) ถ้าหน้าจอมือถือเปิด Search อยู่ พอกดค้นหาเสร็จก็ปิดแถบให้ด้วย
      if (isMobileSearchOpen && !alwaysFullWidth) {
        setIsMobileSearchOpen(false);
      }
    }
  };

  if (!mounted) return null;

  const shouldShowFull = alwaysFullWidth || isMobileSearchOpen || !isSmallScreen;

  return (
    <Box
      sx={{
        position: (isMobileSearchOpen && !alwaysFullWidth) ? 'fixed' : 'relative',
        top: (isMobileSearchOpen && !alwaysFullWidth) ? '10px' : 'auto',
        left: (isMobileSearchOpen && !alwaysFullWidth) ? '10px' : 'auto',
        right: (isMobileSearchOpen && !alwaysFullWidth) ? '10px' : 'auto',

        zIndex: 99,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',

        backgroundColor: shouldShowFull ? '#fff' : 'transparent',
        borderRadius: '50px',
        padding: shouldShowFull ? '4px 15px' : '0px',
        boxShadow: shouldShowFull ? '0px 0px 6.3px 0px #FF884C' : 'none',
        border: shouldShowFull ? '1px solid rgba(255, 136, 76, 0.3)' : 'none',

        width: (isMobileSearchOpen && !alwaysFullWidth) 
          ? 'calc(100% - 60px)' 
          : { 
              xs: alwaysFullWidth ? '60dvw' : 'auto',
              sm: alwaysFullWidth ? '60dvw' : '35dvw'  
            },

        maxWidth: (isMobileSearchOpen && !alwaysFullWidth) ? 'none' : '800px',

        ml: (isMobileSearchOpen && !alwaysFullWidth) ? 0 : 0,
        mr: (isMobileSearchOpen && !alwaysFullWidth) ? 0 : (alwaysFullWidth ? 0 : { xs: 0, sm: 3 }),

        transition: 'all 0.2s ease-in-out',
      }}
    >
      <Typography
        variant="body2"
        sx={{
          color: '#E66625',
          fontWeight: 'bold',
          mr: 1.5,
          fontSize: '13px',
          display: shouldShowFull ? 'block' : 'none',
          whiteSpace: 'nowrap'
        }}
      >
        AI Mode
      </Typography>

      <InputBase
        placeholder="ช่วยหาในสิ่งที่คุณสนใจ"
        autoFocus={isMobileSearchOpen}
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        onKeyPress={(e) => { if (e.key === 'Enter') handleSearch(); }}
        inputProps={{ maxLength: 500 }}
        sx={{
          flex: 1,
          fontSize: '14px',
          display: shouldShowFull ? 'flex' : 'none',
          height: '24px',
          '& .MuiInputBase-input': { padding: '2px 0px' }
        }}
      />

      <Box
        component="img"
        src="/Search-icon.svg"
        alt="search"
        onClick={() => {
          if (!alwaysFullWidth && isSmallScreen && !isMobileSearchOpen) {
            setIsMobileSearchOpen(true);
          } else {
            handleSearch();
          }
        }}
        sx={{
          width: 24,
          height: 24,
          cursor: 'pointer',
          flexShrink: 0,
          ml: shouldShowFull ? 1 : 0
        }}
      />

      {isMobileSearchOpen && !alwaysFullWidth && (
        <IconButton
          size="small"
          onClick={() => setIsMobileSearchOpen(false)}
          sx={{ ml: 0.5, color: '#E66625', flexShrink: 0 }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      )}
    </Box>
  );
};

export default AiSearchBar;