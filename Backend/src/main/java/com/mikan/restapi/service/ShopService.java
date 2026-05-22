package com.mikan.restapi.service;

import com.mikan.restapi.entity.Category;
import com.mikan.restapi.model.shop.response.GetShopProductResponse;
import com.mikan.restapi.model.shop.response.ShopInfoResponse;
import com.mikan.restapi.repository.CategoryRepository;
import com.mikan.restapi.repository.MerchantRepository;
import com.mikan.restapi.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class ShopService {

    private final MerchantRepository merchantRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;

    public ShopService(MerchantRepository merchantRepository,
                       CategoryRepository categoryRepository, ProductRepository productRepository) {
        this.merchantRepository = merchantRepository;
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
    }

    public ShopInfoResponse getShopInfo(UUID shopId) {

        Object[] raw = merchantRepository.findShopInfo(shopId);

        if (raw == null) {
            throw new RuntimeException("Shop not found");
        }

        // unwrap ถ้า Spring wrap มาเป็น Object[][]
        Object[] row = (raw[0] instanceof Object[]) ? (Object[]) raw[0] : raw;

        UUID merchantId = UUID.fromString(row[0].toString());

        List<Category> categories = categoryRepository
                .findByMerchant_IdAndIsActiveTrueAndDeleteAtIsNull(merchantId);

        List<ShopInfoResponse.CategoryDto> categoryDtos = categories.stream()
                .map(c -> ShopInfoResponse.CategoryDto.builder()
                        .categoryId(c.getId())
                        .categoryName(c.getName())
                        .build())
                .toList();

        return ShopInfoResponse.builder()
                .shopId((UUID) row[0])
                .shopName(row[1].toString())
                .productQuantity(Integer.parseInt(row[2].toString()))
                .rating(Double.parseDouble(row[3].toString()))
                .category(categoryDtos)
                .build();
    }

    public GetShopProductResponse getShopProducts(String shopId, String categoryId, int page, int limit) {

        int offset = (page - 1) * limit;

        List<Object[]> rows = productRepository.findShopProducts(
                shopId,
                categoryId,
                limit,
                offset
        );

        int total = productRepository.countShopProducts(shopId, categoryId);

        List<GetShopProductResponse.ProductItem> items = new ArrayList<>();

        for (Object[] row : rows) {

            String img = extractFirstImage(row[2]);

            items.add(GetShopProductResponse.ProductItem.builder()
                    .id(UUID.fromString(row[0].toString()))
                    .productName(row[1] != null ? row[1].toString() : "")
                    .img(img)
                    .price(GetShopProductResponse.Price.builder()
                            .currency("THB")
                            .amount(row[3] != null ? row[3].toString() : "0")
                            .build())
                    .build());
        }

        return GetShopProductResponse.builder()
                .shopId(UUID.fromString(shopId))
                .metadata(GetShopProductResponse.Metadata.builder()
                        .page(page)
                        .limit(limit)
                        .total(total)
                        .build())
                .items(items)
                .build();
    }

    private String extractFirstImage(Object value) {

        if (value == null) {
            return null;
        }

        try {

            // PostgreSQL text[] -> String[]
            if (value instanceof String[] arr) {

                if (arr.length > 0) {
                    return arr[0];
                }

                return null;
            }

            // PostgreSQL Array type
            if (value instanceof java.sql.Array sqlArray) {

                String[] arr = (String[]) sqlArray.getArray();

                if (arr.length > 0) {
                    return arr[0];
                }

                return null;
            }

            // fallback
            return value.toString();

        } catch (SQLException e) {
            throw new RuntimeException("Failed to parse product image array", e);
        }
    }
}
