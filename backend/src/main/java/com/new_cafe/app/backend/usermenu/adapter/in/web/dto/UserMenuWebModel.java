package com.new_cafe.app.backend.usermenu.adapter.in.web.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UserMenuWebModel {
    private Long id;
    private String korName;
    private String engName;
    private String description;
    private int price;
    private int categoryId;
    private String categoryName;
    private String imageSrc;
    private boolean isAvailable;
}
