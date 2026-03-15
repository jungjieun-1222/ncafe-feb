package com.new_cafe.app.backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.new_cafe.app.backend.entity.Category;
import com.new_cafe.app.backend.repository.CategoryRepository;

/**
 * CategoryService의 실제 구현체
 */
@Component
public class NewCategoryService implements CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Override
    public List<Category> getAll() {
        // 정렬 순서대로 가져오기
        return categoryRepository.findAll(org.springframework.data.domain.Sort.by(org.springframework.data.domain.Sort.Direction.ASC, "sortOrder"));
    }

    @Override
    public void reorder(List<Long> categoryIds) {
        for (int i = 0; i < categoryIds.size(); i++) {
            Long id = categoryIds.get(i);
            Category category = categoryRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));
            category.setSortOrder(i + 1);
            categoryRepository.save(category);
        }
    }
}
