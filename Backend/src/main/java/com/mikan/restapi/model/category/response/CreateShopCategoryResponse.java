package com.mikan.restapi.model.category.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Setter
@Getter
@Builder
public class CreateShopCategoryResponse {
    private UUID categoryId;
}
