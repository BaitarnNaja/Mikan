// src/services/shopService.ts
import api from "./api";

export interface GetShopProductsRequest {
  categoryId?: string;
  page: number;
  limit: number;
}

export const shopService = {
  getShopById: async (shopId: string) => {
    const res = await api.get(`/v1/shop/${shopId}`);
    return res.data;
  },

  getShopProducts: async (shopId: string, payload: GetShopProductsRequest) => {
    const res = await api.get(`/v1/shop/products/${shopId}`, { params: payload });
    return res.data;
  }
};