package com.mikan.restapi.model.cart.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
@Builder
public class DeleteCartItemsResponse {
    private List<UUID> cartItemsId;
}
