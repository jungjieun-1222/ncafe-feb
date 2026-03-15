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
                .slug(command.getSlug())
                .description(command.getDescription())
                .price(command.getPrice())
                .categoryId(command.getCategoryId())
                .isAvailable(command.isAvailable())
                .isSoldOut(!command.isAvailable())
                .altText(command.getAltText())
                .costPrice(command.getCostPrice())
                .adminMemo(command.getAdminMemo())
                .primaryImageSrc(command.getImageSrc())
                .createdAt(existingMenu.getCreatedAt())
                .updatedAt(LocalDateTime.now())
                .options(existingMenu.getOptions())
                .curationTags(command.getCurationTags())
                .sortOrder(command.getSortOrder())
                .build();
        saveAdminMenuPort.save(updatedMenu);
    }

    @Override
    public void updateMenuAvailability(Long id, boolean isAvailable) {
        AdminMenu existingMenu = loadAdminMenuPort.loadAdminMenuById(id)
                .orElseThrow(() -> new RuntimeException("Menu not found with id: " + id));

        existingMenu.setAvailable(isAvailable);
        existingMenu.setSoldOut(!isAvailable);
        existingMenu.setUpdatedAt(LocalDateTime.now());
        
        saveAdminMenuPort.save(existingMenu);
    }

    @Override
    public void reorderMenus(java.util.List<Long> menuIds) {
        for (int i = 0; i < menuIds.size(); i++) {
            Long id = menuIds.get(i);
            AdminMenu menu = loadAdminMenuPort.loadAdminMenuById(id)
                    .orElseThrow(() -> new RuntimeException("Menu not found with id: " + id));
            menu.setSortOrder(i + 1);
            saveAdminMenuPort.save(menu);
        }
    }
}
