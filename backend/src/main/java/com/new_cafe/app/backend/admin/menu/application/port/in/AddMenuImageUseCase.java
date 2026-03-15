package com.new_cafe.app.backend.admin.menu.application.port.in;

public interface AddMenuImageUseCase {
    void addImage(Long menuId, String srcUrl, String altText);
    void deleteImage(Long imageId);
    void setPrimaryImage(Long menuId, Long imageId);
}
