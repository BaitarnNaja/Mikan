package com.mikan.restapi.model.test_main.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Setter
@Builder
public class TestMainResponse {

    private String code;
    private String msg;

    private UUID id;
    private String name;

    private UUID testSubId;
    private String testSubName;
}
