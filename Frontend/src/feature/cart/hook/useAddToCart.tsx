import { useState } from "react";
import { cartService } from "@/src/services/cartService";
import { AddToCartRequest } from "../type/cart";

export const useAddToCart = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const addToCart = async (payload: AddToCartRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log("payload", payload)
      const res = await cartService.addToCart(payload);
      return res; // ส่งผลลัพธ์กลับไปให้ Component เผื่อต้องการแสดงแจ้งเตือน
    } catch (err) {
      console.error("Add to Cart Error:", err);
      setError("ไม่สามารถเพิ่มสินค้าลงตะกร้าได้");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { addToCart, loading, error };
};