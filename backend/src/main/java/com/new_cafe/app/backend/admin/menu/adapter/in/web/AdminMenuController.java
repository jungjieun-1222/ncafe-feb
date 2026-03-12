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
import com.new_cafe.app.backend.admin.menu.application.port.in.AddMenuImageUseCase;
import com.new_cafe.app.backend.common.storage.application.port.in.FileStorageUseCase;
import com.new_cafe.app.backend.admin.menu.application.result.GetMenuDetailResult;
import com.new_cafe.app.backend.admin.menu.application.result.GetMenuListResult;
import com.new_cafe.app.backend.admin.menu.domain.AdminMenu;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/admin/menus")
@RequiredArgsConstructor
public class AdminMenuController {

    private final GetMenuUseCase getMenuUseCase;
    private final CreateMenuUseCase createMenuUseCase;
    private final UpdateMenuUseCase updateMenuUseCase;
    private final DeleteMenuUseCase deleteMenuUseCase;
    private final AddMenuImageUseCase addMenuImageUseCase;
    private final FileStorageUseCase fileStorageUseCase;

    @GetMapping
    public AdminMenuListResponse getAllMenus(
            @RequestParam(required = false) Integer categoryId,
            @RequestParam(required = false) String searchQuery) {
        
        List<AdminMenuWebModel> models = getMenuUseCase.getAllMenus(categoryId, searchQuery).stream()
                .map(this::mapListToWebModel)
                .collect(Collectors.toList());
        
        return new AdminMenuListResponse(models, models.size());
    }

    @GetMapping("/{slug}")
    public AdminMenuWebModel getMenu(@PathVariable String slug) {
        return mapDetailToWebModel(getMenuUseCase.getMenuBySlug(slug));
    }

    @GetMapping("/{slug}/menu-images")
    public java.util.Map<String, Object> getMenuImages(@PathVariable String slug) {
        GetMenuDetailResult menu = getMenuUseCase.getMenuBySlug(slug);
        java.util.Map<String, Object> response = new java.util.HashMap<>();
        response.put("menuImages", getMenuUseCase.getMenuImages(menu.getId()));
        return response;
    }

    @PostMapping(consumes = org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE)
    public void createMenu(
            @RequestPart("request") AdminMenuWebRequest request,
            @RequestPart(value = "image", required = false) org.springframework.web.multipart.MultipartFile image) {
        
        String imageSrc = request.getImageSrc();
        if (image != null && !image.isEmpty()) {
            imageSrc = fileStorageUseCase.storeFile(image);
        }
        
        CreateMenuCommand command = mapToCreateCommand(request);
        command = command.toBuilder().imageSrc(imageSrc).build();
        createMenuUseCase.createMenu(command);
    }

    @PutMapping(value = "/{id}", consumes = org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE)
    public void updateMenu(
            @PathVariable Long id,
            @RequestPart("request") AdminMenuWebRequest request,
            @RequestPart(value = "image", required = false) org.springframework.web.multipart.MultipartFile image) {
        
        String imageSrc = request.getImageSrc();
        if (image != null && !image.isEmpty()) {
            imageSrc = fileStorageUseCase.storeFile(image);
        }
        
        UpdateMenuCommand command = mapToUpdateCommand(id, request);
        command = command.toBuilder().imageSrc(imageSrc).build();
        updateMenuUseCase.updateMenu(command);
    }

    @PatchMapping("/{id}/status")
    public void updateMenuStatus(@PathVariable Long id, @RequestParam boolean isAvailable) {
        updateMenuUseCase.updateMenuAvailability(id, isAvailable);
    }

    @DeleteMapping("/{id}")
    public void deleteMenu(@PathVariable Long id) {
        deleteMenuUseCase.deleteMenu(id);
    }

