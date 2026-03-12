package com.new_cafe.app.backend.admin.menu.adapter.in.web.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AdminMenuWebRequest {
    private String korName;
    private String engName;
    private String slug;
    private String description;
    private int price;
    private int categoryId;
    private Boolean isAvailable;
    private String altText;
    
    // 관리자 전용 필드
    private Integer costPrice;
    private String adminMemo;
    private String imageSrc;
}
