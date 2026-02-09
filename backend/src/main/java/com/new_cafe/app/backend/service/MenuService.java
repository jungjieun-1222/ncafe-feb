package com.new_cafe.app.backend.service;

import com.new_cafe.app.backend.controller.dto.MenuListResponse;
import com.new_cafe.app.backend.controller.dto.MenuListRequest;
import com.new_cafe.app.backend.controller.dto.MenuCreateRequest;
import com.new_cafe.app.backend.controller.dto.MenuCreateResponse;
import com.new_cafe.app.backend.controller.dto.MenuUpdateRequest;
import com.new_cafe.app.backend.controller.dto.MenuUpdateResponse;
import com.new_cafe.app.backend.controller.dto.MenuDetailResponse;
import com.new_cafe.app.backend.controller.dto.MenuImageListResponse;

/**
 * 비즈니스 로직(서비스)의 명세서(약속)
 */
public interface MenuService {
    MenuListResponse getMenus(MenuListRequest request);

    MenuDetailResponse getMenu(Long id);

    MenuCreateResponse createMenu(MenuCreateRequest request);

    void deleteMenu(Long id);

    MenuUpdateResponse updateMenu(MenuUpdateRequest request);

    MenuImageListResponse getMenuImages(Long id);
}
