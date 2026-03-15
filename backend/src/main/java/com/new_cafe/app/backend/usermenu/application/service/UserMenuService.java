package com.new_cafe.app.backend.usermenu.application.service;

import com.new_cafe.app.backend.usermenu.application.port.in.BrowseMenuUseCase;
import com.new_cafe.app.backend.usermenu.application.port.out.LoadCategoryPort;
import com.new_cafe.app.backend.usermenu.application.port.out.LoadMenuImagePort;
import com.new_cafe.app.backend.usermenu.application.port.out.LoadUserMenuPort;
import com.new_cafe.app.backend.usermenu.application.result.UserMenuResult;
import com.new_cafe.app.backend.usermenu.domain.UserMenu;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserMenuService implements BrowseMenuUseCase {

    private final LoadUserMenuPort loadUserMenuPort;
    private final LoadCategoryPort loadCategoryPort;
    private final LoadMenuImagePort loadMenuImagePort;

    @Override
    public List<UserMenuResult> getAvailableMenus(Integer categoryId, String searchQuery, String sortBy) {
        return loadUserMenuPort.loadAllUserMenusByCategoryIdAndSearchQuery(categoryId, searchQuery, sortBy).stream()
                .peek(this::enrichUserMenu)
                .map(UserMenuResult::from)
                .collect(Collectors.toList());
    }

    @Override
    public UserMenuResult getMenuDetail(String slug) {
        UserMenu menu = loadUserMenuPort.loadUserMenuBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Menu not found or not available"));
        enrichUserMenu(menu);
        return UserMenuResult.from(menu);
    }

    private void enrichUserMenu(UserMenu menu) {
        menu.setCategoryName(loadCategoryPort.getNameById(menu.getCategoryId().intValue()));
        List<String> images = loadMenuImagePort.getImageUrlsByMenuId(menu.getId());
        menu.setImages(images);
        menu.setPrimaryImageSrc(images.isEmpty() ? "blank.png" : images.get(0));
    }
}
