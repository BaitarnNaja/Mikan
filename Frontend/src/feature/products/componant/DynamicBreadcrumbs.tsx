import React from 'react';
import { Breadcrumbs, Typography, Link as MuiLink, Box } from '@mui/material';
import Link from 'next/link';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

// กำหนดโครงสร้างข้อมูลที่รับเข้ามา
export interface BreadcrumbItem {
  label: string;
  path?: string; 
}

interface DynamicBreadcrumbsProps {
  items: BreadcrumbItem[];
}

const DynamicBreadcrumbs: React.FC<DynamicBreadcrumbsProps> = ({ items }) => {
  return (
    <Box sx={{ p: 2 }}>
      <Breadcrumbs 
        separator={<NavigateNextIcon fontSize="small" sx={{ color: '#E46A25' }} />} 
        aria-label="breadcrumb"
      >
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return isLast ? (
            // รายการสุดท้าย (หน้าปัจจุบัน) - มีเส้นใต้ตามรูป
            <Typography 
              key={item.label}
              sx={{ 
                color: '#E46A25', 
                fontWeight: 'bold', 
                fontSize: '1.1rem',
                borderBottom: '2px solid #E46A25',
                pb: 0.2
              }}
            >
              {item.label}
            </Typography>
          ) : (
            // รายการก่อนหน้า - คลิกได้
          <MuiLink 
              key={item.label}
              component={Link} // ใช้ Link จาก 'next/link'
              href={item.path || '#'}
              underline="none" 
              sx={{ 
                color: '#E46A25', 
                fontWeight: 'bold', 
                fontSize: '1.1rem',
                cursor: 'pointer',
                '&:hover': { opacity: 0.8 }
              }}
            >
              {item.label}
            </MuiLink>
          );
        })}
      </Breadcrumbs>
    </Box>
  );
};

export default DynamicBreadcrumbs;