    @PostMapping(value = "/{slug}/images", consumes = org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE)
    public void addImageToMenu(
            @PathVariable String slug,
            @RequestPart(value = "file", required = false) org.springframework.web.multipart.MultipartFile file,
            @RequestParam(required = false) String srcUrl,
            @RequestParam(required = false) String altText) {
        GetMenuDetailResult menu = getMenuUseCase.getMenuBySlug(slug);
        Long id = menu.getId();
        
        String finalUrl = srcUrl;
        if (file != null && !file.isEmpty()) {
            finalUrl = fileStorageUseCase.storeFile(file);
        }
        
        addMenuImageUseCase.addImage(id, finalUrl, altText);
    }

    @PostMapping(value = "/upload", consumes = org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE)
    public java.util.Map<String, String> uploadImage(@RequestPart("file") org.springframework.web.multipart.MultipartFile file) {
        String url = fileStorageUseCase.storeFile(file);
        java.util.Map<String, String> response = new java.util.HashMap<>();
        response.put("url", url);
        return response;
    }

    @DeleteMapping("/images/{imageId}")
    public void deleteMenuImage(@PathVariable Long imageId) {
        addMenuImageUseCase.deleteImage(imageId);
    }

    private AdminMenuWebModel mapListToWebModel(GetMenuListResult menu) {
        return AdminMenuWebModel.builder()
                .id(menu.getId())
                .korName(menu.getKorName())
                .engName(menu.getEngName())
                .slug(menu.getSlug())
                .description(menu.getDescription())
                .price(menu.getPrice() != null ? menu.getPrice() : 0)
                .categoryId(menu.getCategoryId() != null ? menu.getCategoryId() : 0)
                .categoryName(menu.getCategoryName())
                .imageSrc(menu.getPrimaryImageSrc())
                .isAvailable(menu.isAvailable())
                .isSoldOut(menu.isSoldOut())
                .createdAt(menu.getCreatedAt())
                .updatedAt(menu.getUpdatedAt())
                .build();
    }

    private AdminMenuWebModel mapDetailToWebModel(GetMenuDetailResult menu) {
        return AdminMenuWebModel.builder()
                .id(menu.getId())
                .korName(menu.getKorName())
                .engName(menu.getEngName())
                .slug(menu.getSlug())
                .description(menu.getDescription())
                .price(menu.getPrice())
                .categoryId(menu.getCategoryId() != null ? menu.getCategoryId() : 0)
                .categoryName(menu.getCategoryName())
                .imageSrc(menu.getPrimaryImageSrc())
                .isAvailable(menu.isAvailable())
                .isSoldOut(menu.isSoldOut())
                .createdAt(menu.getCreatedAt())
                .updatedAt(menu.getUpdatedAt())
                .costPrice(menu.getCostPrice())
                .adminMemo(menu.getAdminMemo())
                .build();
    }

    private CreateMenuCommand mapToCreateCommand(AdminMenuWebRequest request) {
        return CreateMenuCommand.builder()
                .korName(request.getKorName())
                .engName(request.getEngName())
                .slug(request.getSlug())
                .description(request.getDescription())
                .price(request.getPrice())
                .categoryId(request.getCategoryId())
                .isAvailable(request.getIsAvailable())
                .altText(request.getAltText())
                .costPrice(request.getCostPrice())
                .adminMemo(request.getAdminMemo())
                .imageSrc(request.getImageSrc())
                .build();
    }

    private UpdateMenuCommand mapToUpdateCommand(Long id, AdminMenuWebRequest request) {
        return UpdateMenuCommand.builder()
                .id(id)
                .korName(request.getKorName())
                .engName(request.getEngName())
                .slug(request.getSlug())
                .description(request.getDescription())
                .price(request.getPrice())
                .categoryId(request.getCategoryId())
                .isAvailable(request.getIsAvailable())
                .altText(request.getAltText())
                .costPrice(request.getCostPrice())
                .adminMemo(request.getAdminMemo())
                .imageSrc(request.getImageSrc())
                .build();
    }
}
