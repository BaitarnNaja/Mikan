// src/app/(main)/products/[...slug]/page.tsx
"use client";
import { useParams, useRouter, usePathname, useSearchParams } from "next/navigation";
import { Box, Button, Pagination, Typography } from "@mui/material";
import ProductFilter from "@/src/feature/products/componant/ProductFilter";
import { useEffect, useState, useMemo } from "react";
import DynamicBreadcrumbs, { BreadcrumbItem } from "@/src/feature/products/componant/DynamicBreadcrumbs";
import { PRODUCT_CATEGORIES } from "@/src/constants/products";
import { COLORS } from "@/src/styles";
import ProductSort from "@/src/feature/products/componant/ProductSort";
import { useProductSearch } from "@/src/feature/products/hook/useProductSearch";
import { GetProductRequest } from "@/src/feature/products/type/products";
import ProductCard from "@/src/feature/products/componant/ProductCart";
import FilterAltIcon from '@mui/icons-material/FilterAlt';

export default function HomeContent() {
  const params = useParams();
  const slug = (params?.slug as string[]) || [];

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const breadcrumbData: BreadcrumbItem[] = [
    { label: 'หน้าแรก', path: '/' },
  ];

  const { search, products, total } = useProductSearch();
  const [showFilter, setShowFilter] = useState(false);
  const isAll = slug.length === 1 && slug[0] === 'all';
  const getApiTypeFromSlug = useMemo(() => {
    // 1.1 ถ้ามี query param 'type[]' (มาจากการกด Filter) ให้ใช้ค่าจาก Filter เป็นหลัก
    const urlType = searchParams.getAll('type[]');
    if (urlType.length > 0) return urlType;

    // 1.2 ถ้าเป็น /all หรือไม่มี slug ไม่ต้องส่ง type
    if (isAll || slug.length === 0) return undefined;

    const parentPath = slug[0]; // เช่น 'merch'
    const childPath = slug[1];  // เช่น 'acrylic_stand'

    // 1.3 ค้นหาหมวดหมู่หลัก
    const parentCategory = PRODUCT_CATEGORIES.find(cat => cat.path === parentPath);

    if (parentCategory) {
      // 1.4 ถ้ามีหมวดหมู่ย่อย (เช่น /merch/acrylic_stand)
      if (childPath) {
        const childItem = parentCategory.items.find(item => item.path === childPath);
        if (childItem && childItem.type) {
          return [childItem.type]; // ส่ง ['Acrylic Stand']
        }
      }

      // 🔥 1.5 ถ้ากดหมวดหมู่หลัก และหมวดหมู่นั้นมี items ย่อย
      if (parentCategory.items && parentCategory.items.length > 0) {
        // กวาดเอา type ของ items ทั้งหมดมาใส่ Array และกรองค่าที่เป็น string ว่าง หรือ undefined ออก
        const subTypes = parentCategory.items
          .map(item => item.type)
          .filter(Boolean);

        if (subTypes.length > 0) {
          return subTypes; // จะได้ผลลัพธ์เป็น ['Acrylic Stand', 'Keychain', 'Sticker', 'Photocard']
        }
      }

      // 1.6 ถ้ากดหมวดหมู่หลักที่ไม่มี items ย่อย ค่อยตกมาใช้ type ของตัวมันเอง
      if (parentCategory.type) {
        return [parentCategory.type];
      }
    }

    // fallback กรณีหาไม่เจอใน Constants
    return undefined;
  }, [searchParams, slug, isAll]);

  // 1. อ่านค่าให้ตรงกับ Type (shopType เป็นแค่ string)
  const currentParams = useMemo<GetProductRequest>(() => {
    const urlShopType = searchParams.get('shopType') || searchParams.get('shopType[]');

    return {
      limit: Number(searchParams.get('limit')) || 12,
      page: Number(searchParams.get('page')) || 1,
      minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : null,
      maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : null,
      isStock:
        searchParams.get('isStock') === 'true'
          ? true
          : searchParams.get('isStock') === 'false'
            ? false
            : null,
      sortType: searchParams.get('sortType') || null,
      shopType: urlShopType || null,

      // 🔥 ใช้ค่าที่ถูกแปลงแล้ว
      type: getApiTypeFromSlug,
    };
  }, [searchParams, getApiTypeFromSlug]);

  useEffect(() => {
    if (search) {
      search(currentParams);
    }
  }, [currentParams]);

  const updateURL = (newData: Partial<GetProductRequest>) => {
    const newParams = { ...currentParams, ...newData };
    const urlParams = new URLSearchParams();

    if (newParams.limit) urlParams.set('limit', newParams.limit.toString());
    if (newParams.page) urlParams.set('page', newParams.page.toString());
    if (newParams.minPrice !== null && newParams.minPrice !== undefined) urlParams.set('minPrice', newParams.minPrice.toString());
    if (newParams.maxPrice !== null && newParams.maxPrice !== undefined) urlParams.set('maxPrice', newParams.maxPrice.toString());

    // 2. เช็คว่าไม่เป็น null และ undefined ก่อนแปลงเป็น string
    if (newParams.isStock !== null && newParams.isStock !== undefined) {
      urlParams.set('isStock', newParams.isStock.toString());
    }

    if (newParams.sortType) urlParams.set('sortType', newParams.sortType);

    // 3. shopType เป็น string เลยใส่ได้เลย ไม่ต้องวนลูป forEach
    if (newParams.shopType) {
      // ใช้ 'shopType[]' หรือ 'shopType' ขึ้นอยู่กับว่า Backend คุณรอรับแบบไหน
      // แต่เอาแบบชัวร์ๆ ตาม query string ก่อนหน้าของคุณคือมี []
      urlParams.set('shopType[]', newParams.shopType);
    }

    if (newParams.type && newParams.type.length > 0) {
      newParams.type.forEach(val => urlParams.append('type[]', val));
    }

    router.replace(`${pathname}?${urlParams.toString()}`, { scroll: false });
  };

  if (slug.length > 0) {
    const category = PRODUCT_CATEGORIES.find(cat => cat.path === slug[0]);
    const categoryLabel = category ? category.title : decodeURIComponent(slug[0]);

    if (slug.length === 1) {
      breadcrumbData.push({ label: categoryLabel });
    } else if (slug.length === 2) {
      breadcrumbData.push({ label: categoryLabel, path: `/products/${slug[0]}` });
      const subItem = category?.items.find(item => item.path === slug[1]);
      const subLabel = subItem ? subItem.name : decodeURIComponent(slug[1]);
      breadcrumbData.push({ label: subLabel });
    }
  }

  return (
    <Box sx={{ minHeight: '100dvh' }}>
      <DynamicBreadcrumbs items={breadcrumbData} />
      <Box sx={{ display: "flex" }}>

        <Box sx={{
          display: {
            xs: showFilter ? 'block' : 'none',
            sm: 'block'
          },
        }}>
          <ProductFilter
            currentSort={currentParams.sortType}
            onClose={() => setShowFilter(false)}
            onApply={(data) => {
              let expandedTypes: string[] = [];

              if (data.type && data.type.length > 0) {
                data.type.forEach((selectedType) => {
                  const parentCategory = PRODUCT_CATEGORIES.find(
                    (cat) =>
                      cat.type === selectedType ||
                      cat.path === selectedType ||
                      (cat.type && cat.type.toLowerCase() === selectedType.toLowerCase())
                  );

                  if (parentCategory && parentCategory.items && parentCategory.items.length > 0) {
                    // ถ้าเจอหมวดหมู่ใหญ่ ให้ดึงลูกมาใส่
                    const subItemTypes = parentCategory.items
                      .map((item) => item.type)
                      .filter((t): t is string => !!t);

                    expandedTypes = [...expandedTypes, ...subItemTypes];
                  } else {
                    // ถ้าไม่ใช่หมวดหมู่ใหญ่ ค่อยใส่ตัวมันเอง
                    expandedTypes.push(selectedType);
                  }
                });
              }

              const finalTypes = Array.from(new Set(expandedTypes));

              updateURL({
                type: finalTypes.length > 0 ? finalTypes : undefined,
                minPrice: data.minPrice,
                maxPrice: data.maxPrice,
                isStock: data.isStock,
                shopType: data.shopType,
                sortType: data.sortType !== undefined ? data.sortType : currentParams.sortType,
                page: 1
              });
            }}
          />
        </Box>

        <Box sx={{ py: { xs: 0, sm: 4 }, px: 4, flex: 1, minWidth: 0 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 2,
              mb: { xs: 0, sm: 3 }
            }}
          >
            <Typography variant="h3" sx={{ color: COLORS.f1, fontWeight: 'bold' }}>
              สินค้าทั้งหมด
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                <ProductSort
                  value={currentParams.sortType}
                  onSortChange={(value) => {
                    updateURL({ sortType: value, page: 1 });
                  }}
                />
              </Box>
              <Typography variant="body1" sx={{ color: COLORS.f1, display: { xs: 'none', sm: 'block' } }}>
                จำนวนสินค้าทั้งหมด: {total || 0}
              </Typography>
              <Button
                onClick={() => setShowFilter(true)}
                sx={{ display: { xs: 'block', sm: 'none' }, m: 2 }}
              >
                <FilterAltIcon sx={{ color: COLORS.brandPrimary }} />
              </Button>
            </Box>
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(2, minmax(0, 1fr))',
                sm: 'repeat(3, minmax(0, 1fr))',
                md: 'repeat(4, minmax(0, 1fr))',
              },
              gap: { xs: 2, md: 3 },
              width: '100%',
            }}
          >
            {products.map((product) => (
              <Box
                key={product.id}
                sx={{
                  width: '100%', minWidth: 0, cursor: 'pointer',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'scale(1.02)' }
                }}
                onClick={() => router.push(`/product/${product.id}`)}
              >
                <ProductCard product={product} />
              </Box>
            ))}
          </Box>
          {total > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6, mb: 4 }}>
              <Pagination
                count={Math.ceil(total / (currentParams.limit || 12)) || 1}
                page={currentParams.page || 1}
                onChange={(event, value) => {
                  updateURL({ page: value });
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                showFirstButton
                showLastButton
                sx={{
                  '& .MuiPaginationItem-root': {
                    fontSize: '1rem',
                  },
                  '& .MuiPaginationItem-root.Mui-selected': {
                    bgcolor: '#E67E22',
                    color: 'white',
                    '&:hover': {
                      bgcolor: '#D35400',
                    }
                  }
                }}
              />
            </Box>
          )}
        </Box>

      </Box>
    </Box>
  );
}