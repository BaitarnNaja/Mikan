import api from "./api";
import type { PaymentPreviewRequest, PaymentPreviewRequestByCart, PaymentPreviewResponse } from "@/src/feature/payment/type/payment";

export const paymentService = {
  previewPayment: async (payload: PaymentPreviewRequest): Promise<PaymentPreviewResponse> => {
    const res = await api.post("/v1/payment/preview", payload, {
            headers: { 'Content-Type': 'application/json' }
        });
        return res.data;
  },
  previewPaymentCart: async (payload: PaymentPreviewRequestByCart): Promise<PaymentPreviewResponse> => {
    const res = await api.post("/v1/payment/preview", payload, {
            headers: { 'Content-Type': 'application/json' }
        });
        return res.data;
  },
};

