package com.new_cafe.app.backend.usermenu.application.result;

import com.new_cafe.app.backend.usermenu.domain.UserMenu;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UserMenuResult {
    private Long id;
    private String korName;
    private String engName;
    private String slug;
    private String description;
    private Integer price;
    private Long categoryId;
    private String categoryName;
    private String primaryImageSrc;
    private boolean isAvailable;
    private String allergyInfo;
    private java.util.List<String> images;
    private java.util.List<com.new_cafe.app.backend.cart.domain.Option> options;
    private java.util.List<String> curationTags;
    private Integer sortOrder;

    public static UserMenuResult from(UserMenu menu) {
        return UserMenuResult.builder()
                .id(menu.getId())
                .korName(menu.getKorName())
                .engName(menu.getEngName())
                .slug(menu.getSlug())
                .description(menu.getDescription())
                .price(menu.getPrice())
                .categoryId(menu.getCategoryId())
                .categoryName(menu.getCategoryName())
                .primaryImageSrc(menu.getPrimaryImageSrc())
                .isAvailable(menu.isAvailable())
                .allergyInfo(menu.getAllergyInfo())
                .images(menu.getImages())
                .options(menu.getOptions())
                .curationTags(menu.getCurationTags())
                .sortOrder(menu.getSortOrder())
                .build();
    }
}
