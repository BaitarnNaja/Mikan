// src/feature/products/hook/useProductDetail.ts
import { useState, useEffect } from "react";
import { productService } from "@/src/services/productService";
import { ProductDetail } from "../type/products";



export const useProductDetail = (productId: string) => {
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productId) return;

    const fetchProductDetail = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const res = await productService.getProductById(productId);
        console.log("Product detail: ", res)
        const data = res?.data || res;
        setProduct(data);
      } catch (err) {
        console.error("Fetch Product Detail Error:", err);
        setError("ไม่สามารถดึงข้อมูลสินค้าได้");
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetail();
  }, [productId]);

  return { product, loading, error };
};