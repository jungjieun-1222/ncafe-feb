package com.new_cafe.app.backend.usermenu.adapter.out.persistence;

import com.new_cafe.app.backend.usermenu.adapter.out.persistence.entity.MenuImageEntity;
import com.new_cafe.app.backend.usermenu.adapter.out.persistence.repository.MenuImageRepository;
import com.new_cafe.app.backend.usermenu.application.port.out.LoadMenuImagePort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class MenuImagePersistenceAdapter implements LoadMenuImagePort {

    private final MenuImageRepository menuImageRepository;

    @Override
    public List<String> getImageUrlsByMenuId(Long menuId) {
        return menuImageRepository.findAllByMenuIdOrderBySortOrderAsc(menuId).stream()
                .map(MenuImageEntity::getSrcUrl)
                .collect(Collectors.toList());
    }

    @Override
    public List<MenuImageEntity> loadAllEntitiesByMenuId(Long menuId) {
        return menuImageRepository.findAllByMenuIdOrderBySortOrderAsc(menuId);
    }
}
