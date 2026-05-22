package com.mikan.restapi.controller;

import com.auth0.jwt.interfaces.DecodedJWT;
import com.mikan.restapi.constant.ApiResponse;
import com.mikan.restapi.model.category.request.CreateShopCategoryRequest;
import com.mikan.restapi.model.category.response.CreateShopCategoryResponse;
import com.mikan.restapi.service.CategoryService;
import io.jsonwebtoken.Claims;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@Slf4j
@RequestMapping("/api/v1/category")
public class CategoryController {
    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<CreateShopCategoryResponse>> create(
            @AuthenticationPrincipal DecodedJWT jwt,
            @Valid @RequestBody CreateShopCategoryRequest request
    ){
        log.info("[API CATEGORY] create request: {}", request);
        String userId = jwt.getSubject();
        CreateShopCategoryResponse response = categoryService.createCategory(userId,request);

        return ResponseEntity.ok(
                ApiResponse.<CreateShopCategoryResponse>builder()
                        .code("200")
                        .message("success")
                        .data(response)
                        .build()
        );
    }
}
