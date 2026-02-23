package com.new_cafe.app.backend.admin.menu.application.command;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UpdateMenuCommand {
    private Long id;
    private String korName;
    private String engName;
    private String description;
    private int price;
    private int categoryId;
    private boolean isAvailable;
    private String altText;
    private Integer costPrice;
    private String adminMemo;
}
