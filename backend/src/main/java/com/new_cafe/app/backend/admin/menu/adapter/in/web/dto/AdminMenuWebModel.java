package com.new_cafe.app.backend.admin.menu.adapter.in.web.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Getter;
import java.time.LocalDateTime;

@Getter
@Builder
public class AdminMenuWebModel {
    private Long id;
    private String korName;
    private String engName;
    private String slug;
    private String description;
    private Integer price;
    private int categoryId;
    private String categoryName;
    private String imageSrc;
    @JsonProperty("isAvailable")
    private boolean isAvailable;
    @JsonProperty("isSoldOut")
    private boolean isSoldOut;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updatedAt;
    
    // 관리자 전용 필드
    private Integer costPrice;
    private String adminMemo;
    private String altText;
    private java.util.List<com.new_cafe.app.backend.cart.domain.Option> options;
    private java.util.List<String> curationTags;
    private Integer sortOrder;
}
