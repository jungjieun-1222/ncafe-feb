package com.new_cafe.app.backend.usermenu.domain;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserMenu {
    private Long id;
    private String korName;
    private String engName;
    private String description;
    private Integer price;
    private Long categoryId;
    private String categoryName;
    private String primaryImageSrc;
    private boolean isAvailable;
    
    // 유저 전용 필드 (미래 확장 예시)
    private String allergyInfo;
    private java.util.List<String> images;
}
