package com.new_cafe.app.backend.controller.dto;

import lombok.Data;

@Data
public class MenuListRequest {
    private Integer categoryId;
    private String searchQuery;
}
