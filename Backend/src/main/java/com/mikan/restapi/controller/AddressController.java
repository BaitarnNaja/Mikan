package com.mikan.restapi.controller;

import com.auth0.jwt.interfaces.DecodedJWT;
import com.mikan.restapi.constant.ApiResponse;
import com.mikan.restapi.model.address.request.AddAddressRequest;
import com.mikan.restapi.model.address.request.DeleteAddressRequest;
import com.mikan.restapi.model.address.request.EditAddressRequest;
import com.mikan.restapi.model.address.response.*;
import com.mikan.restapi.service.AddressService;
import io.jsonwebtoken.Claims;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@Slf4j
@RequestMapping("/api/v1/address")
public class AddressController {

    private final AddressService addressService;

    public AddressController(AddressService addressService) {
        this.addressService = addressService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<AddAddressResponse>> addAddress(
            @AuthenticationPrincipal DecodedJWT jwt
            , @Valid @RequestBody AddAddressRequest request) {
        log.info("[API ADDRESS] add request: {}", request);
        String userId = jwt.getSubject();
        AddAddressResponse response = addressService.addAddress(userId,request);
        return ResponseEntity.ok(
                ApiResponse.<AddAddressResponse>builder()
                        .code("200")
                        .message("success")
                        .data(response)
                        .build()
        );
    }

    @GetMapping ("/get-user-address-list")
    public ResponseEntity<ApiResponse<GetAllAddressResponse>> getAllAddress(
            @AuthenticationPrincipal DecodedJWT jwt) {

        String userId = jwt.getSubject();

        GetAllAddressResponse response = addressService.getAllAddress(userId);
        log.info("[API ADDRESS] getAllAddress ");
        return ResponseEntity.ok(
                ApiResponse.<GetAllAddressResponse>builder()
                        .code("200")
                        .message("success")
                        .data(response)
                        .build()
        );

    }


    @GetMapping("/{addressId}")
    public ResponseEntity<ApiResponse<GetUserAddressResponse>> getUserAddress(
            @AuthenticationPrincipal DecodedJWT jwt,
            @PathVariable UUID addressId
    ) {

        GetUserAddressResponse response = addressService.getUserAddress(addressId);
        log.info("[API ADDRESS] getUserAddress ");
        return ResponseEntity.ok(
                ApiResponse.<GetUserAddressResponse>builder()
                        .code("200")
                        .message("success")
                        .data(response)
                        .build()
        );
    }


    @PutMapping
    public ResponseEntity<ApiResponse<EditAddressResponse>> editAddress(
            @AuthenticationPrincipal DecodedJWT jwt,
            @Valid @RequestBody EditAddressRequest request) {
        log.info("[API ADDRESS] edit request: {}", request);
        EditAddressResponse response = addressService.editAddress(request);
        return ResponseEntity.ok(
                ApiResponse.<EditAddressResponse>builder()
                        .code("200")
                        .message("success")
                        .data(response)
                        .build()
        );
    }


    @DeleteMapping("/{address_id}")
    public ResponseEntity<ApiResponse<DeleteAddressResponse>> deleteAddress(
            @RequestBody DeleteAddressRequest request) {

        DeleteAddressResponse response = addressService.deleteAddress(request);
        return ResponseEntity.ok(
                ApiResponse.<DeleteAddressResponse>builder()
                        .code("200")
                        .message("success")
                        .data(response)
                        .build()
        );
    }
}
