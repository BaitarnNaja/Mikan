package com.mikan.restapi.model.payment.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
@Builder
public class PaymentPreviewResponse {
    private String currency;
    private List<Shop> shops;
    private Summary summary;

    // -------- SHOP --------
    @Getter
    @Setter
    @Builder
    public static class Shop {
        private UUID shopId;
        private String shopName;
        private List<ProductItem> productItems;
        private ShopSummary shopSummary;
    }

    // -------- PRODUCT --------
    @Getter
    @Setter
    @Builder
    public static class ProductItem {
        private UUID productId;
        private String productName;
        private List<OptionItem> optionItems;
    }

    // -------- OPTION --------
    @Getter
    @Setter
    @Builder
    public static class OptionItem {
        private UUID cartItemId; // null ได้ใน buy now
        private UUID optionId;
        private String optionName;
        private String image;

        private Double amount;
        private Integer quantity;
    }

    // -------- SHOP SUMMARY --------
    @Getter
    @Setter
    @Builder
    public static class ShopSummary {
        private Double subtotal;
        private Double shippingFee;
    }

    // -------- TOTAL SUMMARY --------
    @Getter
    @Setter
    @Builder
    public static class Summary {
        private Double subtotal;
        private Double shippingFee;
        private Double total;
    }
}
