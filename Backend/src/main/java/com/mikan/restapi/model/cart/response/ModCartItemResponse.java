package com.mikan.restapi.model.cart.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@Builder
public class ModCartItemResponse {
    private UUID cartItemId;
    private Integer quantity;
    private Boolean deleted;
}
