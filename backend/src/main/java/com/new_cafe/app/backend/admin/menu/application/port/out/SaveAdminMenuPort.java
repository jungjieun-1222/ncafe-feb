package com.new_cafe.app.backend.admin.menu.application.port.out;

import com.new_cafe.app.backend.admin.menu.domain.AdminMenu;

public interface SaveAdminMenuPort {
    void save(AdminMenu menu);
    void delete(Long id);
}
