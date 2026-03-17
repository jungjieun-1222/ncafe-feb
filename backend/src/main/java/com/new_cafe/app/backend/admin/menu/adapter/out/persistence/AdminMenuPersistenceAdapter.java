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
                .options(menu.getOptions().stream()
                        .map(o -> com.new_cafe.app.backend.cart.adapter.out.persistence.entity.MenuOptionEntity.builder()
                                .id(o.getId())
                                .name(o.getName())
                                .value(o.getValue())
                                .price(o.getPrice())
                                .build())
                        .collect(Collectors.toList()))
                .curationTags(new java.util.ArrayList<>(menu.getCurationTags()))
                .sortOrder(menu.getSortOrder())
                .build();
        AdminMenuEntity savedEntity = adminMenuRepository.save(entity);

        // Handle Image
        if (menu.getPrimaryImageSrc() != null && !menu.getPrimaryImageSrc().isEmpty() && !menu.getPrimaryImageSrc().equals("blank.png")) {
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
    public List<AdminMenu> loadAllAdminMenusByCategoryIdAndSearchQuery(Integer categoryId, String searchQuery, String sortBy) {
        // 기본 데이터 조회 (DB에서는 필터링만 수행)
        List<AdminMenuEntity> entities = adminMenuRepository.findAllByCategoryIdAndSearchQuery(
                categoryId, searchQuery, org.springframework.data.domain.Sort.unsorted());
        
        java.util.stream.Stream<AdminMenuEntity> stream = entities.stream();
        
        // 정렬 및 필터링 로직
        if ("profit".equalsIgnoreCase(sortBy)) {
            // 수익률 높은 순 (판매가 - 원가)
            stream = stream.sorted((e1, e2) -> {
                int m1 = (e1.getPrice() != null ? e1.getPrice() : 0) - (e1.getCostPrice() != null ? e1.getCostPrice() : 0);
                int m2 = (e2.getPrice() != null ? e2.getPrice() : 0) - (e2.getCostPrice() != null ? e2.getCostPrice() : 0);
                return Integer.compare(m2, m1);
            });
        } else if ("modified".equalsIgnoreCase(sortBy)) {
            // 수정일 순 (최근 수정된 순)
            stream = stream.sorted(java.util.Comparator.comparing(
                    AdminMenuEntity::getUpdatedAt, java.util.Comparator.nullsLast(java.util.Comparator.reverseOrder())));
        } else if ("unavailable".equalsIgnoreCase(sortBy)) {
            // 판매 중지 메뉴 (필터링)
            stream = stream.filter(e -> e.getIsAvailable() != null && !e.getIsAvailable());
        } else if ("latest".equalsIgnoreCase(sortBy)) {
            // 최신순 (생성일 역순)
            stream = stream.sorted(java.util.Comparator.comparing(
                    AdminMenuEntity::getCreatedAt, java.util.Comparator.nullsLast(java.util.Comparator.reverseOrder())));
        } else {
            // 기본 정렬: 정렬 순서(sortOrder) 오름차순, 이후 ID 역순
            stream = stream.sorted((e1, e2) -> {
                int s1 = e1.getSortOrder() != null ? e1.getSortOrder() : Integer.MAX_VALUE;
                int s2 = e2.getSortOrder() != null ? e2.getSortOrder() : Integer.MAX_VALUE;
                if (s1 != s2) return Integer.compare(s1, s2);
                return Long.compare(e2.getId(), e1.getId());
            });
        }

        return stream
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
                .options(entity.getOptions().stream()
                        .map(o -> com.new_cafe.app.backend.cart.domain.Option.builder()
                                .id(o.getId())
                                .name(o.getName())
                                .value(o.getValue())
                                .price(o.getPrice())
                                .build())
                        .collect(java.util.stream.Collectors.toList()))
                .curationTags(new java.util.ArrayList<>(entity.getCurationTags()))
                .sortOrder(entity.getSortOrder())
                .build();
    }
}
