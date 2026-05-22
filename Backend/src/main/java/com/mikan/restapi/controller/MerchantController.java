package com.mikan.restapi.controller;

import com.auth0.jwt.interfaces.DecodedJWT;
import com.mikan.restapi.constant.ApiResponse;
import com.mikan.restapi.model.merchant.request.RegistMerchantRequest;
import com.mikan.restapi.model.merchant.response.RegistMerchantResponse;
import com.mikan.restapi.service.MerchantService;
import io.jsonwebtoken.Claims;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@Slf4j
@RequestMapping("/api/v1/merchant")
public class MerchantController {
    private final MerchantService merchantService;

    public MerchantController(MerchantService merchantService){
        this.merchantService = merchantService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<RegistMerchantResponse>> registMerchant(
            @AuthenticationPrincipal DecodedJWT jwt,
            @Valid @RequestBody RegistMerchantRequest request
    ){
        log.info("[API MERCHANT] register request: {}", request);
        String userId = jwt.getSubject();
        RegistMerchantResponse response = merchantService.registMerchant(userId,request);
        return ResponseEntity.ok(
                ApiResponse.<RegistMerchantResponse>builder()
                        .code("200")
                        .message("success")
                        .data(response)
                        .build()
        );
    }


}
