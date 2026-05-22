// src/app/(main)/search/[...slug]/page.tsx
"use client";
import { useParams, useRouter, usePathname, useSearchParams } from "next/navigation";
import { Box, Button, Pagination, Typography } from "@mui/material";
import ProductFilter from "@/src/feature/products/componant/ProductFilter";
import { useEffect, useState, useMemo } from "react";
import { COLORS } from "@/src/styles";
import ProductSort from "@/src/feature/products/componant/ProductSort";
import { useProductSearch } from "@/src/feature/products/hook/useProductSearch";
import { GetProductRequest } from "@/src/feature/products/type/products";
import ProductCard from "@/src/feature/products/componant/ProductCart";
import FilterAltIcon from '@mui/icons-material/FilterAlt';

export default function SearchResultContent() {
  const params = useParams();
  const slug = (params?.slug as string[]) || [];
  
  // ⭐️ แกะค่า q (คำค้นหา) ออกมาจาก slug ตัวแรก
  const q = slug.length > 0 ? decodeURIComponent(slug[0]) : "";

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // ⭐️ เรียกใช้ searchByKeyword แทน search ปกติ
  const { searchByKeyword, products, total } = useProductSearch();
  const [showFilter, setShowFilter] = useState(false);

  const currentParams = useMemo<GetProductRequest>(() => {
    const urlType = searchParams.getAll('type[]');
    const urlShopType = searchParams.get('shopType') || searchParams.get('shopType[]');

    return {
      limit: Number(searchParams.get('limit')) || 12,
      page: Number(searchParams.get('page')) || 1,
      minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : null,
      maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : null,
      isStock: searchParams.get('isStock') === 'true' ? true : searchParams.get('isStock') === 'false' ? false : null,
      sortType: searchParams.get('sortType') || null,
      shopType: urlShopType || null,
      type: urlType.length > 0 ? urlType : [], 
      q: q, 
    };
  }, [searchParams, q]);

  useEffect(() => {
    // ⭐️ ใช้ searchByKeyword แทนของเดิม
    if (searchByKeyword) {
      searchByKeyword(currentParams);
    }
  }, [currentParams]);

  const updateURL = (newData: Partial<GetProductRequest>) => {
    const newParams = { ...currentParams, ...newData };
    const urlParams = new URLSearchParams();

    if (newParams.limit) urlParams.set('limit', newParams.limit.toString());
    if (newParams.page) urlParams.set('page', newParams.page.toString());
    if (newParams.minPrice !== null && newParams.minPrice !== undefined) urlParams.set('minPrice', newParams.minPrice.toString());
    if (newParams.maxPrice !== null && newParams.maxPrice !== undefined) urlParams.set('maxPrice', newParams.maxPrice.toString());
    
    if (newParams.isStock !== null && newParams.isStock !== undefined) {
      urlParams.set('isStock', newParams.isStock.toString());
    }
    
    if (newParams.sortType) urlParams.set('sortType', newParams.sortType);

    if (newParams.shopType) {
      urlParams.set('shopType[]', newParams.shopType);
    }
    
    if (newParams.type && newParams.type.length > 0) {
      newParams.type.forEach(val => urlParams.append('type[]', val));
    }

    router.replace(`${pathname}?${urlParams.toString()}`, { scroll: false });
  };

  return (
    <Box sx={{ minHeight: '100dvh' }}>
      
      {/* ⭐️ แทนที่ DynamicBreadcrumbs ด้วยข้อความ ผลลัพธ์จาก "{q}" */}
      <Box sx={{ px: { xs: 2, md: 4, lg: 6 }, pt: 4, pb: 2 }}>
        <Typography variant="h5" sx={{ color: COLORS.f1, fontWeight: 'bold' }}>
          ผลลัพธ์จาก "{q}"
        </Typography>
      </Box>

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
              updateURL({
                type: data.type && data.type.length > 0 ? data.type : [],
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

        <Box sx={{ p: 4, flex: 1, minWidth: 0 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 2,
              mb: 3
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
              <Box key={product.id} sx={{ width: '100%', minWidth: 0 }}>
                <ProductCard product={product} />
              </Box>
            ))}
          </Box>

          {/* แสดงข้อความเมื่อไม่พบสินค้า */}
          {total === 0 && (
             <Box sx={{ width: '100%', textAlign: 'center', mt: 8, color: 'gray' }}>
               <Typography variant="h6">ไม่พบสินค้าที่คุณค้นหา</Typography>
             </Box>
          )}

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