package com.mikan.restapi.controller;

import com.auth0.jwt.interfaces.DecodedJWT;
import com.mikan.restapi.constant.ApiResponse;
import com.mikan.restapi.model.GlobalException;
import com.mikan.restapi.model.merchant.response.RegistMerchantResponse;
import com.mikan.restapi.model.payment.request.PaymentPreviewRequest;
import com.mikan.restapi.model.payment.response.PaymentPreviewResponse;
import com.mikan.restapi.service.PaymentService;
import io.jsonwebtoken.Claims;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;
@RestController
@Slf4j
@RequestMapping("/api/v1/payment")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/preview")
    public ResponseEntity<ApiResponse<PaymentPreviewResponse>> preview(
            @RequestBody @Valid PaymentPreviewRequest request,
            @AuthenticationPrincipal DecodedJWT jwt
            ) {

        UUID userId = UUID.fromString(jwt.getSubject());
        log.info("[API PAYMENT] paymentPreview request: {}", request);
        if (!request.checkInputMode()) {
            throw new GlobalException("403","Provide either items or selectedCartItemIds", HttpStatus.BAD_REQUEST);
        }
        PaymentPreviewResponse response = paymentService.preview(request,userId);
        return ResponseEntity.ok(
                ApiResponse.<PaymentPreviewResponse>builder()
                        .code("200")
                        .message("success")
                        .data(response)
                        .build()
        );
    }
}
