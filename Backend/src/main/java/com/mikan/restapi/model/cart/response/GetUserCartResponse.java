package com.mikan.restapi.model.cart.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
@Builder
public class GetUserCartResponse {
    private List<Shop> shops;
    private int count;

    @Getter
    @Setter
    @Builder
    public static class Shop {
        private UUID id;
        private String shopName;
        private List<ProductItem> productItems;
    }

    @Getter
    @Setter
    @Builder
    public static class ProductItem {
        private UUID id;
        private String productName;
        private List<OptionItem> optionItems;
    }

    @Getter
    @Setter
    @Builder
    public static class OptionItem {
        private UUID cartItemId;
        private UUID id;
        private String optionName;
        private String image;
        private Double amount;
        private String currency;
        private Integer quantity;
    }
}
