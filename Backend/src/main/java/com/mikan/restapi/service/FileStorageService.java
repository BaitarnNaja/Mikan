package com.mikan.restapi.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageService {
    @Value("${file.upload-dir}")
    private String uploadDir;

    public String store(MultipartFile file) {
        try {
            String ext = StringUtils.getFilenameExtension(file.getOriginalFilename());
            String filename = UUID.randomUUID() + "." + ext;

            Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
            Files.createDirectories(uploadPath);

            Path target = uploadPath.resolve(filename);
            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);

            return "/uploads/images/" + filename;

        } catch (IOException e) {
            throw new RuntimeException("Failed to store file", e);
        }
    }
}
