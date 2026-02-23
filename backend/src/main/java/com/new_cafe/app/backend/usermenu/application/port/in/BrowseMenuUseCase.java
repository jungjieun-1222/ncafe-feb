package com.new_cafe.app.backend.usermenu.application.port.in;

import com.new_cafe.app.backend.usermenu.application.result.UserMenuResult;
import java.util.List;

public interface BrowseMenuUseCase {
    List<UserMenuResult> getAvailableMenus(Integer categoryId, String searchQuery);
    UserMenuResult getMenuDetail(Long id);
}
