package com.new_cafe.app.backend.service;

import java.util.List;
import org.springframework.stereotype.Service;
import com.new_cafe.app.backend.entity.Menu;
import com.new_cafe.app.backend.entity.MenuImage;
import com.new_cafe.app.backend.repository.CategoryRepository;
import com.new_cafe.app.backend.repository.MenuRepository;
import com.new_cafe.app.backend.repository.MenuImageRepository;
import com.new_cafe.app.backend.controller.dto.MenuResponse;
import com.new_cafe.app.backend.controller.dto.MenuListRequest;
import com.new_cafe.app.backend.controller.dto.MenuListResponse;
import com.new_cafe.app.backend.controller.dto.MenuDetailResponse;
import com.new_cafe.app.backend.controller.dto.MenuCreateResponse;
import com.new_cafe.app.backend.controller.dto.MenuUpdateResponse;
import com.new_cafe.app.backend.controller.dto.MenuUpdateRequest;
import com.new_cafe.app.backend.controller.dto.MenuCreateRequest;
import com.new_cafe.app.backend.controller.dto.MenuImageListResponse;
import com.new_cafe.app.backend.controller.dto.MenuImageResponse;

/**
 * MenuService의 실제 구현체
 */
@Service
public class NewMenuService implements MenuService {

    private final CategoryRepository categoryRepository;
    private final MenuRepository menuRepository;
    private final MenuImageRepository menuImageRepository;

    public NewMenuService(CategoryRepository categoryRepository,
            MenuRepository menuRepository,
            MenuImageRepository menuImageRepository) {
        this.categoryRepository = categoryRepository;
        this.menuRepository = menuRepository;
        this.menuImageRepository = menuImageRepository;
    }

    @Override
    public MenuListResponse getMenus(MenuListRequest request) {

        Integer categoryId = request.getCategoryId();
        String searchQuery = request.getSearchQuery();

        // Menu <---->MenuResponse ---->MenuListResponse
        List<Menu> menus = menuRepository.findAllByCategoryIdAndSearchQuery(categoryId, searchQuery);
        List<MenuResponse> menuResponses = menus
                .stream()
                .map(menu -> {
                    String categoryName = categoryRepository
                            .findById(menu.getCategoryId()).getName();
                    List<MenuImage> images = menuImageRepository.findAllByMenuId(menu.getId());
                    // images의 개수가 0개라면 placeholder 사용하도록하고
                    String imageSrc = "blank.png";
                    // images의 개수가 1개라면 SrcUrl을 사용하도록하고
                    if (images.size() > 0) {
                        imageSrc = images.get(0).getSrcUrl();
                    }

                    return MenuResponse.builder()
                            .id(menu.getId())
                            .korName(menu.getKorName())
                            .engName(menu.getEngName())
                            .description(menu.getDescription())
                            .price(menu.getPrice())
                            .categoryName(categoryName)
                            .imageSrc(imageSrc)
                            .isAvailable(menu.isAvailable())
                            .createdAt(menu.getCreatedAt())
                            .updatedAt(menu.getUpdatedAt())
                            .build();
                })
                .toList();

        return MenuListResponse.builder()
                .menus(menuResponses)
                .total(100)
                .build();
    }

    @Override
    public MenuDetailResponse getMenu(Long id) {
        Menu menu = menuRepository.findById(id).orElseThrow(() -> new RuntimeException("Menu not found"));

        String categoryName = categoryRepository.findById(menu.getCategoryId()).getName();

        return MenuDetailResponse.builder()
                .id(menu.getId())
                .korName(menu.getKorName())
                .engName(menu.getEngName())
                .description(menu.getDescription())
                .price(menu.getPrice())
                .categoryId(menu.getCategoryId())
                .categoryName(categoryName)
                .isAvailable(menu.isAvailable())
                .createdAt(menu.getCreatedAt())
                .updatedAt(menu.getUpdatedAt())
                .build();
    }

    @Override
    public MenuCreateResponse createMenu(MenuCreateRequest request) {
        throw new UnsupportedOperationException("Unimplemented method 'createMenu'");
    }

    @Override
    public void deleteMenu(Long id) {
        throw new UnsupportedOperationException("Unimplemented method 'deleteMenu'");
    }

    @Override
    public MenuUpdateResponse updateMenu(MenuUpdateRequest request) {
        throw new UnsupportedOperationException("Unimplemented method 'updateMenu'");
    }

    @Override
    public MenuImageListResponse getMenuImages(Long id) {
        // 부모 메뉴 정보를 먼저 조회 (altText를 가져오기 위함)
        Menu menu = menuRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Menu not found"));

        List<MenuImage> menuImages = menuImageRepository.findAllByMenuId(id);
        List<MenuImageResponse> menuImageResponses = menuImages
                .stream()
                .map(menuImage -> MenuImageResponse.builder()
                        .id(menuImage.getId())
                        .menuId(menuImage.getMenuId())
                        .srcUrl(menuImage.getSrcUrl())
                        .altText(menu.getAltText()) // 부모 Menu의 altText 사용
                        .sortOrder(menuImage.getSortOrder())
                        .build())
                .toList();

        return MenuImageListResponse.builder()
                .menuImages(menuImageResponses)
                .build();
    }
}
