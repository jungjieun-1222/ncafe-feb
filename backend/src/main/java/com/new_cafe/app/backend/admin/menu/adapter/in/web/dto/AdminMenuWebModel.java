package com.new_cafe.app.backend.admin.menu.adapter.in.web.dto;

import lombok.Builder;
import lombok.Getter;
import java.time.LocalDateTime;

@Getter
@Builder
public class AdminMenuWebModel {
    private Long id;
    private String korName;
    private String engName;
    private String description;
    private int price;
    private int categoryId;
    private String categoryName;
    private String imageSrc;
    private boolean isAvailable;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // 관리자 전용 필드
    private Integer costPrice;
    private String adminMemo;
}
