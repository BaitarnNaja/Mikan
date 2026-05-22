package com.mikan.restapi.model.order.request;

import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Setter
@Getter
public class CreateOrderRequest {

    private ShippingAddressDto shippingAddress;
    private List<OrderItemDto> items;

    @Setter
    @Getter
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

    @Setter
    @Getter
    public static class OrderItemDto {
        private UUID productOptionId;
        private Integer quantity;
    }
}
