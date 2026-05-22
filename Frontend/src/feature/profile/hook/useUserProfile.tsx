import { useState, useEffect, useCallback } from 'react';
import { userProfileService } from '@/src/services/userProfileService';
import { Address } from '../../address/type/address';
import { Order, OrderFilterParams } from '../type/userProfile';
import { handleSubmit } from '@/src/utils/handleSubmit';

export const useUserProfile = () => {
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);

    const [loadingAddresses, setLoadingAddresses] = useState(false);
    const [loadingOrders, setLoadingOrders] = useState(false);
    const [errors, setErrors] = useState<{
        startDate?: string;
        endDate?: string;
    }>({});

    const [orderFilters, setOrderFilters] = useState<OrderFilterParams>({
        page: 1,
        limit: 10,
        startDate: null,
        endDate: null,
        orderId: null
    });

    // ========================
    // Addresses
    // ========================
    const fetchAddresses = async () => {
        setLoadingAddresses(true);
        try {
            const res = await userProfileService.getAddresses();
            setAddresses(res.data?.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingAddresses(false);
        }
    };


    const handleDeleteAddress = async (
        id: string,
        openPopup?: (title: string, message: string) => void
    ) => {
        await handleSubmit({
            action: () => userProfileService.deleteAddress(id),
            openPopup, // ⭐️ ส่งต่อให้ handleSubmit
            onSuccess: () => {
                setAddresses(prev => prev.filter(a => a.id !== id));
            },
        });
    };

    // ========================
    // Orders
    // ========================
    const fetchOrders = useCallback(async (customFilters?: OrderFilterParams) => {
        const currentFilters = customFilters || orderFilters;
        const { startDate, endDate } = currentFilters;

        setErrors({});

        if (startDate && endDate && endDate < startDate) {
            setErrors({
                endDate: "วันที่สิ้นสุดต้องมากกว่าหรือเท่ากับวันที่เริ่ม"
            });
            return;
        }

        setLoadingOrders(true);
        try {
            const apiParams = { ...currentFilters };

            if (apiParams.endDate) {
                apiParams.endDate = `${apiParams.endDate}T23:59:59.999Z`;
            }

            const res = await userProfileService.getOrders(apiParams);
            setOrders(res.data?.orderResponses || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingOrders(false);
        }

    }, [orderFilters]);

    const updateFilter = (key: keyof OrderFilterParams, value: any) => {
        setOrderFilters(prev => ({
            ...prev,
            [key]: value,
            page: 1
        }));
    };

    const clearFilters = () => {
        const reset: OrderFilterParams = {
            page: 1,
            limit: 10,
            startDate: null, 
            endDate: null,
            orderId: null
        };
        setOrderFilters(reset);
        fetchOrders(reset);
    };


    useEffect(() => {
        fetchAddresses();
        fetchOrders();
    }, []); 

    useEffect(() => {
        fetchOrders();
    }, [orderFilters, fetchOrders]);

    return {
        addresses,
        orders,
        loadingAddresses,
        loadingOrders,
        handleDeleteAddress,
        orderFilters,
        updateFilter,
        clearFilters,
        fetchOrders,
        errors
    };
};