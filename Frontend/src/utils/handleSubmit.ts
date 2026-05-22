// utils/handleSubmit.ts
export async function handleSubmit<T>({
  action,
  setSubmitting,
  onSuccess,
  onError,
  openPopup,
  successMessage = "ดำเนินการสำเร็จ",
  failMessage = "ไม่สามารถดำเนินการได้",
}: {
  action: () => Promise<T>;
  setSubmitting?: (v: boolean) => void;
  onSuccess?: (res: T) => void;
  onError?: (error: any) => void;
  openPopup?: (title: string, message: string) => void;
  successMessage?: string;
  failMessage?: string;
}) {
  try {
    setSubmitting?.(true);

    const res = await action();
    console.log("Action Result:", res);

    openPopup?.("Success", successMessage);
    onSuccess?.(res);

    return res;
  } catch (error: any) {
    console.error(error);

    const apiMessage =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      failMessage;
    openPopup?.("Warning", apiMessage);
    onError?.(error);

    throw error;
  } finally {
    setSubmitting?.(false);
  }
}
