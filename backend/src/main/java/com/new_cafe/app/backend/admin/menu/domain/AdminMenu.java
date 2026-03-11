package com.new_cafe.app.backend.admin.menu.domain;

import com.fasterxml.jackson.annotation.JsonProperty;
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
    private Integer categoryId;
    private String categoryName;
    
    @JsonProperty("isAvailable")
    private boolean isAvailable;
    
    @JsonProperty("isSoldOut")
    private boolean isSoldOut;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String altText;
    private String primaryImageSrc;
    
    // 관리자 전용 필드
    private Integer costPrice;
    private String adminMemo;
}
