// src/services/userProfileService.ts
import api from "./api";
import { Address, GetAddressesResponse, GetOrdersResponse } from "../feature/profile/type/userProfile";
import { AddressPayload } from "../feature/address/type/address";
export const userProfileService = {
  // 1. ดึงข้อมูลที่อยู่
  getAddresses: async (): Promise<GetAddressesResponse> => {
    const res = await api.get("/v1/address/get-user-address-list");
    return res.data;
  },

  // 2. ลบที่อยู่
  deleteAddress: async (address_id: string): Promise<void> => {
    console.log(`Path: api/v1/address/${address_id}`)
    await api.delete(`/v1/address/${address_id}`, {
        data: {
            addressId: address_id
        }
    });
  },

  // 3. ดึงคำสั่งซื้อ
  getOrders: async (params: any): Promise<GetOrdersResponse> => {
    const res = await api.get("/v1/orders", { params });
    return res.data;
  },

  createAddress: async (payload: AddressPayload) => {
    const res = await api.post("/v1/address", payload);
    return res.data;
  },

  updateAddress: async (payload: AddressPayload) => {
    const res = await api.put(`/v1/address`, payload);
    return res.data;
  },
};