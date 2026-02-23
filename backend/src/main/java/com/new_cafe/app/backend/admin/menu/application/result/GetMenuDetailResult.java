package com.new_cafe.app.backend.admin.menu.application.result;

import com.new_cafe.app.backend.admin.menu.domain.AdminMenu;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class GetMenuDetailResult {
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
    private String supplierInfo;

    public static GetMenuDetailResult from(AdminMenu menu) {
        return GetMenuDetailResult.builder()
                .id(menu.getId())
                .korName(menu.getKorName())
                .engName(menu.getEngName())
                .description(menu.getDescription())
                .price(menu.getPrice())
                .categoryId(menu.getCategoryId())
                .categoryName(menu.getCategoryName())
                .isAvailable(menu.isAvailable())
                .createdAt(menu.getCreatedAt())
                .updatedAt(menu.getUpdatedAt())
                .altText(menu.getAltText())
                .primaryImageSrc(menu.getPrimaryImageSrc())
                .supplierInfo(menu.getSupplierInfo())
                .build();
    }
}
