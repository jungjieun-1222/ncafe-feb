package com.new_cafe.app.backend.controller.dto;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;

@AllArgsConstructor
@Builder
@NoArgsConstructor
@Data
public class MenuDetailResponse {
    private Long id;
    private String korName;
    private String engName;
    private String description;
    private int price;
    private boolean isAvailable;
    private String categoryName;
    private int categoryId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
