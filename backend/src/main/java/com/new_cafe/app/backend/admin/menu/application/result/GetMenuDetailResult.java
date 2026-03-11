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
    private Integer categoryId;
    private String categoryName;
    private boolean isAvailable;
    private boolean isSoldOut;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String altText;
    private String primaryImageSrc;
    private Integer costPrice;
    private String adminMemo;

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
                .isSoldOut(menu.isSoldOut())
                .createdAt(menu.getCreatedAt())
                .updatedAt(menu.getUpdatedAt())
                .altText(menu.getAltText())
                .primaryImageSrc(menu.getPrimaryImageSrc())
                .costPrice(menu.getCostPrice())
                .adminMemo(menu.getAdminMemo())
                .build();
    }
}
