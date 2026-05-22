import { useLoading } from "@/src/components/LoadingContext";
import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";
import { GetNewProductRequest, ApiResponse } from "../type/products";
import { handleSubmit } from "@/src/utils/handleSubmit";
import { productService } from "@/src/services/productService";

export const useNewProductSearch = (openPopup?: (t: string, m: string) => void) => {
    const router = useRouter();
    const { showLoading, hideLoading } = useLoading();

    const [submitting, setSubmitting] = useState(false);
    // ปรับ type ให้รับ ApiResponse เต็มๆ เพื่อส่งเข้า ProductSlider ได้
    const [productData, setProductData] = useState<ApiResponse | null>(null);

    // ใช้ useCallback เพื่อป้องกัน infinite loop เวลานำไปใส่ใน useEffect
    const searchNewProducts = useCallback(async () => {
        const payload: GetNewProductRequest = {
            limit: 20,
            page: 1,
        };

        setSubmitting(true);
        showLoading();
        await handleSubmit({
            action: () => productService.searchNewProducts(payload),
            setSubmitting: (isSubmitting) => {
                setSubmitting(isSubmitting);
                if (isSubmitting) showLoading();
                else hideLoading();
            },
            onSuccess: (res) => {
                // เก็บค่าทั้งก้อน (metadata + data)
                setProductData(res?.data || res || { metadata: { total: 0, limit: 20, page: 1 }, data: [] });
            },
            onError: (err) => console.error("Fetch Product Error", err),
            openPopup,
            failMessage: "ไม่สามารถดึงข้อมูลสินค้าได้"
        });
    }, [showLoading, hideLoading, openPopup]);

    // return ตัวแปรและฟังก์ชันออกไปให้ Component เรียกใช้
    return {
        productData,
        submitting,
        searchNewProducts
    };
};