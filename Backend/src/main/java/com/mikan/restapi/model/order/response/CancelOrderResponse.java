package com.mikan.restapi.model.order.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Setter
@Getter
@Builder
public class CancelOrderResponse {
    private String message;
    private UUID orderId;
    private String status;
    private CancelInfo cancelInfo;

    @Setter
    @Getter
    @Builder
    public static class CancelInfo {
        private String reasonCode;
        private String reasonDetail;
    }
}
