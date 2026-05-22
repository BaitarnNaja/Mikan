package com.mikan.restapi.controller;

import com.auth0.jwt.interfaces.DecodedJWT;
import com.mikan.restapi.constant.ApiResponse;
import com.mikan.restapi.model.Metadata;
import com.mikan.restapi.model.order.request.CancelOrderRequest;
import com.mikan.restapi.model.order.request.CreateOrderRequest;
import com.mikan.restapi.model.order.response.CancelOrderResponse;
import com.mikan.restapi.model.order.response.CreateOrderResponse;
import com.mikan.restapi.model.order.response.GetOrderResponse;
import com.mikan.restapi.model.order.response.WatchOrderResponse;
import com.mikan.restapi.service.OrderService;

import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@Slf4j
@RequestMapping("/api/v1/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<CreateOrderResponse>> createOrder(
            @AuthenticationPrincipal DecodedJWT jwt,
            @Valid @RequestBody CreateOrderRequest request) {
        log.info("[API ORDER] create order request: {}", request);
        String userId = jwt.getSubject();
        CreateOrderResponse response = orderService.createOrder(userId, request);
        return ResponseEntity.ok(
                ApiResponse.<CreateOrderResponse>builder()
                        .code("200")
                        .message("success")
                        .data(response)
                        .build()
        );
    }
    @GetMapping
    public ResponseEntity<ApiResponse<GetOrderResponse>> getUserOrders(
            @AuthenticationPrincipal DecodedJWT jwt,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(required = false) String shopOrderId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit) {
        log.info("[API ORDER] get user orders userId: {}", jwt.getSubject());
        String userId = jwt.getSubject();


        GetOrderResponse response = orderService.getUserOrders(
                userId, shopOrderId, startDate, endDate, page, limit
        );
        return ResponseEntity.ok(
                ApiResponse.<GetOrderResponse>builder()
                        .code("200")
                        .message("success")
                        .data(response)
                        .build()
        );
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<ApiResponse<WatchOrderResponse>> getOrderDetail(
            @AuthenticationPrincipal DecodedJWT jwt,
            @PathVariable String orderId) {
        log.info("[API ORDER] watch order orderId: {}", orderId);
        String userId = jwt.getSubject();
        WatchOrderResponse response = orderService.getOrderDetail(userId, orderId);
        return ResponseEntity.ok(
                ApiResponse.<WatchOrderResponse>builder()
                        .code("200")
                        .message("success")
                        .data(response)
                        .build()
        );
    }

    @PutMapping("/{orderShopId}/cancel")
    public ResponseEntity<ApiResponse<CancelOrderResponse>> cancelOrder(
            @PathVariable UUID orderShopId,
            @ModelAttribute CancelOrderRequest request,
            @AuthenticationPrincipal DecodedJWT jwt) {

        log.info("[CANCEL ORDER] orderShopId={}, reasonCode={}", orderShopId, request.getReasonCode());

        String userId = jwt.getSubject();

        CancelOrderResponse response = orderService.cancelOrder(orderShopId, userId, request);

        return ResponseEntity.ok(ApiResponse.<CancelOrderResponse>builder()
                .code("200")
                .message("Order cancelled successfully")
                .data(response)
                .build());
    }


}
