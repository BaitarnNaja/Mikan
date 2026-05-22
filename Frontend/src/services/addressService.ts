import api from "./api";
import type {
  AddressDetailResponse,
  AddressResponse,
  CreateAddressRequest,
  GetAddressResponse,
  UpdateAddressRequest,
} from "@/src/feature/address/type/address";

export const addressService = {
  createAddress: async (data: CreateAddressRequest): Promise<AddressResponse> => {
    const res = await api.post("/v1/address", data);
    return res.data;
  },

  getAddressById: async (addressId: string): Promise<GetAddressResponse> => {
    const res = await api.get(`/v1/address/${addressId}`);
    return res.data;
  },

  updateAddress: async (data: UpdateAddressRequest): Promise<AddressResponse> => {
    const res = await api.put("/v1/address", data);
    return res.data;
  },
};
