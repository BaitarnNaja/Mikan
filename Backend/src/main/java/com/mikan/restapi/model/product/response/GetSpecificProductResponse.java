package com.mikan.restapi.model.product.response;

import com.mikan.restapi.entity.Merchant;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
@Builder
public class GetSpecificProductResponse {
    private UUID id;
    private String productName;
    private String description;
    private List<String> images;
    private Price price;
    private List<Option> option;
    private ProductMerchant merchant;
    @Builder
    @Setter
    @Getter
    public static class Price {
        private double amount;
        private String currency;
    }
    @Builder
    @Setter
    @Getter
    public static class Option {
        private UUID id;
        private String optionName;
        private String price;
        private String quantity;
        private String image;
    }
    @Builder
    @Setter
    @Getter
    public static class ProductMerchant {
        private UUID id;
        private String shopName;
        private String logImg;
    }

}
