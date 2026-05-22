export interface AddToCartRequest {
    productId: string;
    productOptionId: string;
    quantity: number;
}

export interface OrderDetail {
  id: string;
  status: string;
  created_at: string;
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
  merchant: {
    id: string;
    shop_name: string;
  };
  items: OrderItem[];
  summary: {
    subtotal: number;
    shipping_fee: number;
    total: number;
  };
  tracking: {
    carrier: string | null;
    tracking_number: string | null;
  };
}

export interface OrderItem {
  product_id: string;
  product_name: string;
  option_name: string;
  image: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export type Money = {
  amount: number;
  currency: string;
};

export type CartOptionItem = {
  cartItemId: string;
  productOptionId?: string;
  optionName?: string;
  image?: string;
  price?: Money;
  quantity: number;
};

export type CartProductItem = {
  productId?: string;
  productName?: string;
  optionItems: CartOptionItem[];
};

export type CartShop = {
  id: string;
  shopId?: string;
  shopName?: string;
  productItems: CartProductItem[];
};

export type GetCartResponse = {
  code: string;
  message: string;
  data: {
    shops: CartShop[];
    count: number;
  };
};

export type GetCartCountResponse = {
  code: string;
  message: string;
  data: {
    count: number;
  };
};

export type GetCartCountRespons = {
  code: string;
  message: string;
  data: {
    count: number;
  };
};

export type PatchCartItemRequest = {
  quantity: number;
};

export type PatchCartItemResponse = {
  data: {
    cartItemId: string;
    quantity: number;
    deleted: boolean;
  };
};

export type DeleteCartItemsRequest = {
  cartItemId: string[];
};

export interface ShippingAddress {
    firstname: string;
    lastname: string;
    address: string;
    road: string;
    district: string;
    subdistrict: string;
    province: string;
    postcode: string;
    phone: string;
}

export interface OrderItemPayload {
    productOptionId: string;
    quantity: number;
}

export interface CreateOrderPayload {
    shippingAddress: ShippingAddress;
    items: OrderItemPayload[];
}