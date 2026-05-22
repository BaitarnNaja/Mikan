package com.mikan.restapi.model.shop.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Setter
@Getter
@Builder
public class GetShopProductResponse {
    private UUID shopId;
    private Metadata metadata;
    private List<ProductItem> items;

    @Setter
    @Getter
    @Builder
    public static class Metadata {
        private int page;
        private int limit;
        private int total;
    }

    @Setter
    @Getter
    @Builder
    public static class ProductItem {
        private UUID id;
        private String productName;
        private String img;
        private Price price;
    }

    @Setter
    @Getter
    @Builder
    public static class Price {
        private String currency;
        private String amount;
    }
}
