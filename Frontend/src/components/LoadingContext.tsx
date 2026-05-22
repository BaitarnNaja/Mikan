'use client';

import React, { createContext, useContext, useState } from 'react';
import { Backdrop, CircularProgress } from '@mui/material';

// 1. กำหนดชนิดของข้อมูลใน Context
interface LoadingContextType {
  showLoading: () => void;
  hideLoading: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

// 2. สร้าง Provider เพื่อนำไปครอบแอปพลิเคชัน
export const LoadingProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);

  const showLoading = () => setIsLoading(true);
  const hideLoading = () => setIsLoading(false);

  return (
    <LoadingContext.Provider value={{ showLoading, hideLoading }}>
      {children}
      
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </LoadingContext.Provider>
  );
};

// 3. สร้าง Custom Hook ไว้เรียกใช้งานง่ายๆ
export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};