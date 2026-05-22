package com.mikan.restapi.model.product.request;

import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
public class CreateProductRequest {

    private String name;
    private UUID categoryId;
    private String type;
    private String productDsc;

    private List<String> imgs;

    private List<Option> options;

    @Getter
    @Setter
    public static class Option {
        private String code;
        private String optionName;
        private Integer quantity;
        private Double price;
        private String img;
    }
}
