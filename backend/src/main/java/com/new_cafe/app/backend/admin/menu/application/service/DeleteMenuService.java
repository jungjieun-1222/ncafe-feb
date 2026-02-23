package com.new_cafe.app.backend.admin.menu.application.service;

import com.new_cafe.app.backend.admin.menu.application.port.in.DeleteMenuUseCase;
import com.new_cafe.app.backend.admin.menu.application.port.out.SaveAdminMenuPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class DeleteMenuService implements DeleteMenuUseCase {

    private final SaveAdminMenuPort saveAdminMenuPort;

    @Override
    public void deleteMenu(Long id) {
        saveAdminMenuPort.delete(id);
    }
}
