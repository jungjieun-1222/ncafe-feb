package com.new_cafe.app.backend.admin.menu.application.port.in;

import com.new_cafe.app.backend.admin.menu.application.command.CreateMenuCommand;

public interface CreateMenuUseCase {
    void createMenu(CreateMenuCommand command);
}
