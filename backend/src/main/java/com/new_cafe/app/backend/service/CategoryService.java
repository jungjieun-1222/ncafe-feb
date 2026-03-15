package com.new_cafe.app.backend.service;

import java.util.List;
import com.new_cafe.app.backend.entity.Category;

/**
 * 카테고리 비즈니스 로직(서비스)의 인터페이스
 */
public interface CategoryService {

    /**
     * 모든 카테고리 목록을 가져오는 서비스 기능
     */
    public List<Category> getAll();

    /**
     * 카테고리 순서를 재정의하는 서비스 기능
     */
    public void reorder(List<Long> categoryIds);

}
