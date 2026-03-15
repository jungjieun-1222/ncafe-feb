package com.new_cafe.app.backend.usermenu.adapter.in.web.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UserMenuWebModel {
    private Long id;
    private String korName;
    private String engName;
    private String slug;
    private String description;
    private int price;
    private int categoryId;
    private String categoryName;
    private String imageSrc;
    @JsonProperty("isAvailable")
    private boolean isAvailable;
    private String allergyInfo;
    private java.util.List<String> images;
    private java.util.List<com.new_cafe.app.backend.cart.domain.Option> options;
    private java.util.List<String> curationTags;
    private Integer sortOrder;
}
