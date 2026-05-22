package com.mikan.restapi.controller;

import com.auth0.jwt.interfaces.DecodedJWT;
import com.mikan.restapi.constant.ApiResponse;
import com.mikan.restapi.model.user.request.CreateUserRequest;
import com.mikan.restapi.model.user.response.CreateUserResponse;
import com.mikan.restapi.model.user.response.GetUserResponse;
import com.mikan.restapi.service.UsersService;
import io.jsonwebtoken.Claims;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@Slf4j
@RequestMapping("/api/v1/user")
public class UsersController {
    private final UsersService usersService;

    public UsersController(UsersService usersService) {
        this.usersService = usersService;
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<GetUserResponse>> getUserById(
            @AuthenticationPrincipal DecodedJWT jwt) {

        String userId = jwt.getSubject();

        GetUserResponse response = usersService.getUserById(userId);
        log.info("[API USER] getUserById");
        return ResponseEntity.ok(
                ApiResponse.<GetUserResponse>builder()
                        .code("200")
                        .message("success")
                        .data(response)
                        .build()
        );
    }

    @PostMapping("/create")
    public ResponseEntity<ApiResponse<CreateUserResponse>> createUser(
            @Valid @RequestBody CreateUserRequest request) {

        CreateUserResponse response = usersService.createUser(request);
        log.info("[API USER] createUser");
        return ResponseEntity.ok(
                ApiResponse.<CreateUserResponse>builder()
                        .code("200")
                        .message("success")
                        .data(response)
                        .build()
        );
    }

    @PostMapping("/gen-jwt/{userId}")
    public ResponseEntity<ApiResponse<String>> genJWT(
            @PathVariable String userId
    ){
        log.info("[API USER] generate jwt :request {}",userId );
        String response = usersService.genJWT(userId);
        return ResponseEntity.ok(
                ApiResponse.<String>builder()
                        .code("200")
                        .message("success")
                        .data(response)
                        .build()
        );
    }
}