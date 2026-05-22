package com.mikan.restapi.model.authorization.response;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LoginResponse {
    private String accessToken;
    private String refreshToken;
    private String tokenType;
    private UserInfo user;

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class UserInfo{
        private UUID id;
        private String email;
        private String name;
        private String role;
    }
}
