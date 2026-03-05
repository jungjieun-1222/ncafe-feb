package com.new_cafe.app.backend.admin.menu.adapter.in.web;

import com.new_cafe.app.backend.admin.menu.adapter.in.web.dto.AdminMenuListResponse;
import com.new_cafe.app.backend.admin.menu.adapter.in.web.dto.AdminMenuWebModel;
import com.new_cafe.app.backend.admin.menu.adapter.in.web.dto.AdminMenuWebRequest;
import com.new_cafe.app.backend.admin.menu.application.command.CreateMenuCommand;
import com.new_cafe.app.backend.admin.menu.application.command.UpdateMenuCommand;
import com.new_cafe.app.backend.admin.menu.application.port.in.CreateMenuUseCase;
import com.new_cafe.app.backend.admin.menu.application.port.in.DeleteMenuUseCase;
import com.new_cafe.app.backend.admin.menu.application.port.in.GetMenuUseCase;
import com.new_cafe.app.backend.admin.menu.application.port.in.UpdateMenuUseCase;
import com.new_cafe.app.backend.admin.menu.application.result.GetMenuDetailResult;
import com.new_cafe.app.backend.admin.menu.application.result.GetMenuListResult;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/admin/menus")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class AdminMenuController {

    private final GetMenuUseCase getMenuUseCase;
    private final CreateMenuUseCase createMenuUseCase;
    private final UpdateMenuUseCase updateMenuUseCase;
    private final DeleteMenuUseCase deleteMenuUseCase;

    @GetMapping
    public AdminMenuListResponse getAllMenus(
            @RequestParam(required = false) Integer categoryId,
            @RequestParam(required = false) String searchQuery) {
        
        List<AdminMenuWebModel> models = getMenuUseCase.getAllMenus(categoryId, searchQuery).stream()
                .map(this::mapListToWebModel)
                .collect(Collectors.toList());
        
        return new AdminMenuListResponse(models, models.size());
    }

    @GetMapping("/{id}")
    public AdminMenuWebModel getMenu(@PathVariable Long id) {
        return mapDetailToWebModel(getMenuUseCase.getMenu(id));
    }

    @GetMapping("/{id}/menu-images")
    public java.util.Map<String, Object> getMenuImages(@PathVariable Long id) {
        java.util.Map<String, Object> response = new java.util.HashMap<>();
        response.put("menuImages", getMenuUseCase.getMenuImages(id));
        return response;
    }

    @PostMapping
    public void createMenu(@RequestBody AdminMenuWebRequest request) {
        createMenuUseCase.createMenu(mapToCreateCommand(request));
    }

    @PutMapping("/{id}")
    public void updateMenu(@PathVariable Long id, @RequestBody AdminMenuWebRequest request) {
        updateMenuUseCase.updateMenu(mapToUpdateCommand(id, request));
    }

    @DeleteMapping("/{id}")
    public void deleteMenu(@PathVariable Long id) {
        deleteMenuUseCase.deleteMenu(id);
    }

    private AdminMenuWebModel mapListToWebModel(GetMenuListResult menu) {
        return AdminMenuWebModel.builder()
                .id(menu.getId())
                .korName(menu.getKorName())
                .engName(menu.getEngName())
                .price(menu.getPrice())
                .categoryId(menu.getCategoryId() != null ? menu.getCategoryId().intValue() : 0)
                .categoryName(menu.getCategoryName())
                .imageSrc(menu.getPrimaryImageSrc())
                .isAvailable(menu.isAvailable())
                .build();
    }

    private AdminMenuWebModel mapDetailToWebModel(GetMenuDetailResult menu) {
        return AdminMenuWebModel.builder()
                .id(menu.getId())
                .korName(menu.getKorName())
                .engName(menu.getEngName())
                .description(menu.getDescription())
                .price(menu.getPrice())
                .categoryId(menu.getCategoryId() != null ? menu.getCategoryId().intValue() : 0)
                .categoryName(menu.getCategoryName())
                .imageSrc(menu.getPrimaryImageSrc())
                .isAvailable(menu.isAvailable())
                .createdAt(menu.getCreatedAt())
                .updatedAt(menu.getUpdatedAt())
                .costPrice(menu.getSupplierInfo() != null ? 0 : null) // Placeholder
                .build();
    }

    private CreateMenuCommand mapToCreateCommand(AdminMenuWebRequest request) {
        return CreateMenuCommand.builder()
                .korName(request.getKorName())
                .engName(request.getEngName())
                .description(request.getDescription())
                .price(request.getPrice())
                .categoryId(request.getCategoryId())
                .isAvailable(request.getIsAvailable())
                .altText(request.getAltText())
                .costPrice(request.getCostPrice())
                .adminMemo(request.getAdminMemo())
                .build();
    }

    private UpdateMenuCommand mapToUpdateCommand(Long id, AdminMenuWebRequest request) {
        return UpdateMenuCommand.builder()
                .id(id)
                .korName(request.getKorName())
                .engName(request.getEngName())
                .description(request.getDescription())
                .price(request.getPrice())
                .categoryId(request.getCategoryId())
                .isAvailable(request.getIsAvailable())
                .altText(request.getAltText())
                .costPrice(request.getCostPrice())
                .adminMemo(request.getAdminMemo())
                .build();
    }
}
