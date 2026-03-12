package com.new_cafe.app.backend.admin.menu.application.port.out;

import com.new_cafe.app.backend.admin.menu.domain.AdminMenu;
import java.util.List;
import java.util.Optional;

public interface LoadAdminMenuPort {
    List<AdminMenu> loadAllAdminMenusByCategoryIdAndSearchQuery(Integer categoryId, String searchQuery);
    Optional<AdminMenu> loadAdminMenuById(Long id);
    Optional<AdminMenu> loadAdminMenuBySlug(String slug);
}
