package com.new_cafe.app.backend.usermenu.application.port.out;

import com.new_cafe.app.backend.usermenu.adapter.out.persistence.entity.MenuImageEntity;
import java.util.List;

public interface LoadMenuImagePort {
    List<String> getImageUrlsByMenuId(Long menuId);
    List<MenuImageEntity> loadAllEntitiesByMenuId(Long menuId);
}
