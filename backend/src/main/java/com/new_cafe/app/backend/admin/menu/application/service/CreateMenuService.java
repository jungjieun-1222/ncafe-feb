package com.new_cafe.app.backend.admin.menu.application.service;

import com.new_cafe.app.backend.admin.menu.application.command.CreateMenuCommand;
import com.new_cafe.app.backend.admin.menu.application.port.in.CreateMenuUseCase;
import com.new_cafe.app.backend.admin.menu.application.port.out.SaveAdminMenuPort;
import com.new_cafe.app.backend.admin.menu.domain.AdminMenu;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Transactional
public class CreateMenuService implements CreateMenuUseCase {

    private final SaveAdminMenuPort saveAdminMenuPort;

    @Override
    public void createMenu(CreateMenuCommand command) {
        AdminMenu menu = AdminMenu.builder()
                .korName(command.getKorName())
                .engName(command.getEngName())
                .description(command.getDescription())
                .price(command.getPrice())
                .categoryId(command.getCategoryId())
                .isAvailable(command.isAvailable())
                .isSoldOut(!command.isAvailable())
                .altText(command.getAltText())
                .costPrice(command.getCostPrice())
                .adminMemo(command.getAdminMemo())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        saveAdminMenuPort.save(menu);
    }
}
