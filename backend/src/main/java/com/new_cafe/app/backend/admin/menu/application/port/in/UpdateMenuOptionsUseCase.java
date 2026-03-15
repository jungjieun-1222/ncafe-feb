package com.new_cafe.app.backend.admin.menu.application.port.in;

public interface UpdateMenuOptionsUseCase {
    void addOptionToMenu(Long menuId, Long optionId);
    void removeOptionFromMenu(Long menuId, Long optionId);
}
