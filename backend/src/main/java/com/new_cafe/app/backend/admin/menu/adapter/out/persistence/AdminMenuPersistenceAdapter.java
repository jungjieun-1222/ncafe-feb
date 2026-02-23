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

@Component
@RequiredArgsConstructor
public class AdminMenuPersistenceAdapter implements LoadAdminMenuPort, SaveAdminMenuPort {

    private final AdminMenuRepository adminMenuRepository;

    @Override
    public void save(AdminMenu menu) {
        AdminMenuEntity entity = AdminMenuEntity.builder()
                .id(menu.getId())
                .korName(menu.getKorName())
                .engName(menu.getEngName())
                .description(menu.getDescription())
                .price(menu.getPrice())
                .categoryId(menu.getCategoryId() != null ? menu.getCategoryId().intValue() : 0)
                .isAvailable(menu.isAvailable())
                .createdAt(menu.getCreatedAt())
                .updatedAt(menu.getUpdatedAt())
                .altText(menu.getAltText())
                .build();
        adminMenuRepository.save(entity);
    }

    @Override
    public void delete(Long id) {
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

    private AdminMenu mapToAdminDomain(AdminMenuEntity entity) {
        return AdminMenu.builder()
                .id(entity.getId())
                .korName(entity.getKorName())
                .engName(entity.getEngName())
                .description(entity.getDescription())
                .price(entity.getPrice() != null ? entity.getPrice() : 0)
                .categoryId(entity.getCategoryId() != null ? (long) entity.getCategoryId() : 0L)
                .isAvailable(entity.getIsAvailable() != null ? entity.getIsAvailable() : false)
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .altText(entity.getAltText())
                .build();
    }
}
