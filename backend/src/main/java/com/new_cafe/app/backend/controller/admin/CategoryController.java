package com.new_cafe.app.backend.controller.admin;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.new_cafe.app.backend.entity.Category;
import com.new_cafe.app.backend.service.CategoryService;

@RestController
@RequestMapping("/admin/categories")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @GetMapping
    public List<Category> categories() {
        return categoryService.getAll();
    }

    @GetMapping("/{id}")
    public Category detail(@PathVariable Long id) {
        return null; // TODO: Implement if needed
    }

    @PostMapping
    public void newCategory(@RequestBody Category category) {
        // TODO: Implement
    }

    @PutMapping("/{id}")
    public void editCategory(@PathVariable Long id, @RequestBody Category category) {
        // TODO: Implement
    }

    @DeleteMapping("/{id}")
    public void deleteCategory(@PathVariable Long id) {
        // TODO: Implement
    }

    @PutMapping("/reorder")
    public void reorder(@RequestBody List<Long> categoryIds) {
        categoryService.reorder(categoryIds);
    }
}