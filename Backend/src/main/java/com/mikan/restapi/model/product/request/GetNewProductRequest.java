package com.mikan.restapi.model.product.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GetNewProductRequest {
    private int page;
    private int limit;
}
