package com.new_cafe.app.backend.common.storage.application.port.in;

import org.springframework.web.multipart.MultipartFile;

public interface FileStorageUseCase {
    String storeFile(MultipartFile file);
    void deleteFile(String filePath);
}
