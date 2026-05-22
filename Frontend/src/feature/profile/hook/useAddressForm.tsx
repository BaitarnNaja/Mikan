import { useState } from "react";
import { userProfileService } from "@/src/services/userProfileService";
import { handleSubmit } from "@/src/utils/handleSubmit";
import { useLoading } from "@/src/components/LoadingContext";
import { useRouter } from "next/navigation";
import { AddressPayload } from "../../address/type/address";



export const useAddressForm = (initialData?: any, addressId?: string | null) => {
    const router = useRouter();
    const { showLoading, hideLoading } = useLoading();

    const [form, setForm] = useState<AddressPayload>({
        firstname: initialData?.firstname || "",
        lastname: initialData?.lastname || "",
        address: initialData?.address || "",
        road: initialData?.road || "",
        subdistrict: initialData?.subdistrict || "",
        district: initialData?.district || "",
        province: initialData?.province || "",
        postcode: initialData?.postcode || "",
        phone: initialData?.phone || ""
    });

    const [errors, setErrors] = useState<Partial<AddressPayload>>({});
    const [submitting, setSubmitting] = useState(false);

    // =========================
    // 🔥 handle change
    // =========================
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setForm((prev) => ({ ...prev, [name]: value }));

        // ล้าง error field นั้นทันที
        if (errors[name as keyof AddressPayload]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    // =========================
    // 🔥 validation
    // =========================
    const validate = () => {
        const newErrors: Partial<AddressPayload> = {};

        if (!form.firstname.trim()) newErrors.firstname = "*กรุณากรอกชื่อ";
        else if (form.firstname.length > 50) newErrors.firstname = "ชื่อยาวเกินไป";

        if (!form.lastname.trim()) newErrors.lastname = "*กรุณากรอกนามสกุล";
        else if (form.lastname.length > 50) newErrors.lastname = "นามสกุลยาวเกินไป";

        if (!form.address.trim()) newErrors.address = "*กรุณากรอกที่อยู่";

        if (!form.subdistrict.trim()) newErrors.subdistrict = "*กรุณากรอกตำบล/แขวง";

        if (!form.district.trim()) newErrors.district = "*กรุณากรอกเขต";

        if (!form.province.trim()) newErrors.province = "*กรุณากรอกจังหวัด";

        if (!form.postcode.trim()) {
            newErrors.postcode = "*กรุณากรอกรหัสไปรษณีย์";
        } else if (!/^\d{5}$/.test(form.postcode)) {
            newErrors.postcode = "รหัสไปรษณีย์ต้องเป็นตัวเลข 5 หลัก";
        }

        if (!form.phone.trim()) {
            newErrors.phone = "*กรุณากรอกเบอร์โทรศัพท์";
        } else if (!/^0\d{9}$/.test(form.phone)) {
            newErrors.phone = "เบอร์โทรไม่ถูกต้อง (10 หลัก)";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // =========================
    // 🔥 submit
    // =========================
    const handleSave = async () => {
        if (!validate()) return;
        const payload = {
            ...form,
            id: addressId || undefined 
        };
        await handleSubmit({
            action: () =>
                addressId
                    ? userProfileService.updateAddress(payload)
                    : userProfileService.createAddress(form),

            setSubmitting: (isSubmitting) => {
                setSubmitting(isSubmitting);
                if (isSubmitting) showLoading();
                else hideLoading();
            },

            onSuccess: () => {
                router.push("/userprofile");
            },

            onError: (err: any) => {
                console.error(err);
            },

            successMessage: addressId ? "แก้ไขที่อยู่สำเร็จ" : "เพิ่มที่อยู่สำเร็จ",
            failMessage: "บันทึกไม่สำเร็จ"
        });
    };

    return {
        form,
        errors,
        submitting,
        handleChange,
        handleSave
    };
};