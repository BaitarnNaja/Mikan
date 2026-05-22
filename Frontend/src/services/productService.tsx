// src/services/productService.ts
import { GetNewProductRequest, GetProductRequest } from "../feature/products/type/products";
import api from "./api";

export const productService = {
  searchProducts: async (payload: GetProductRequest) => {
    const res = await api.get("/v1/products", { params: payload });
    return res.data;
  },
  
  searchNewProducts: async (payload: GetNewProductRequest) => {
    const res = await api.get("/v1/products/new", { params: payload });
    return res.data;
  },

  searchProductsByKeyword: async (payload: GetProductRequest) => {
    const res = await api.get("/v1/products/search", { params: payload });

    console.log("response from searchProductsByKeyword:", res.data);

    return res.data;
  },

  getProductById: async (productId: string) => {
    const res = await api.get(`/v1/products/product/${productId}`);
    console.log("response: ",res.data)
    return res.data;
  },

  getRecommendations: async () => {
    // ดึง token จาก Storage ที่คุณเก็บไว้ (เช่น localStorage หรือ Cookie)
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';

    const res = await api.get('/v1/products/recommendation', {
      headers: {
        Authorization: `Bearer ${token}` // ส่งแค่ Header เพียวๆ
      }
    });

    return res.data;
  }
};