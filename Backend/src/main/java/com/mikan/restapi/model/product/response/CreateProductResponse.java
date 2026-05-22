package com.mikan.restapi.model.product.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Builder
@Getter
@Setter
public class CreateProductResponse {
    private UUID productId;
    private List<UUID> optionId;
}
