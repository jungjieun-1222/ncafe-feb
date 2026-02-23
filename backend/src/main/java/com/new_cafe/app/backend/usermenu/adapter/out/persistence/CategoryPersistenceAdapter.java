package com.new_cafe.app.backend.usermenu.adapter.out.persistence;

import com.new_cafe.app.backend.entity.Category;
import com.new_cafe.app.backend.repository.CategoryRepository;
import com.new_cafe.app.backend.usermenu.application.port.out.LoadCategoryPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CategoryPersistenceAdapter implements LoadCategoryPort {

    private final CategoryRepository categoryRepository;

    @Override
    public String getNameById(int categoryId) {
        return categoryRepository.findById((long) categoryId)
                .map(Category::getName)
                .orElse("Unknown");
    }
}
