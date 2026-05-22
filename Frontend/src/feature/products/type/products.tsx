// types/product.ts
export interface Price {
  currency: string;
  amount: number;
}

export interface Product {
  id: string;
  productName: string;
  img: string;
  price: Price;
}

export interface ApiResponse {
  metadata: {
    total: number;
    limit: number;
    page: number;
  };
  data: Product[];
}

export interface GetProductRequest {
  limit?: number;
  page?: number;
  minPrice?: number | null;
  maxPrice?: number | null;
  isStock?: boolean | null;
  sortType?: string | null;
  shopType?: string | null;
  type?: string[];
  q?: string; 
}

export interface GetNewProductRequest {
  limit?: number;
  page?: number;
}



export interface ProductOption {
  id: string;
  optionName: string;
  price: string;
  quantity: string;
  image: string;
}

export interface Merchant {
  id: string;
  shopName: string;
  logImg: string;
}

export interface ProductDetail {
  id: string;
  productName: string;
  description: string;
  images: string[];
  price: {
    amount: number;
    currency: string;
  };
  option: ProductOption[];
  merchant: Merchant;
}

// Interface สำหรับข้อมูลสินค้าแต่ละตัว
export interface ProductItem {
  id: string;
  productName: string;
  img: string;
  price: Price;
}

// Interface สำหรับข้อมูล Metadata (การแบ่งหน้า)
export interface Metadata {
  total: number;
  limit: number;
}

// Interface หลัก (Root) สำหรับ Response ชุดนี้ทั้งหมด
export interface ProductListResponse {
  status?:string;
  metadata: Metadata;
  data: ProductItem[];
}