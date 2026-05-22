package com.mikan.restapi.model.shop.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Setter
@Getter
@Builder
public class ShopInfoResponse {
    UUID  shopId;
    private String shopName;
    private Integer productQuantity;
    private Double rating;
    private List<CategoryDto> category;

    @Setter
    @Getter
    @Builder
    public static class CategoryDto {
        private UUID categoryId;
        private String categoryName;
    }
}
