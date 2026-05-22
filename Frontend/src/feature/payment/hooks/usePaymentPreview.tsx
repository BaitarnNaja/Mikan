import { useState, useEffect } from 'react';
import { userProfileService } from '@/src/services/userProfileService';
import { paymentService } from '@/src/services/paymentService';

export const useCheckout = (idsString: string | null) => {
    const [isLoading, setIsLoading] = useState(true);
    const [address, setAddress] = useState<any>(null);
    const [previewData, setPreviewData] = useState<any>(null);

    useEffect(() => {
        const fetchCheckoutData = async () => {
            setIsLoading(true);
            try {
                // 💡 1. ทำหน้าที่ดึงที่อยู่จัดส่งอย่างเดียวพอสำหรับ Hook ตัวนี้
                const addressRes = await userProfileService.getAddresses();
                console.log("Address Response:", addressRes);

                const addressList = addressRes?.data?.data || [];
                const defaultAddress = addressList.find((addr: any) => addr.isDefault) || addressList[0];
                setAddress(defaultAddress || null);

            } catch (error) {
                console.error("Failed to fetch checkout data", error);
            } finally {
                // 🔓 ปลดล็อกสถานะ Loading
                setIsLoading(false);
            }
        };

        fetchCheckoutData();
    }, [idsString]);

    return {
        isLoading,
        address,
        previewData
    };
};