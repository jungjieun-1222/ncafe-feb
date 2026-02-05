package com.new_cafe.app.backend.controller.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class MenuResponse {
    private Long id;
    private String korName;
    private String engName;
    private String description;
    private int price;
    private String categoryName;
    private String imageSrc;
    private Boolean isAvailable;
    private Boolean isSoldOut;
    private int sortOrder;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}