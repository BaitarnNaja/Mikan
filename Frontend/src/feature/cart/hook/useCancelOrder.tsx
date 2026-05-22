// src/feature/cart/hook/useCancelOrder.ts
import { orderService } from "@/src/services/orderService";
import { useState } from "react";

export const useCancelOrder = () => {
    const [isCancelling, setIsCancelling] = useState(false);
    const [cancelError, setCancelError] = useState<string | null>(null);

    // เพิ่ม reasonCode และ reasonDetail เข้ามา
    const handleCancelOrder = async (
        orderId: string,
        reasonCode: string,
        reasonDetail: string,
        onSuccess?: () => void
    ) => {
        setIsCancelling(true);
        setCancelError(null);
        try {
            await orderService.cancelOrder(orderId, {
                reasonCode: reasonCode,
                reasonDetail: reasonDetail
            });

            if (onSuccess) onSuccess();
        } catch (err: any) {
            setCancelError(err.response?.data?.message || 'เกิดข้อผิดพลาดในการยกเลิกคำสั่งซื้อ');
        } finally {
            setIsCancelling(false);
            window.location.href = `/orders/${orderId}`;
        }
    };

    return { handleCancelOrder, isCancelling, cancelError };
};