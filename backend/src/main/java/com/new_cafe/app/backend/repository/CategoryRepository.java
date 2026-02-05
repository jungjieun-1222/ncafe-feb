package com.new_cafe.app.backend.repository;

import java.util.List;
import com.new_cafe.app.backend.entity.Category;

/**
 * 카테고리 데이터 접근을 위한 인터페이스
 */
public interface CategoryRepository {
    List<Category> findAll();

    Category findById(long id);

    void save(Category category);

    void update(Category category);

    void delete(long id);
}
