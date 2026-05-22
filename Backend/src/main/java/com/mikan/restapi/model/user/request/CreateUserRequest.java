package com.mikan.restapi.model.user.request;

import jakarta.validation.constraints.Email;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class CreateUserRequest {

    private String name;
    @Email
    private String email;

}