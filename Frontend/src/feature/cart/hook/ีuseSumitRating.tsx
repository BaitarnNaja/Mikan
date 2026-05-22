// src/feature/cart/hook/useSubmitRating.ts
import { useState } from "react";
import { orderService } from "@/src/services/orderService";

export const useSubmitRating = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmitRating = async (
        orderId: string, 
        rating: number, 
        onSuccess?: () => void
    ) => {
        setIsSubmitting(true);
        try {
            await orderService.submitRating(orderId, rating);
            if (onSuccess) onSuccess();
        } catch (err) {
            console.error("Rating error:", err);
            alert("ไม่สามารถส่งคะแนนได้");
        } finally {
            setIsSubmitting(false);
        }
    };

    return { handleSubmitRating, isSubmitting };
};