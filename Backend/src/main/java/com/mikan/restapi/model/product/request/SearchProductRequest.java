package com.mikan.restapi.model.product.request;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
public class SearchProductRequest {
    private String q;
    private Integer page;
    private Integer limit;

    private List<String> type;
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
    private Boolean isStock;
    private List<String> shopType;
    private String sortType;
}
