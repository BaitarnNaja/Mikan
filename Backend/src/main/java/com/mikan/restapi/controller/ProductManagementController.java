package com.mikan.restapi.controller;

import com.auth0.jwt.interfaces.DecodedJWT;
import com.mikan.restapi.constant.ApiResponse;
import com.mikan.restapi.model.product.request.CreateProductRequest;
import com.mikan.restapi.model.product.response.CreateProductResponse;
import com.mikan.restapi.service.ProductManagementService;
import io.jsonwebtoken.Claims;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@Slf4j
@RequestMapping("/api/v1/manage-product")
public class ProductManagementController {
    private final ProductManagementService productService;

    public ProductManagementController(ProductManagementService productService){
        this.productService = productService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<CreateProductResponse>> create(
            @AuthenticationPrincipal DecodedJWT jwt,
            @Valid @RequestBody CreateProductRequest request
    ){
        log.info("[API PRODUCT-MANAGE] create request: {}", request);
        String userId = jwt.getSubject();
        CreateProductResponse response = productService.createProduct(userId,request);

        return ResponseEntity.ok(
                ApiResponse.<CreateProductResponse>builder()
                        .code("200")
                        .message("success")
                        .data(response)
                        .build()
        );
    }
}
