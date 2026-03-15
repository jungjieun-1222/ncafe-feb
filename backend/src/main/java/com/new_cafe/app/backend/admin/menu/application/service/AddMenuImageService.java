package com.new_cafe.app.backend.admin.menu.application.service;

import com.new_cafe.app.backend.admin.menu.application.port.in.AddMenuImageUseCase;
import com.new_cafe.app.backend.usermenu.adapter.out.persistence.entity.MenuImageEntity;
import com.new_cafe.app.backend.usermenu.adapter.out.persistence.repository.MenuImageRepository;
import lombok.RequiredArgsConstructor;
import com.new_cafe.app.backend.common.storage.application.port.in.FileStorageUseCase;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class AddMenuImageService implements AddMenuImageUseCase {

    private final MenuImageRepository menuImageRepository;
    private final FileStorageUseCase fileStorageUseCase;

    @Override
    public void addImage(Long menuId, String srcUrl, String altText) {
        List<MenuImageEntity> existing = menuImageRepository.findAllByMenuIdOrderBySortOrderAsc(menuId);
        int nextSortOrder = existing.size() + 1;

        MenuImageEntity entity = MenuImageEntity.builder()
                .menuId(menuId)
                .srcUrl(srcUrl)
                .altText(altText)
                .sortOrder(nextSortOrder)
                .build();
        
        menuImageRepository.save(entity);
    }

    @Override
    public void deleteImage(Long imageId) {
        menuImageRepository.findById(imageId).ifPresent(image -> {
            fileStorageUseCase.deleteFile(image.getSrcUrl());
            menuImageRepository.deleteById(imageId);
        });
    }

    @Override
    public void setPrimaryImage(Long menuId, Long imageId) {
        List<MenuImageEntity> images = menuImageRepository.findAllByMenuIdOrderBySortOrderAsc(menuId);
        int order = 2; // Start from 2 for non-primary images
        
        for (MenuImageEntity img : images) {
            if (img.getId().equals(imageId)) {
                img.setSortOrder(1); // Primary image gets sortOrder 1
            } else {
                img.setSortOrder(order++);
            }
        }
        menuImageRepository.saveAll(images);
    }
}
