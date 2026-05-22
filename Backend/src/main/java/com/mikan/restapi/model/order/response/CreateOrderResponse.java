package com.mikan.restapi.model.order.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Setter
@Getter
@Builder
public class CreateOrderResponse {

    private UUID orderId;
    private Integer totalAmount;
    private String paymentUrl;
    private String status;
    private List<OrderResponse> orderResponses;

    @Setter
    @Getter
    @Builder
    public static class OrderResponse {
        private UUID id;
        private UUID shopId;
        private String shopName;
        private String createAt;
        private String status;
        private List<OrderItemDetail> orderItems;
        private String totalAmount;

        @Setter
        @Getter
        @Builder
        public static class OrderItemDetail {
            private UUID productId;
            private String productName;
            private UUID productOptionId;
            private String optionName;
            private String img;
            private String quantity;
            private String price;
        }
    }
}