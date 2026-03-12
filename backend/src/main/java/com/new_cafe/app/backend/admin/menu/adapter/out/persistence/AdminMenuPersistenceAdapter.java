package com.new_cafe.app.backend.admin.menu.adapter.out.persistence;

import com.new_cafe.app.backend.admin.menu.adapter.out.persistence.entity.AdminMenuEntity;
import com.new_cafe.app.backend.admin.menu.adapter.out.persistence.repository.AdminMenuRepository;
import com.new_cafe.app.backend.admin.menu.application.port.out.LoadAdminMenuPort;
import com.new_cafe.app.backend.admin.menu.application.port.out.SaveAdminMenuPort;
import com.new_cafe.app.backend.admin.menu.domain.AdminMenu;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import com.new_cafe.app.backend.usermenu.adapter.out.persistence.repository.MenuImageRepository;
import com.new_cafe.app.backend.common.storage.application.port.in.FileStorageUseCase;

@Component
@RequiredArgsConstructor
public class AdminMenuPersistenceAdapter implements LoadAdminMenuPort, SaveAdminMenuPort {
    private final AdminMenuRepository adminMenuRepository;
    private final MenuImageRepository menuImageRepository;
    private final FileStorageUseCase fileStorageUseCase;

    @Override
    public void save(AdminMenu menu) {
        AdminMenuEntity entity = AdminMenuEntity.builder()
                .id(menu.getId())
                .korName(menu.getKorName())
                .engName(menu.getEngName())
                .slug(menu.getSlug())
                .description(menu.getDescription())
                .price(menu.getPrice())
                .categoryId(menu.getCategoryId())
                .isAvailable(menu.isAvailable())
                .createdAt(menu.getCreatedAt())
                .updatedAt(menu.getUpdatedAt())
                .altText(menu.getAltText())
                .costPrice(menu.getCostPrice())
                .adminMemo(menu.getAdminMemo())
                .build();
        AdminMenuEntity savedEntity = adminMenuRepository.save(entity);

        // Handle Image
        if (menu.getPrimaryImageSrc() != null && !menu.getPrimaryImageSrc().isEmpty()) {
            var existingImages = menuImageRepository.findAllByMenuIdOrderBySortOrderAsc(savedEntity.getId());
            if (existingImages.isEmpty()) {
                menuImageRepository.save(com.new_cafe.app.backend.usermenu.adapter.out.persistence.entity.MenuImageEntity.builder()
                        .menuId(savedEntity.getId())
                        .srcUrl(menu.getPrimaryImageSrc())
                        .altText(menu.getKorName())
                        .sortOrder(1)
                        .build());
            } else {
                var primary = existingImages.get(0);
                primary.setSrcUrl(menu.getPrimaryImageSrc());
                menuImageRepository.save(primary);
            }
        }
    }

    @Override
    public void delete(Long id) {
        // First delete physical files and records from menu_images
        var images = menuImageRepository.findAllByMenuIdOrderBySortOrderAsc(id);
        if (!images.isEmpty()) {
            for (var image : images) {
                fileStorageUseCase.deleteFile(image.getSrcUrl());
            }
            menuImageRepository.deleteAll(images);
        }
        // Then delete menu record
        adminMenuRepository.deleteById(id);
    }

    @Override
    public List<AdminMenu> loadAllAdminMenusByCategoryIdAndSearchQuery(Integer categoryId, String searchQuery) {
        return adminMenuRepository.findAllByCategoryIdAndSearchQuery(categoryId, searchQuery).stream()
                .map(this::mapToAdminDomain)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<AdminMenu> loadAdminMenuById(Long id) {
        return adminMenuRepository.findById(id).map(this::mapToAdminDomain);
    }

    @Override
    public Optional<AdminMenu> loadAdminMenuBySlug(String slug) {
        return adminMenuRepository.findBySlug(slug).map(this::mapToAdminDomain);
    }

    private AdminMenu mapToAdminDomain(AdminMenuEntity entity) {
        boolean available = entity.getIsAvailable() != null ? entity.getIsAvailable() : false;
        return AdminMenu.builder()
                .id(entity.getId())
                .korName(entity.getKorName())
                .engName(entity.getEngName())
                .slug(entity.getSlug())
                .description(entity.getDescription())
                .price(entity.getPrice() != null ? entity.getPrice() : 0)
                .categoryId(entity.getCategoryId())
                .isAvailable(available)
                .isSoldOut(!available) // Derive isSoldOut
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .altText(entity.getAltText())
                .costPrice(entity.getCostPrice())
                .adminMemo(entity.getAdminMemo())
                .build();
    }
}
