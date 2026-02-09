package com.new_cafe.app.backend.controller.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MenuImageResponse {
    private Long id;
    private Long menuId;
    private String srcUrl;
    private String altText;
    private int sortOrder;
}
