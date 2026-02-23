package com.new_cafe.app.backend.repository;

import com.new_cafe.app.backend.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {
}
