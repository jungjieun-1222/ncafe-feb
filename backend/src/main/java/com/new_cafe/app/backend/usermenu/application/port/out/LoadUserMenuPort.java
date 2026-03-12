package com.new_cafe.app.backend.usermenu.application.port.out;

import com.new_cafe.app.backend.usermenu.domain.UserMenu;
import java.util.List;
import java.util.Optional;

public interface LoadUserMenuPort {
    List<UserMenu> loadAllUserMenusByCategoryIdAndSearchQuery(Integer categoryId, String searchQuery);
    Optional<UserMenu> loadUserMenuBySlug(String slug);
}
