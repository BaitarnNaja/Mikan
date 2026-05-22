package com.mikan.restapi.model.order.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Setter
@Getter
@Builder
public class WatchOrderResponse {
    private UUID id;
    private String status;
    private String createdAt;
    private MerchantDto merchant;
    private List<OrderItemDetail> items;
    private SummaryDto summary;
    private TrackingDto tracking;
    private ShippingAddressDto shippingAddress;

    @Setter
    @Getter
    @Builder
    public static class MerchantDto {
        private UUID id;
        private String shopName;
    }

    @Setter
    @Getter
    @Builder
    public static class OrderItemDetail {
        private UUID productId;
        private String productName;
        private UUID optionId;
        private String optionName;
        private String image;
        private Integer quantity;
        private Float price;
    }

    @Setter
    @Getter
    @Builder
    public static class SummaryDto {
        private BigDecimal subtotal;
        private BigDecimal shippingFee;
        private BigDecimal total;
    }

    @Setter
    @Getter
    @Builder
    public static class TrackingDto {
        private String carrier;
        private String trackingNumber;
    }

    @Setter
    @Getter
    @Builder
    public static class ShippingAddressDto {
        private String firstname;
        private String lastname;
        private String address;
        private String road;
        private String district;
        private String subdistrict;
        private String province;
        private String postcode;
        private String phone;
    }
}
