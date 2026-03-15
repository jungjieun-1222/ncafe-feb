package com.new_cafe.app.backend.admin.menu.application.service;

import com.new_cafe.app.backend.admin.menu.application.port.in.GetMenuUseCase;
import com.new_cafe.app.backend.admin.menu.application.port.out.LoadAdminMenuPort;
import com.new_cafe.app.backend.admin.menu.application.result.GetMenuDetailResult;
import com.new_cafe.app.backend.admin.menu.application.result.GetMenuListResult;
import com.new_cafe.app.backend.admin.menu.domain.AdminMenu;
import com.new_cafe.app.backend.usermenu.application.port.out.LoadCategoryPort;
import com.new_cafe.app.backend.usermenu.application.port.out.LoadMenuImagePort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class GetMenuService implements GetMenuUseCase {

    private final LoadAdminMenuPort loadAdminMenuPort;
    private final LoadCategoryPort loadCategoryPort;
    private final LoadMenuImagePort loadMenuImagePort;

    @Override
    public List<GetMenuListResult> getAllMenus(Integer categoryId, String searchQuery, String sortBy) {
        return loadAdminMenuPort.loadAllAdminMenusByCategoryIdAndSearchQuery(categoryId, searchQuery, sortBy).stream()
                .peek(this::enrichAdminMenu)
                .map(GetMenuListResult::from)
                .collect(Collectors.toList());
    }

    @Override
    public GetMenuDetailResult getMenu(Long id) {
        AdminMenu menu = loadAdminMenuPort.loadAdminMenuById(id)
                .orElseThrow(() -> new RuntimeException("Menu not found"));
        enrichAdminMenu(menu);
        return GetMenuDetailResult.from(menu);
    }

    @Override
    public GetMenuDetailResult getMenuBySlug(String slug) {
        java.util.Optional<AdminMenu> menuOpt = loadAdminMenuPort.loadAdminMenuBySlug(slug);
        
        // If not found by slug, try lookup by ID for better robustness (frontend might still send ID)
        if (menuOpt.isEmpty() && slug.matches("\\d+")) {
            try {
                menuOpt = loadAdminMenuPort.loadAdminMenuById(Long.parseLong(slug));
            } catch (NumberFormatException ignored) {}
        }
        
        AdminMenu menu = menuOpt.orElseThrow(() -> new RuntimeException("Menu not found: " + slug));
        enrichAdminMenu(menu);
        return GetMenuDetailResult.from(menu);
    }

    @Override
    public List<com.new_cafe.app.backend.usermenu.adapter.out.persistence.entity.MenuImageEntity> getMenuImages(Long id) {
        return loadMenuImagePort.loadAllEntitiesByMenuId(id);
    }

    private void enrichAdminMenu(AdminMenu menu) {
        if (menu.getCategoryId() != null) {
            menu.setCategoryName(loadCategoryPort.getNameById(menu.getCategoryId().intValue()));
        } else {
            menu.setCategoryName("미분류");
        }
        List<String> images = loadMenuImagePort.getImageUrlsByMenuId(menu.getId());
        menu.setPrimaryImageSrc(images.isEmpty() ? "blank.png" : images.get(0));
    }
}
