package com.new_cafe.app.backend.common.storage.application.service;

import com.new_cafe.app.backend.common.storage.application.port.in.FileStorageUseCase;
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
public class FileStorageService implements FileStorageUseCase {

    private final Path fileStorageLocation;

    public FileStorageService(@org.springframework.beans.factory.annotation.Value("${upload.path}") String uploadPath) {
        // Ensure the path points to the 'images' subdirectory which is served by /images/**
        String baseLocation = uploadPath.endsWith("/") ? uploadPath + "images" : uploadPath + "/images";
        this.fileStorageLocation = Paths.get(baseLocation).toAbsolutePath().normalize();
        
        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Could not create the directory where the uploaded files will be stored.", ex);
        }
    }

    @Override
    public String storeFile(MultipartFile file) {
        String originalFileName = StringUtils.cleanPath(file.getOriginalFilename());
        String fileName = "";

        try {
            if (originalFileName.contains("..")) {
                throw new RuntimeException("Filename contains invalid path sequence " + originalFileName);
            }
            
            String extension = "";
            int i = originalFileName.lastIndexOf('.');
            if (i > 0) {
                extension = originalFileName.substring(i);
            }
            
            fileName = UUID.randomUUID().toString() + extension;
            Path targetLocation = this.fileStorageLocation.resolve(fileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            // Return path starting with /images/ so it's consistent with existing images
            return "/images/" + fileName;
        } catch (IOException ex) {
            throw new RuntimeException("Could not store file " + fileName + ". Please try again!", ex);
        }
    }

    @Override
    public void deleteFile(String filePath) {
        if (filePath == null) {
            return;
        }

        try {
            // Get filename from path (could be /images/uuid.png or /uploads/uuid.png)
            String fileName = Paths.get(filePath).getFileName().toString();
            Path targetLocation = this.fileStorageLocation.resolve(fileName);
            Files.deleteIfExists(targetLocation);
        } catch (IOException ex) {
            throw new RuntimeException("Could not delete file " + filePath, ex);
        }
    }
}
