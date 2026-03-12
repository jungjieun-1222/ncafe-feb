package com.new_cafe.app.backend.admin.menu.application.port.in;

import com.new_cafe.app.backend.admin.menu.application.result.GetMenuDetailResult;
import com.new_cafe.app.backend.admin.menu.application.result.GetMenuListResult;

import java.util.List;

public interface GetMenuUseCase {
    List<GetMenuListResult> getAllMenus(Integer categoryId, String searchQuery);
    GetMenuDetailResult getMenu(Long id);
    GetMenuDetailResult getMenuBySlug(String slug);
    List<com.new_cafe.app.backend.usermenu.adapter.out.persistence.entity.MenuImageEntity> getMenuImages(Long id);
}
