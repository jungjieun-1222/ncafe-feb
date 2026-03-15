package com.new_cafe.app.backend.admin.menu.application.result;

import com.new_cafe.app.backend.admin.menu.domain.AdminMenu;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class GetMenuListResult {
    private Long id;
    private String korName;
    private String engName;
    private String slug;
    private Integer price;
    private Integer categoryId;
    private String categoryName;
    private boolean isAvailable;
    private boolean isSoldOut;
    private String primaryImageSrc;
    private String description;
    private String altText;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private java.util.List<String> curationTags;
    private Integer sortOrder;

    public static GetMenuListResult from(AdminMenu menu) {
        return GetMenuListResult.builder()
                .id(menu.getId())
                .korName(menu.getKorName())
                .engName(menu.getEngName())
                .slug(menu.getSlug())
                .price(menu.getPrice())
                .categoryId(menu.getCategoryId())
                .categoryName(menu.getCategoryName())
                .isAvailable(menu.isAvailable())
                .isSoldOut(menu.isSoldOut())
                .primaryImageSrc(menu.getPrimaryImageSrc())
                .description(menu.getDescription())
                .altText(menu.getAltText())
                .createdAt(menu.getCreatedAt())
                .updatedAt(menu.getUpdatedAt())
                .curationTags(menu.getCurationTags())
                .sortOrder(menu.getSortOrder())
                .build();
    }
}
