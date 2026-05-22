export type CreateAddressRequest = {
  firstname?: string;
  lastname?: string;
  address?: string;
  road?: string;
  district?: string;
  subdistrict?: string;
  province?: string;
  postcode?: string;
  phone?: string;
  isDefault?: boolean;
};

export type AddressDetailResponse = {
  id: string;
  firstname?: string;
  lastname?: string;
  address?: string;
  road?: string;
  district?: string;
  subdistrict?: string;
  province?: string;
  postcode?: string;
  phone?: string;
  isDefault: boolean;
};

export type GetAddressResponse = {
  code: string;
  message: string;
  data: {
    data: AddressDetailResponse;
  };
};

export type UpdateAddressRequest = {
  id?: string;
  firstname?: string;
  lastname?: string;
  address?: string;
  road?: string;
  district?: string;
  subdistrict?: string;
  province?: string;
  postcode?: string;
  phone?: string;
  isDefault?: boolean;
};


export interface Address {
    id: string;
    firstname: string;
    lastname: string;
    address: string;
    road: string;
    district: string;
    subdistrict: string;
    province: string;
    postcode: string;
    phone: string;
    isDefault: boolean;
}

export interface AddressResponse {
    code:string;
    message: string;
    data: {
        data: Address[];
    };
}

export interface AddressPayload {
  id?: string; 
  firstname: string;
  lastname: string;
  address: string;
  road: string;
  subdistrict: string;
  district: string;
  province: string;
  postcode: string;
  phone: string;
}
