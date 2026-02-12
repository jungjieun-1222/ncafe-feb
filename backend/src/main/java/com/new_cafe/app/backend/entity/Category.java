package com.new_cafe.app.backend.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Builder;

/**
 * 카테고리 정보를 담는 엔티티 클래스
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Category {
    private Long id;
    private String name;
    private String icon;
    private int sortOrder;
}
