package com.mikan.restapi.model.test_main.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;

import java.util.UUID;

@Getter
public class UpdateTestMainRequest {
    private String name;
    private UUID testSubId;
}
