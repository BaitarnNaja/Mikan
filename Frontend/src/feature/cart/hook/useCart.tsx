import { cartService } from '@/src/services/cartService';
import { useState, useEffect, useMemo } from 'react';

// Type สำหรับ UI ที่ถูกแปลงให้อยู่ในรูปแบบที่แสดงผลง่ายขึ้น
export interface UICartItem {
    cartItemId: string;
    productId: string;
    name: string;
    description: string;
    price: number;
    quantity: number;
    imageUrl: string;
    selected: boolean;
}

export interface UIStoreGroup {
    shopId: string;
    storeName: string;
    items: UICartItem[];
}

export const useCart = () => {
    const [cartData, setCartData] = useState<UIStoreGroup[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [cartCount, setCartCount] = useState(0);

    const fetchCartCount = async () => {
        try {
            const res = await cartService.getCartItemCount();
            setCartCount(res?.data?.count || 0);
        } catch (err) {
            console.error("Error fetching cart count:", err);
        }
    };

    const fetchCartData = async (silent = false) => {
        if (!silent) setIsLoading(true); try {
            const response = await cartService.getCart();

            // แปลงโครงสร้างจาก API (Shop -> Product -> Option) ให้เป็น (Shop -> Item) สำหรับ UI
            const mappedData: UIStoreGroup[] = response.data.shops.map(shop => {
                // console.log("Check shop object:", shop);
                const uiItems: UICartItem[] = [];

                shop.productItems.forEach(product => {
                    console.log("Raw Product Object:", product);
                    product.optionItems.forEach(option => {
                        uiItems.push({
                            cartItemId: option.cartItemId,
                            productId: (product as any).id || '',
                            name: product.productName || 'Unknown Product',
                            description: option.optionName || '',
                            price: option.price?.amount ?? (option as any).amount ?? 0,
                            quantity: option.quantity,
                            imageUrl: option.image || '/item.png',
                            selected: false // Default ยังไม่เลือกตอนโหลดมา
                        });
                    });
                });

                return {
                    shopId: shop.id,
                    storeName: shop.shopName || 'Unknown Store',
                    items: uiItems
                };
            });

            setCartData(mappedData);
        } catch (error) {
            console.error("Failed to fetch cart:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const deleteSingleItem = async (cartItemId: string) => {
        try {
            // ยิง API สำหรับลบชิ้นเดียว
            await cartService.deleteCartItem(cartItemId);
            await fetchCartData(true); // fetch แบบเงียบๆ หลังลบเสร็จ
        } catch (error) {
            console.error("Delete failed:", error);
        }finally {            fetchCartCount(); 
        }
    };

    useEffect(() => {
        fetchCartData();
    }, []);

    // --- Actions ---

    const handleSelectAll = (checked: boolean) => {
        setCartData((prevData) =>
            prevData.map((store) => ({
                ...store,
                items: store.items.map((item) => ({ ...item, selected: checked })),
            }))
        );
    };

    const handleToggleStore = (shopId: string, isChecked: boolean) => {
        setCartData((prevData) =>
            prevData.map((store) => {
                if (store.shopId === shopId) {
                    return {
                        ...store,
                        items: store.items.map((item) => ({ ...item, selected: isChecked })),
                    };
                }
                return store;
            })
        );
    };

    const handleToggleItem = (shopId: string, cartItemId: string) => {
        setCartData((prevData) =>
            prevData.map((store) => {
                if (store.shopId === shopId) {
                    return {
                        ...store,
                        items: store.items.map((item) =>
                            item.cartItemId === cartItemId ? { ...item, selected: !item.selected } : item
                        ),
                    };
                }
                return store;
            })
        );
    };

    const handleUpdateQuantity = async (cartItemId: string, currentQuantity: number, amount: number) => {
        const newQuantity = currentQuantity + amount;
        if (newQuantity < 1) return;

        // อัปเดต UI ทันที (Optimistic update) ให้ดูรวดเร็ว
        setCartData(prev => prev.map(store => ({
            ...store,
            items: store.items.map(item =>
                item.cartItemId === cartItemId ? { ...item, quantity: newQuantity } : item
            )
        })));

        // ยิง API
        try {
            await cartService.updateCartItemQuantity(cartItemId, { quantity: newQuantity });
            await fetchCartData(true);
        } catch (error) {
            console.error("Failed to update quantity:", error);
            fetchCartData(true); // ถ้าอัปเดตไม่สำเร็จ ให้ดึงข้อมูลเก่ากลับมาใหม่
        } finally {
            fetchCartData(); // ดึงข้อมูลใหม่หลังจากอัปเดตสำเร็จหรือไม่สำเร็จ เพื่อให้แน่ใจว่า UI ตรงกับข้อมูลจริง
        }
    };

    const handleDeleteSelected = async () => {
        const selectedIds = cartData
            .flatMap(store => store.items)
            .filter(item => item.selected)
            .map(item => item.cartItemId);

        if (selectedIds.length === 0) return;

        try {
            await cartService.deleteCartItems({ cartItemId: selectedIds });
            await fetchCartData(); 
        } catch (error) {
            console.error("Failed to delete items:", error);
        }finally {
            fetchCartCount(); 
        }
    };

    const totalPrice = useMemo(() => {
        return cartData.reduce((total, store) => {
            const storeSum = store.items
                .filter(item => item.selected)
                .reduce((sum, item) => sum + (item.price * item.quantity), 0);
            return total + storeSum;
        }, 0);
    }, [cartData]);

    // จำนวนสินค้าที่ถูกเลือก (เช็คว่ามีเลือกไว้ไหม)
    const hasSelectedItems = useMemo(() => {
        return cartData.some(store => store.items.some(item => item.selected));
    }, [cartData]);

    return {
        cartData,
        isLoading,
        totalPrice,
        hasSelectedItems,
        handleSelectAll,
        handleToggleStore,
        handleToggleItem,
        handleUpdateQuantity,
        handleDeleteSelected,
        deleteSingleItem,
        cartCount,
        fetchCartCount,
    };
};