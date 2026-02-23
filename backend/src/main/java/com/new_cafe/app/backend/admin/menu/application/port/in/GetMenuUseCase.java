package com.new_cafe.app.backend.admin.menu.application.port.in;

import com.new_cafe.app.backend.admin.menu.application.result.GetMenuDetailResult;
import com.new_cafe.app.backend.admin.menu.application.result.GetMenuListResult;

import java.util.List;

public interface GetMenuUseCase {
    List<GetMenuListResult> getAllMenus(Integer categoryId, String searchQuery);
    GetMenuDetailResult getMenu(Long id);
}
