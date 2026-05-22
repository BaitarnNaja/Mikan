package com.mikan.restapi.model.authorization.request;

import lombok.Data;

@Data
public class LoginRequest {
    private String email;
    private String password;
}
