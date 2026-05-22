"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
    Box,
    Typography,
    Button,
    CircularProgress,
    TextField,
    Checkbox,
    FormControlLabel,
    Alert,
} from "@mui/material";
import type { TextFieldProps } from "@mui/material/TextField";
import { useRouter, useSearchParams } from "next/navigation";
import { COLORS } from "@/src/styles";
import { useCreateAddress } from "@/src/feature/address/hooks/useCreateAddress";
import { useGetAddress } from "@/src/feature/address/hooks/useGetAddress";
import { useUpdateAddress } from "@/src/feature/address/hooks/useUpdateAddress";
import type { CreateAddressRequest, UpdateAddressRequest } from "@/src/feature/address/type/address";

type AddressFormState = Required<
    Pick<
        CreateAddressRequest,
        | "firstname"
        | "lastname"
        | "address"
        | "road"
        | "district"
        | "subdistrict"
        | "province"
        | "postcode"
        | "phone"
        | "isDefault"
    >
>;

const emptyForm: AddressFormState = {
    firstname: "",
    lastname: "",
    address: "",
    road: "",
    district: "",
    subdistrict: "",
    province: "",
    postcode: "",
    phone: "",
    isDefault: false,
};

export default function ManageAddressPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const id = searchParams.get("id");
    const isEditMode = Boolean(id);
    const { data, loading: fetching, error: fetchError } = useGetAddress(id);
    const { mutate: createAddress, loading: creating, error: createError } = useCreateAddress();
    const { mutate: updateAddress, loading: updating, error: updateError } = useUpdateAddress();
    const [errors, setErrors] = useState<
        Partial<Record<keyof AddressFormState, string>>
    >({});
    const [form, setForm] = useState<AddressFormState>(emptyForm);

    const submitDisabled = fetching || creating || updating;
    const submitLabel = useMemo(() => {
        if (submitDisabled) return "";
        return isEditMode ? "บันทึก" : "เพิ่มที่อยู่";
    }, [isEditMode, submitDisabled]);

    const apiError = fetchError || createError || updateError;

    const validate = () => {
        const newErrors: Partial<Record<keyof AddressFormState, string>> = {};

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


    useEffect(() => {
        if (!isEditMode) {
            setForm(emptyForm);
            return;
        }
        if (!data) return;

        setForm({
            firstname: data.firstname ?? "",
            lastname: data.lastname ?? "",
            address: data.address ?? "",
            road: data.road ?? "",
            district: data.district ?? "",
            subdistrict: data.subdistrict ?? "",
            province: data.province ?? "",
            postcode: data.postcode ?? "",
            phone: data.phone ?? "",
            isDefault: data.isDefault,
        });
    }, [data, isEditMode]);

    const onChange =
        (field: keyof AddressFormState) =>
            (e: React.ChangeEvent<HTMLInputElement>) => {
                const value =
                    field === "isDefault" ? e.target.checked : e.target.value;

                setForm((prev) => ({
                    ...prev,
                    [field]: value,
                }));

                // เคลียร์ error ของ field นั้น
                setErrors((prev) => ({
                    ...prev,
                    [field]: "",
                }));
            };
    const onSubmit = async () => {
        if (!validate()) return;

        if (isEditMode && id) {
            await updateAddress({ id, ...form } satisfies UpdateAddressRequest);
        } else {
            await createAddress(form satisfies CreateAddressRequest);
        }
    };

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: "800px", mx: "auto", display: "flex", flexDirection: "column", gap: 3 }}>
            <Typography variant="h3" sx={{ color: COLORS.f1, fontWeight: "bold", mb: 1 }}>
                {isEditMode ? "แก้ไขที่อยู่" : "เพิ่มที่อยู่ใหม่"}
            </Typography>

            {apiError ? <Alert severity="error">{apiError}</Alert> : null}

            {fetching ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                    <CircularProgress sx={{ color: COLORS.f1 }} />
                </Box>
            ) : null}

            {/* ส่วนของฟอร์ม - ใช้ Flexbox แทน Grid */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {/* แถวที่ 1: ชื่อ - นามสกุล */}
                <Box sx={{ display: "flex", gap: 2, flexDirection: { xs: "column", sm: "row" } }}>
                    <CustomTextField placeholder="ชื่อ" name="firstname" value={form.firstname} onChange={onChange("firstname")} error={!!errors.firstname} helperText={errors.firstname} disabled={submitDisabled} />
                    <CustomTextField placeholder="นามสกุล" name="lastname" value={form.lastname} onChange={onChange("lastname")} error={!!errors.lastname} helperText={errors.lastname} disabled={submitDisabled} />
                </Box>

                {/* แถวที่ 2: ที่อยู่ยาวๆ */}
                <CustomTextField placeholder="ห้องเลขที่, อาพาร์ทเมนต์(อื่นๆ)" name="address" value={form.address} onChange={onChange("address")} error={!!errors.address} helperText={errors.address} disabled={submitDisabled} />

                {/* แถวที่ 3: ถนน - ตำบล */}
                <Box sx={{ display: "flex", gap: 2, flexDirection: { xs: "column", sm: "row" } }}>
                    <CustomTextField placeholder="ถนน" name="road" value={form.road} onChange={onChange("road")} error={!!errors.road} helperText={errors.road} disabled={submitDisabled} />
                    <CustomTextField placeholder="ตำบล/แขวง" name="subdistrict" value={form.subdistrict} onChange={onChange("subdistrict")} error={!!errors.subdistrict} helperText={errors.subdistrict} disabled={submitDisabled} />
                </Box>

                {/* แถวที่ 4: เขต - จังหวัด */}
                <Box sx={{ display: "flex", gap: 2, flexDirection: { xs: "column", sm: "row" } }}>
                    <CustomTextField placeholder="เขต" name="district" value={form.district} onChange={onChange("district")} error={!!errors.district} helperText={errors.district} disabled={submitDisabled} />
                    <CustomTextField placeholder="จังหวัด" name="province" value={form.province} onChange={onChange("province")} error={!!errors.province} helperText={errors.province} disabled={submitDisabled} />
                </Box>

                {/* แถวที่ 5: รหัสไปรษณีย์ - เบอร์โทร */}
                <Box sx={{ display: "flex", gap: 2, flexDirection: { xs: "column", sm: "row" } }}>
                    <CustomTextField placeholder="รหัสไปรษณีย์" name="postcode" value={form.postcode} onChange={onChange("postcode")} error={!!errors.postcode} helperText={errors.postcode} disabled={submitDisabled} />
                    <CustomTextField placeholder="เบอร์โทรศัพท์" name="phone" value={form.phone} onChange={onChange("phone")} error={!!errors.phone} helperText={errors.phone} disabled={submitDisabled} />
                </Box>

                <FormControlLabel
                    control={
                        <Checkbox
                            checked={form.isDefault}
                            onChange={onChange("isDefault")}
                            disabled={submitDisabled}
                            sx={{
                                color: COLORS.f1,
                                "&.Mui-checked": { color: COLORS.f1 },
                            }}
                        />
                    }
                    label="ตั้งเป็นค่าเริ่มต้น"
                />
            </Box>

            {/* Buttons Layout - Flexbox */}
            <Box sx={{ mt: 2, display: "flex", justifyContent: "center", gap: 2, flexDirection: { xs: "column", sm: "row" } }}>
                <Button
                    onClick={onSubmit}
                    disabled={submitDisabled}
                    sx={{
                        bgcolor: COLORS.f1, color: "#fff",
                        px: 6, py: 1.5, borderRadius: "15px",
                        fontWeight: "bold", fontSize: "1.1rem", flex: { xs: 1, sm: "none" },
                        "&:hover": { bgcolor: "#c5531d" }
                    }}
                >
                    {submitDisabled ? <CircularProgress size={24} color="inherit" /> : submitLabel}
                </Button>
                <Button
                    onClick={() => router.push("/userprofile")}
                    sx={{
                        border: `2px solid ${COLORS.f1}`, color: COLORS.f1,
                        px: 6, py: 1.5, borderRadius: "15px",
                        fontWeight: "bold", fontSize: "1.1rem", flex: { xs: 1, sm: "none" }
                    }}
                >
                    ยกเลิก
                </Button>
            </Box>
        </Box>
    );
}

// Styled TextField
function CustomTextField(props: TextFieldProps) {
    return (
        <TextField
            {...props}
            fullWidth
            variant="outlined"
            size="small"
            autoComplete="off"
            sx={{
                "& .MuiOutlinedInput-root": {
                    borderRadius: "15px",
                    backgroundColor: "#fff",
                    "& fieldset": { borderColor: props.error ? "red" : COLORS.f1 },
                    "&:hover fieldset": { borderColor: COLORS.f1 },
                    "&.Mui-focused fieldset": { borderColor: COLORS.f1 },
                },
                "& .MuiFormHelperText-root": { color: "red", fontWeight: "bold", ml: 1 }
            }}
        />
    );
}