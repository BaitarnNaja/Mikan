package com.mikan.restapi.controller;

import com.auth0.jwt.interfaces.DecodedJWT;
import com.mikan.restapi.constant.ApiResponse;
import com.mikan.restapi.model.cart.request.AddCartItemRequest;
import com.mikan.restapi.model.cart.request.DeleteCartItemsRequest;
import com.mikan.restapi.model.cart.request.UpdateCartItemRequest;
import com.mikan.restapi.model.cart.response.*;
import com.mikan.restapi.model.category.response.CreateShopCategoryResponse;
import com.mikan.restapi.service.CartService;
import io.jsonwebtoken.Claims;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@Slf4j
@RequestMapping("/api/v1/cart")
public class CartController {
    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<AddCartItemResponse>> addCartItem(
            @AuthenticationPrincipal DecodedJWT jwt,
            @Valid @RequestBody AddCartItemRequest request
    ){
        log.info("[API CART] addItem request: {}", request);
        String userId = jwt.getSubject();
        AddCartItemResponse response = cartService.addCartItem(userId,request);

        return ResponseEntity.ok(
                ApiResponse.<AddCartItemResponse>builder()
                        .code("200")
                        .message("success")
                        .data(response)
                        .build()
        );
    }

    @GetMapping
    public ResponseEntity<ApiResponse<GetUserCartResponse>> getCart(
            @AuthenticationPrincipal DecodedJWT jwt
    ){
        String userId = jwt.getSubject();
        log.info("[API CART] getCart ");
        GetUserCartResponse response = cartService.getCart(userId);
        return ResponseEntity.ok(
                ApiResponse.<GetUserCartResponse>builder()
                        .code("200")
                        .message("success")
                        .data(response)
                        .build()
        );
    }

    @PatchMapping("/item/{cartItemId}")
    public ResponseEntity<ApiResponse<ModCartItemResponse>> updateQuantity(
            @AuthenticationPrincipal DecodedJWT jwt,
            @PathVariable UUID cartItemId,
            @Valid @RequestBody UpdateCartItemRequest request
    ){
        String userId = jwt.getSubject();
        log.info("[API CART] updateQuantity :request {} ",request);
        ModCartItemResponse response = cartService.updateQuantity(userId,cartItemId,request);
        return ResponseEntity.ok(
                ApiResponse.<ModCartItemResponse>builder()
                        .code("200")
                        .message("success")
                        .data(response)
                        .build()
        );
    }

    @DeleteMapping("/item/{cartItemId}")
    public  ResponseEntity<ApiResponse<DeleteCartItemResponse>> deleteItem(
            @AuthenticationPrincipal DecodedJWT jwt,
            @PathVariable UUID cartItemId
    ) {
        String userId = jwt.getSubject();
        log.info("[API CART] deleteItem :request {} ", cartItemId);

        DeleteCartItemResponse response = cartService.deleteItem(userId, cartItemId);
        return ResponseEntity.ok(
                ApiResponse.<DeleteCartItemResponse>builder()
                        .code("200")
                        .message("success")
                        .data(response)
                        .build()
        );
    }

    @DeleteMapping("/items")
    public  ResponseEntity<ApiResponse<DeleteCartItemsResponse>> deleteItems(
            @AuthenticationPrincipal DecodedJWT jwt,
            @Valid @RequestBody DeleteCartItemsRequest request
    ) {
        String userId = jwt.getSubject();
        log.info("[API CART] deleteItems :request {} ", request);

        DeleteCartItemsResponse response = cartService.deleteItems(userId, request);
        return ResponseEntity.ok(
                ApiResponse.<DeleteCartItemsResponse>builder()
                        .code("200")
                        .message("success")
                        .data(response)
                        .build()
        );
    }

    @GetMapping("/count")
    public  ResponseEntity<ApiResponse<GetCartCountResponse>> getCartCount(
            @AuthenticationPrincipal DecodedJWT jwt
    ){
        String userId = jwt.getSubject();
        log.info("[API CART] getCartCount :request {} ", userId);

        GetCartCountResponse response = cartService.getCartCount(userId);

        return ResponseEntity.ok(
                ApiResponse.<GetCartCountResponse>builder()
                        .code("200")
                        .message("success")
                        .data(response)
                        .build()
        );
    }
}
