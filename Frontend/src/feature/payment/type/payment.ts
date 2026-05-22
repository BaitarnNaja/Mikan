

import { Money } from "../../cart/type/cart";

export type PaymentItem = {
  productOptionId: string;
  quantity: number; 
};

export type PaymentPreviewRequestByCart = {
  selectedCartItemIds: string[];
}

export type PaymentPreviewRequest = {
  items: PaymentItem[];
};

export type PaymentPreviewShopSummary = {
  subtotal: Money;
  shippingFee: Money;
};

export type PaymentPreviewProductItem = {
  productName?: string;
  optionName?: string;
  image?: string;
  price?: Money;
  quantity: number;
};

export type PaymentPreviewShop = {
  shopName?: string;
  productItems: PaymentPreviewProductItem[];
  shopSummary: PaymentPreviewShopSummary;
};


export type PaymentPreviewResponse = {
  code: string;
  message: string;
  data: {
    currency: string;
    shops: PaymentPreviewShop[];
    summary: {
      subtotal: Money;
      shippingFee: Money;
      total: Money;
    };
  };
};
