"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLoading } from "@/src/components/LoadingContext";
import { handleSubmit } from "@/src/utils/handleSubmit";
import { addressService } from "@/src/services/addressService";
import type { AddressResponse, CreateAddressRequest } from "@/src/feature/address/type/address";

export const useCreateAddress = () => {
  const router = useRouter();
  const { showLoading, hideLoading } = useLoading();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const mutate = async (data: CreateAddressRequest) => {
    
    setError("");

    return handleSubmit<AddressResponse>({
      action: () => addressService.createAddress(data),
      setSubmitting: (isSubmitting) => {
        setLoading(isSubmitting);
        if (isSubmitting) showLoading();
        else hideLoading();
      },
      onSuccess: () => {
        router.push("/userprofile");
      },
      onError: (err: unknown) => {
        const message =
          err && typeof err === "object" && "message" in err
            ? String((err as { message?: unknown }).message ?? "")
            : "ไม่สามารถเพิ่มที่อยู่ได้ กรุณาลองใหม่อีกครั้ง";
        setError(message);
      },
      successMessage: "เพิ่มที่อยู่สำเร็จ",
      failMessage: "ไม่สามารถเพิ่มที่อยู่ได้",
    });
  };

  return { mutate, loading, error };
};

