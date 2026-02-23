package com.new_cafe.app.backend.usermenu.adapter.out.persistence.repository;

import com.new_cafe.app.backend.usermenu.adapter.out.persistence.entity.MenuImageEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MenuImageRepository extends JpaRepository<MenuImageEntity, Long> {
    List<MenuImageEntity> findAllByMenuIdOrderBySortOrderAsc(Long menuId);
}
