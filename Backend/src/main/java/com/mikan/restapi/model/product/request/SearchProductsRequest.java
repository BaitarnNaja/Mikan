package com.mikan.restapi.model.product.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class SearchProductsRequest {
    private String query;
    private Filter filter;
    private String sortType;

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Filter{

        private List<String> type;
        private BigDecimal minPrice;
        private BigDecimal maxPrice;
        private Boolean isStock;
        private List<String> shopType;
    }

}
