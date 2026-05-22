// src/services/orderService.ts
import api from "./api";

export interface CreateOrderPayload {
    shippingAddress: {
        firstname: string;
        lastname: string;
        address: string;
        road: string;
        district: string;
        subdistrict: string;
        province: string;
        postcode: string;
        phone: string;
    };
    items: {
        productOptionId: string;
        quantity: number;
    }[];
}

export const orderService = {
    getOrderDetail: async (orderId: string) => {
        const res = await api.get(`/v1/orders/${orderId}`);
        return res.data;
    },
    cancelOrder: async (orderId: string, data: { reasonCode: string, reasonDetail: string }) => {
        const response = await api.put(`/orders/${orderId}/cancel`, data);
        return response.data;
    },
    submitRating: async (orderId: string, rating: number, comment?: string) => {
        const response = await api.post(`/rating`, {
            orderId: orderId, 
            rating: rating,
            comment: comment || ""
        });
        return response.data;
    },
    postOrder: async (payload: CreateOrderPayload) => {
        const res = await api.post(`/v1/orders`, payload, {
            headers: { 'Content-Type': 'application/json' }
        });
        return res.data;
    }
};