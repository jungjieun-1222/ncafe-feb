package com.new_cafe.app.backend.admin.menu.application.service;

import com.new_cafe.app.backend.admin.menu.application.command.UpdateMenuCommand;
import com.new_cafe.app.backend.admin.menu.application.port.in.UpdateMenuUseCase;
import com.new_cafe.app.backend.admin.menu.application.port.out.LoadAdminMenuPort;
import com.new_cafe.app.backend.admin.menu.application.port.out.SaveAdminMenuPort;
import com.new_cafe.app.backend.admin.menu.domain.AdminMenu;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Transactional
public class UpdateMenuService implements UpdateMenuUseCase {

    private final LoadAdminMenuPort loadAdminMenuPort;
    private final SaveAdminMenuPort saveAdminMenuPort;

    @Override
    public void updateMenu(UpdateMenuCommand command) {
        AdminMenu existingMenu = loadAdminMenuPort.loadAdminMenuById(command.getId())
                .orElseThrow(() -> new RuntimeException("Menu not found"));

        AdminMenu updatedMenu = AdminMenu.builder()
                .id(existingMenu.getId())
                .korName(command.getKorName())
                .engName(command.getEngName())
                .description(command.getDescription())
                .price(command.getPrice())
                .categoryId((long) command.getCategoryId())
                .isAvailable(command.isAvailable())
                .altText(command.getAltText())
                .createdAt(existingMenu.getCreatedAt())
                .updatedAt(LocalDateTime.now())
                .build();
        saveAdminMenuPort.save(updatedMenu);
    }
}
