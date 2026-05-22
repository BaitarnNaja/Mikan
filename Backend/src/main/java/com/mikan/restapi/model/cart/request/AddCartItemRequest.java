package com.mikan.restapi.model.cart.request;

import lombok.Getter;

import java.util.UUID;

@Getter
public class AddCartItemRequest {
    private UUID productId;
    private UUID productOptionId;
    private int quantity;
}
