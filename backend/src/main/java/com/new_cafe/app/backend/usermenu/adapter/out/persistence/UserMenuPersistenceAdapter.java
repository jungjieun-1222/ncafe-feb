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
import java.util.stream.Stream;

@Component
@RequiredArgsConstructor
public class UserMenuPersistenceAdapter implements LoadUserMenuPort {

    private final UserMenuRepository userMenuRepository;

    @Override
    public List<UserMenu> loadAllUserMenusByCategoryIdAndSearchQuery(Integer categoryId, String searchQuery, String sortBy) {
        List<UserMenuEntity> entities = userMenuRepository.findAllByCategoryIdAndSearchQuery(categoryId, searchQuery);
        
        // Dynamic sorting in memory for simplicity, or we could use Specification/Sort
        Stream<UserMenuEntity> stream = entities.stream();
        
        if ("sales".equalsIgnoreCase(sortBy)) {
            // 판매량순: 현재는 추천 태그(curationTags)가 있는 메뉴를 상단에 배치하고 나머지는 ID 역순으로 정렬 (인기 메뉴 대용)
            stream = stream.sorted((e1, e2) -> {
                int t1 = (e1.getCurationTags() != null && !e1.getCurationTags().isEmpty()) ? 1 : 0;
                int t2 = (e2.getCurationTags() != null && !e2.getCurationTags().isEmpty()) ? 1 : 0;
                if (t1 != t2) return Integer.compare(t2, t1);
                return Long.compare(e2.getId(), e1.getId());
            });
        } else if ("price_low".equalsIgnoreCase(sortBy)) {
            // 가격 낮은 순: 가격 오름차순 정렬
            stream = stream.sorted(java.util.Comparator.comparing(e -> e.getPrice() != null ? e.getPrice() : 0));
        } else if ("latest".equalsIgnoreCase(sortBy)) {
            // 최신순: ID 역순 정렬
            stream = stream.sorted(java.util.Comparator.comparing(UserMenuEntity::getId).reversed());
        } else {
            // 기본 정렬: 관리자가 설정한 정렬 순서(sort_order) 오름차순, 이후 ID 역순
            stream = stream.sorted((e1, e2) -> {
                int s1 = e1.getSortOrder() != null ? e1.getSortOrder() : Integer.MAX_VALUE;
                int s2 = e2.getSortOrder() != null ? e2.getSortOrder() : Integer.MAX_VALUE;
                if (s1 != s2) return Integer.compare(s1, s2);
                return Long.compare(e2.getId(), e1.getId());
            });
        }

        return stream
                .map(this::mapToUserDomain)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<UserMenu> loadUserMenuBySlug(String slug) {
        return userMenuRepository.findBySlug(slug).map(this::mapToUserDomain);
    }

    private UserMenu mapToUserDomain(UserMenuEntity entity) {
        return UserMenu.builder()
                .id(entity.getId())
                .korName(entity.getKorName())
                .engName(entity.getEngName())
                .slug(entity.getSlug())
                .description(entity.getDescription())
                .price(entity.getPrice() != null ? entity.getPrice() : 0)
                .categoryId(entity.getCategoryId() != null ? (long) entity.getCategoryId() : 0L)
                .isAvailable(entity.getIsAvailable() != null ? entity.getIsAvailable() : false)
                .allergyInfo(entity.getAllergyInfo())
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
