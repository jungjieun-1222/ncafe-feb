package com.new_cafe.app.backend.admin.menu.domain;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminMenu {
    private Long id;
    private String korName;
    private String engName;
    private String description;
    private Integer price;
    private Long categoryId;
    private String categoryName;
    private boolean isAvailable;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String altText;
    private String primaryImageSrc;
    
    // 관리자 전용 필드 (미래 확장 예시)
    private String supplierInfo; 
}
