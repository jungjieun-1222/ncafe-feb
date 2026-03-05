package com.new_cafe.app.backend.usermenu.adapter.in.web;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class MenuResponse {
    private Long id;
    private String korName;
    private String engName;
    private String description;
    private int price;
    private int categoryId;
    private boolean isAvailable;
    private String allergyInfo;
}
