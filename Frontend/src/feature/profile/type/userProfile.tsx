// src/types/userProfile.ts
export interface Address {  
    id: string;
    firstname: string;
    lastname: string;
    address: string;
    road: string;
    subdistrict: string;    
    district: string;
    province: string;
    postcode: string;
    phone: string;
    isDefault: boolean;
}

export interface GetAddressesResponse {
    code: string;
    message: string;
    data: 
    {data: Address[]};
}

export interface OrderItem {
    productId: string;
    productName: string;
    productOptionId: string;
    optionName: string;
    img: string;
    quantity: string;
    price: string;
}

// 1. เปลี่ยน Order ให้เก็บแค่ข้อมูลของ 1 ออเดอร์จริงๆ
export interface Order {
    id: string;
    shopId: string;
    shopName: string;
    createAt: string;
    status: string;
    orderItems: OrderItem[];
    totalAmount: string;
}

// 2. ปรับ Response ให้ตรงกับ JSON ที่ API ส่งมา
export interface GetOrdersResponse {
    code: string;
    message: string;
    data: {
        metadata: {
            page: number;
            limit: number;
            total: number;
        };
        orderResponses: Order[];
    };
}

export interface OrderFilterParams {
    startDate?: string;
    endDate?: string;
    orderId?: string;
    page?: number;
    limit?: number;
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
