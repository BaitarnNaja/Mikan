// src/feature/orders/hook/useOrderDetail.ts
import { useState, useEffect } from "react";
import { orderService } from "@/src/services/orderService";
import { OrderDetail } from "../type/cart";

export const useOrderDetail = (orderId: string) => {
    const [order, setOrder] = useState<OrderDetail | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const fetchOrderDetail = async () => {
        setLoading(true);
        try {
            const res = await orderService.getOrderDetail(orderId);
            setOrder(res?.data);
        } catch (err) {
            setError("ไม่สามารถดึงข้อมูลคำสั่งซื้อได้");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!orderId) return;
        fetchOrderDetail();
    }, [orderId]);

    return { order, loading, error, mutate: fetchOrderDetail };
};