package com.mikan.restapi.constant;

import com.mikan.restapi.model.Metadata;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Builder
public class ApiResponse<T> {
    private String code;
    private String message;
    private T data;
}
