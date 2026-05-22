package com.mikan.restapi.model.cart.request;

import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
public class AddCartItemsRequest {
    private List<UUID> cartItemsId;
}
