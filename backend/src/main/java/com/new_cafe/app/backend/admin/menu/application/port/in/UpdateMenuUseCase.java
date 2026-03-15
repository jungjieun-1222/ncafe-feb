package com.new_cafe.app.backend.admin.menu.application.port.in;

import com.new_cafe.app.backend.admin.menu.application.command.UpdateMenuCommand;

public interface UpdateMenuUseCase {
    void updateMenu(UpdateMenuCommand command);
    void updateMenuAvailability(Long id, boolean isAvailable);
    void reorderMenus(java.util.List<Long> menuIds);
}
