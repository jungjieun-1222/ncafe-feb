package com.new_cafe.app.backend.usermenu.adapter.out.persistence;

import com.new_cafe.app.backend.usermenu.adapter.out.persistence.entity.UserMenuEntity;
import com.new_cafe.app.backend.usermenu.adapter.out.persistence.repository.UserMenuRepository;
import com.new_cafe.app.backend.usermenu.application.port.out.LoadUserMenuPort;
import com.new_cafe.app.backend.usermenu.domain.UserMenu;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class UserMenuPersistenceAdapter implements LoadUserMenuPort {

    private final UserMenuRepository userMenuRepository;

    @Override
    public List<UserMenu> loadAllUserMenusByCategoryIdAndSearchQuery(Integer categoryId, String searchQuery) {
        return userMenuRepository.findAllByCategoryIdAndSearchQuery(categoryId, searchQuery).stream()
                .map(this::mapToUserDomain)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<UserMenu> loadUserMenuById(Long id) {
        return userMenuRepository.findById(id).map(this::mapToUserDomain);
    }

    private UserMenu mapToUserDomain(UserMenuEntity entity) {
        return UserMenu.builder()
                .id(entity.getId())
                .korName(entity.getKorName())
                .engName(entity.getEngName())
                .description(entity.getDescription())
                .price(entity.getPrice() != null ? entity.getPrice() : 0)
                .categoryId(entity.getCategoryId() != null ? (long) entity.getCategoryId() : 0L)
                .isAvailable(entity.getIsAvailable() != null ? entity.getIsAvailable() : false)
                .allergyInfo(entity.getAllergyInfo())
                .build();
    }
}
