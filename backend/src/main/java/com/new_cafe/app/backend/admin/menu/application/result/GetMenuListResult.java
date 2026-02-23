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
    private Integer price;
    private Long categoryId;
    private String categoryName;
    private boolean isAvailable;
    private String primaryImageSrc;

    public static GetMenuListResult from(AdminMenu menu) {
        return GetMenuListResult.builder()
                .id(menu.getId())
                .korName(menu.getKorName())
                .engName(menu.getEngName())
                .price(menu.getPrice())
                .categoryId(menu.getCategoryId())
                .categoryName(menu.getCategoryName())
                .isAvailable(menu.isAvailable())
                .primaryImageSrc(menu.getPrimaryImageSrc())
                .build();
    }
}
