// src/feature/shop/hook/useShop.ts
import { useState, useEffect, useCallback } from "react";
import { shopService, GetShopProductsRequest } from "@/src/services/shopService";

export const useShop = (shopId: string) => {
    const [shopDetail, setShopDetail] = useState<any>(null);
    const [products, setProducts] = useState<any[]>([]);
    const [metadata, setMetadata] = useState({ page: 1, limit: 10, total: 0 });
    const [loadingDetail, setLoadingDetail] = useState(true);
    const [loadingProducts, setLoadingProducts] = useState(true);

    // ดึงข้อมูลรายละเอียดร้านค้า
    useEffect(() => {
        const fetchShopDetail = async () => {
            try {
                setLoadingDetail(true);
                const response = await shopService.getShopById(shopId);
                console.log("Check API Raw Response:", response);
                const actualData = response.data?.data || response.data || response;
                setShopDetail(actualData);
            } catch (error) {
                console.error("Fetch Shop Detail Error", error);
            } finally {
                setLoadingDetail(false);
            }
        };

        if (shopId) fetchShopDetail();
    }, [shopId]);

    // ฟังก์ชันดึงสินค้า (เพื่อให้เรียกใหม่ได้เวลาเปลี่ยนหน้า หรือเปลี่ยนหมวดหมู่)
    const fetchShopProducts = useCallback(async (params: GetShopProductsRequest) => {
        try {
            setLoadingProducts(true);
            const response = await shopService.getShopProducts(shopId, params);
            const result = response.data?.data || response.data || response;
            console.log("Raw Product Result: ", result);
            setProducts(result?.items || []); 
            setMetadata(result?.metadata || { page: 1, limit: 10, total: 0 });
        } catch (error) {
            console.error("Fetch Shop Products Error", error);
        } finally {
            setLoadingProducts(false);
        }
    }, [shopId]);

    return { 
        shopDetail, 
        products, 
        metadata, 
        loadingDetail, 
        loadingProducts, 
        fetchShopProducts 
    };
};