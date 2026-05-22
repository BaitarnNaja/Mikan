package com.mikan.restapi.model.category.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class CreateShopCategoryRequest {
    @NotBlank
    private String categoryName;

    private boolean isActive;

}
