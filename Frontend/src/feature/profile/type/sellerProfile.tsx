// src/types/product.ts

export interface ProductOption {
    code: string;
    optionName: string;
    quantity: number;
    price: number;
    img: string; // เก็บ Path เช่น "./uploads/images/option-1.png"
}

export interface ManageProductPayload {
    name: string;
    categoryId: string;
    type: string;
    productDsc: string;
    imgs: string[]; // เก็บ List ของ Path เช่น ["./uploads/images/main.png"]
    options: ProductOption[];
}