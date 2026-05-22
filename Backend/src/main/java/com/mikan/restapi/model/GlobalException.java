package com.mikan.restapi.model;

import org.springframework.http.HttpStatus;

public class GlobalException extends RuntimeException {
    private String code;
    private HttpStatus status;

    public GlobalException(String code, String message, HttpStatus status) {
        super(message);
        this.code = code;
        this.status = status;
    }

    public String getCode() {
        return code;
    }

    public HttpStatus getStatus() {
        return status;
    }
}
