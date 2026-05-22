package com.mikan.restapi.model.product.response;

import com.mikan.restapi.model.Metadata;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Builder
@Getter
@Setter
public class GetProductResponse {
    private Metadata metadata;
    private List<ProductItem> data;

    @Builder
    @Getter
    @Setter
    public static class ProductItem {
        private UUID id;
        private String productName;
        private String img;
        private Price price;
    }

    @Builder
    @Getter
    @Setter
    public static class Price {
        private String currency;
        private Double amount;
    }
}
