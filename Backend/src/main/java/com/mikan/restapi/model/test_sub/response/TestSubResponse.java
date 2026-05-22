package com.mikan.restapi.model.test_sub.response;

import lombok.Builder;
import lombok.Getter;

import java.util.UUID;

@Getter
@Builder
public class TestSubResponse {
    private String code;
    private String msg;
    private UUID id;
    private String name;
}
