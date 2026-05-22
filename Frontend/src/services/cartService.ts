import api from "./api";
import { AddToCartRequest, GetCartCountResponse } from "../feature/cart/type/cart";
import { GetCartResponse,  PatchCartItemRequest, PatchCartItemResponse, DeleteCartItemsRequest } from "../feature/cart/type/cart";

export const cartService = {
  addToCart: async (payload: AddToCartRequest) => {
    // ส่ง header authorization หรือดึงจาก api interceptor ตามที่คุณตั้งค่าไว้
    const res = await api.post("/v1/cart", payload);
    return res.data;
  },

  getCart: async (): Promise<GetCartResponse> => {
    const res = await api.get("/v1/cart");
    return res.data;
  }, 

  getCartItemCount: async (): Promise<GetCartCountResponse> => {
    const res = await api.get("/v1/cart/count");
    // console.log("Cart count response:", res.data);
    return res.data;
  },

  updateCartItemQuantity: async (
    cartItemId: string,
    payload: PatchCartItemRequest
  ): Promise<PatchCartItemResponse> => {
    const res = await api.patch(`/v1/cart/item/${cartItemId}`, payload);
    return res.data;
  },

  deleteCartItem: async (cartItemId: string): Promise<void> => {
    await api.delete(`/v1/cart/item/${cartItemId}`);
  },

  deleteCartItems: async (payload: DeleteCartItemsRequest): Promise<void> => {
    await api.delete("/v1/cart/items", { data: payload });
  },
};