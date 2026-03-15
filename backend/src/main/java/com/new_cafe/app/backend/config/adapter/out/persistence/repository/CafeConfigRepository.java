package com.new_cafe.app.backend.config.adapter.out.persistence.repository;

import com.new_cafe.app.backend.config.adapter.out.persistence.entity.CafeConfigEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CafeConfigRepository extends JpaRepository<CafeConfigEntity, Long> {
    Optional<CafeConfigEntity> findByConfigKey(String configKey);
}
