"use client";

import { useEffect, useState } from "react";
import { addressService } from "@/src/services/addressService";
import type { AddressDetailResponse } from "@/src/feature/address/type/address";

export const useGetAddress = (addressId: string | null) => {
  const [data, setData] = useState<AddressDetailResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      if (!addressId) {
        setData(null);
        setError("");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");
        const res = await addressService.getAddressById(addressId);
        if (!cancelled) setData(res.data?.data);
      } catch (err: unknown) {
        const message =
          err && typeof err === "object" && "message" in err
            ? String((err as { message?: unknown }).message ?? "")
            : "ไม่สามารถดึงข้อมูลที่อยู่ได้";
        if (!cancelled) setError(message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [addressId]);

  return { data, loading, error };
};

