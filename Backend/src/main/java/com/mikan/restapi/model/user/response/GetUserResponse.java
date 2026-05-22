package com.mikan.restapi.model.user.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GetUserResponse {
    private String userId;
    private String username;
    private String email;
    private String role;
}
