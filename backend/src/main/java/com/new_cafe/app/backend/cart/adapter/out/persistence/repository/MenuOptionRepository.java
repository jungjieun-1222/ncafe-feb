package com.new_cafe.app.backend.cart.adapter.out.persistence.repository;

import com.new_cafe.app.backend.cart.adapter.out.persistence.entity.MenuOptionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MenuOptionRepository extends JpaRepository<MenuOptionEntity, Long> {
}
