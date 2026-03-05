package com.new_cafe.app.backend.usermenu.adapter.in.web;

import com.new_cafe.app.backend.usermenu.adapter.in.web.dto.UserMenuWebModel;
import com.new_cafe.app.backend.usermenu.application.port.in.BrowseMenuUseCase;
import com.new_cafe.app.backend.usermenu.application.result.UserMenuResult;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/menus")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class UserMenuController {

    private final BrowseMenuUseCase browseMenuUseCase;

    @GetMapping
    public List<UserMenuWebModel> getAvailableMenus(
            @RequestParam(required = false) Integer categoryId,
            @RequestParam(required = false) String searchQuery) {
        
        return browseMenuUseCase.getAvailableMenus(categoryId, searchQuery).stream()
                .map(this::mapToWebModel)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public UserMenuWebModel getMenuDetail(@PathVariable Long id) {
        return mapToWebModel(browseMenuUseCase.getMenuDetail(id));
    }

    private UserMenuWebModel mapToWebModel(UserMenuResult menu) {
        return UserMenuWebModel.builder()
                .id(menu.getId())
                .korName(menu.getKorName())
                .engName(menu.getEngName())
                .description(menu.getDescription())
                .price(menu.getPrice())
                .categoryId(menu.getCategoryId() != null ? menu.getCategoryId().intValue() : 0)
                .categoryName(menu.getCategoryName())
                .imageSrc(menu.getPrimaryImageSrc())
                .isAvailable(menu.isAvailable())
                .allergyInfo(menu.getAllergyInfo())
                .build();
    }
}
