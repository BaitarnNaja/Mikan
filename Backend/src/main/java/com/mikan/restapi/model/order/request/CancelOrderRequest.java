package com.mikan.restapi.model.order.request;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class CancelOrderRequest {
    private String reasonCode;
    private String reasonDetail;
}
