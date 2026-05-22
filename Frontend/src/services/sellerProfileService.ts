// src/services/sellerProductService.ts
import api from "./api";
import { ManageProductPayload } from "../feature/profile/type/sellerProfile";

export const sellerProductService = {
    // 1. ฟังก์ชันอัปโหลดเพื่อเอา "ชื่อไฟล์" หรือข้อมูลจาก Server มาก่อน (อ้างอิง image_549bff.png)
    uploadImage: async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append('file', file);

        const res = await api.post("/v1/uploads/image", formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });

        // สมมติว่า Backend คืนค่าชื่อไฟล์มาใน res.data.data.url เช่น "product-01.png"
        // คุณเป็นคนสร้าง Path เองที่นี่เลย
        const fileName = res.data.data.url.split('/').pop(); 
        console.log(fileName)
        return `./uploads/images/${fileName}`;
    },

    // 2. ฟังก์ชันบันทึกข้อมูลสินค้า (อ้างอิง image_5494d6.png)
    manageProduct: async (payload: ManageProductPayload): Promise<any> => {
        console.log("Payload: ",payload)
        return await api.post("/v1/manage-product", payload);
    }
}