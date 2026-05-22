"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLoading } from "@/src/components/LoadingContext";
import { handleSubmit } from "@/src/utils/handleSubmit";
import { addressService } from "@/src/services/addressService";
import type { AddressResponse, UpdateAddressRequest } from "@/src/feature/address/type/address";

export const useUpdateAddress = () => {
const router = useRouter();
const { showLoading, hideLoading } = useLoading();

const [loading, setLoading] = useState(false);
const [error, setError] = useState("");

const mutate = async (data: UpdateAddressRequest) => {
return handleSubmit<AddressResponse>({
action: () => addressService.updateAddress(data),
setSubmitting: (s) => {
setLoading(s);
s ? showLoading() : hideLoading();
},
onSuccess: () => router.push("/userprofile"),
onError: () => setError("แก้ไขที่อยู่ไม่สำเร็จ"),
});
};

return { mutate, loading, error };
};
