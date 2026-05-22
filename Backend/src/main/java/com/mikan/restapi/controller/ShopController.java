package com.mikan.restapi.controller;

import com.mikan.restapi.constant.ApiResponse;
import com.mikan.restapi.model.shop.response.GetShopProductResponse;
import com.mikan.restapi.model.shop.response.ShopInfoResponse;
import com.mikan.restapi.service.ShopService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@Slf4j
@RequestMapping("/api/v1/shop")
public class ShopController {

    private final ShopService shopService;

    public ShopController(ShopService shopService) {
        this.shopService = shopService;
    }

    @GetMapping("/{shopId}")
    public ResponseEntity<ApiResponse<ShopInfoResponse>> getShopInfo(
            @PathVariable UUID shopId) {
        log.info("[API SHOP] get shop info shopId: {}", shopId);
        ShopInfoResponse response = shopService.getShopInfo(shopId);
        return ResponseEntity.ok(
                ApiResponse.<ShopInfoResponse>builder()
                        .code("200")
                        .message("success")
                        .data(response)
                        .build()
        );
    }

    @GetMapping("/products/{shopId}")
    public ResponseEntity<ApiResponse<GetShopProductResponse>> getShopProducts(
            @PathVariable String shopId,
            @RequestParam(required = false) String categoryId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit) {
        log.info("[API SHOP] get shop products shopId: {}", shopId);
        GetShopProductResponse response = shopService.getShopProducts(shopId, categoryId, page, limit);
        return ResponseEntity.ok(
                ApiResponse.<GetShopProductResponse>builder()
                        .code("200")
                        .message("success")
                        .data(response)
                        .build()
        );
    }
}
