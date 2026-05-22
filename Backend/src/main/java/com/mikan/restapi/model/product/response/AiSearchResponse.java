package com.mikan.restapi.model.product.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.tool.schema.extract.spi.DatabaseInformation;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Data
@Builder
public class AiSearchResponse {
    private String code;
    private String message;
    private List<DataInfo> data;
    private String processTime;

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class DataInfo{
        private UUID id;
        private String productName;
        private String img;
        private PriceInfo price;
    }

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class PriceInfo{
        private String currency;
        private BigDecimal amount;
    }

}
