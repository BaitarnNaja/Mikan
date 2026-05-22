package com.mikan.restapi.config;

import com.mikan.restapi.constant.ApiResponse;
import com.mikan.restapi.model.GlobalException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(GlobalException.class)
    public ResponseEntity<ApiResponse<?>> handle(GlobalException ex) {

        return ResponseEntity
                .status(ex.getStatus())
                .body(ApiResponse.builder()
                        .code(ex.getCode())
                        .message(ex.getMessage())
                        .data(null)
                        .build());
    }
}
