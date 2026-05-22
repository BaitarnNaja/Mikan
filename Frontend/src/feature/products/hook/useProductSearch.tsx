// src/feature/products/hook/useProductSearch.ts
import { useState } from "react";
import { productService } from "@/src/services/productService";
import { handleSubmit } from "@/src/utils/handleSubmit";
import { useLoading } from "@/src/components/LoadingContext";
import { useRouter } from "next/navigation";
import { GetProductRequest } from "../type/products";

export const useProductSearch = (openPopup?: (t: string, m: string) => void) => {
    const router = useRouter();
    const { showLoading, hideLoading } = useLoading();

    const [submitting, setSubmitting] = useState(false);
    const [products, setProducts] = useState<any[]>([]);
    const [total, setTotal] = useState<number>(0);

    const fetchAndNavigate = async (path: string, itemType?: string) => {
        const payload: GetProductRequest = {
            limit: 12,
            page: 1,
            type: itemType ? [itemType] : undefined,
        };
        await handleSubmit({
            action: () => productService.searchProducts(payload),
            setSubmitting: (isSubmitting) => {
                setSubmitting(isSubmitting);
                if (isSubmitting) showLoading();
                else hideLoading();
            },
            onSuccess: (res) => {
                router.push(path);
            },
            onError: (err) => console.error("Fetch Product Error", err),
            openPopup,
            failMessage: "ไม่สามารถดึงข้อมูลสินค้าได้"
        });
    };

    const search = async (params: GetProductRequest) => {
        console.log('onserch',params)

        await handleSubmit({
            action: () => productService.searchProducts(params),
            setSubmitting: (isSubmitting) => {
                setSubmitting(isSubmitting);
                if (isSubmitting) showLoading();
                else hideLoading();
            },
            onSuccess: (res) => {
                setProducts(res?.data.data || res || []);
                setTotal(res?.data.metadata?.total || res?.length || 0);
            },
            onError: (err) => console.error("Search Product Error", err),
            openPopup,
            failMessage: "ไม่สามารถค้นหาสินค้าได้"
        });
    };

    // ⭐️ เพิ่มฟังก์ชันใหม่ สำหรับหน้า Search โดยเฉพาะ
    const searchByKeyword = async (params: GetProductRequest) => {
        
        await handleSubmit({
            action: () => productService.searchProductsByKeyword(params),
            setSubmitting: (isSubmitting) => {
                setSubmitting(isSubmitting);
                if (isSubmitting) showLoading();
                else hideLoading();
            },
            onSuccess: (res) => {
                setProducts(res?.data.data || res || []);
                setTotal(res?.data.metadata?.total || res?.length || 0);
                console.log(products);
            },
            onError: (err) => console.error("Search Product By Keyword Error", err),
            openPopup,
            failMessage: "ไม่พบสินค้าที่คุณค้นหา"
        });
    };

    return {
        submitting,
        fetchAndNavigate,
        search,
        searchByKeyword, // ส่งออกฟังก์ชันใหม่
        products,
        total
    };
};