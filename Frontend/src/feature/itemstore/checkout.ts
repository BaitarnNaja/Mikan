import { create } from 'zustand';

interface CheckoutStore {
    previewData: any;
    setPreviewData: (data: any) => void;
    orderResultData: any;
    setOrderResultData: (data: any) => void;
}

export const useCheckoutStore = create<CheckoutStore>((set) => ({
    previewData: null,
    setPreviewData: (data) => set({ previewData: data }),
    orderResultData: null,
    setOrderResultData: (data) => set({ orderResultData: data }),
}));