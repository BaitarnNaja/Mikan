package com.mikan.restapi.controller;

import com.auth0.jwt.interfaces.DecodedJWT;
import com.mikan.restapi.constant.ApiResponse;
import com.mikan.restapi.model.files.response.FileUploadResponse;
import com.mikan.restapi.service.FileStorageService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import org.springframework.web.multipart.MultipartFile;

@RestController
@Slf4j
@RequestMapping("/api/v1/uploads")
public class FileUploadController {

    private final FileStorageService fileStorageService;

    public FileUploadController(FileStorageService fileStorageService) {
        this.fileStorageService = fileStorageService;
    }

    @Operation(summary = "Upload image")
    @PostMapping(value = "/image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<FileUploadResponse>> uploadImage(
            @AuthenticationPrincipal DecodedJWT jwt,
            @RequestPart("file") MultipartFile file
    ) {
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            return ResponseEntity.badRequest().body(
                    ApiResponse.<FileUploadResponse>builder()
                            .code("400").message("Only image files are allowed").build()
            );
        }

        String url = fileStorageService.store(file);

        return ResponseEntity.ok(
                ApiResponse.<FileUploadResponse>builder()
                        .code("200").message("Upload successful")
                        .data(FileUploadResponse.builder().url(url).build())
                        .build()
        );
    }
}
