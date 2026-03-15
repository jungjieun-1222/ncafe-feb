package com.new_cafe.app.backend.admin.menu.application.service;

import com.new_cafe.app.backend.admin.menu.adapter.out.persistence.entity.AdminMenuEntity;
import com.new_cafe.app.backend.admin.menu.adapter.out.persistence.repository.AdminMenuRepository;
import com.new_cafe.app.backend.admin.menu.application.port.in.UpdateMenuOptionsUseCase;
import com.new_cafe.app.backend.cart.adapter.out.persistence.entity.MenuOptionEntity;
import com.new_cafe.app.backend.cart.adapter.out.persistence.repository.MenuOptionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UpdateMenuOptionsService implements UpdateMenuOptionsUseCase {

    private final AdminMenuRepository adminMenuRepository;
    private final MenuOptionRepository menuOptionRepository;

    @Override
    @Transactional
    public void addOptionToMenu(Long menuId, Long optionId) {
        AdminMenuEntity menu = adminMenuRepository.findById(menuId)
                .orElseThrow(() -> new IllegalArgumentException("Menu not found: " + menuId));
        MenuOptionEntity option = menuOptionRepository.findById(optionId)
                .orElseThrow(() -> new IllegalArgumentException("Option not found: " + optionId));

        if (!menu.getOptions().contains(option)) {
            menu.getOptions().add(option);
            adminMenuRepository.save(menu);
        }
    }

    @Override
    @Transactional
    public void removeOptionFromMenu(Long menuId, Long optionId) {
        AdminMenuEntity menu = adminMenuRepository.findById(menuId)
                .orElseThrow(() -> new IllegalArgumentException("Menu not found: " + menuId));
        
        menu.getOptions().removeIf(option -> option.getId().equals(optionId));
        adminMenuRepository.save(menu);
    }
}
