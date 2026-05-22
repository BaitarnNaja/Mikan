package com.mikan.restapi.model.files.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Builder
public class FileUploadResponse {
    private String url;
}
