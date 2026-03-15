package com.new_cafe.app.backend.admin.settings.adapter.out.persistence.repository;

import com.new_cafe.app.backend.admin.settings.adapter.out.persistence.entity.PolicySettingsEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PolicySettingsRepository extends JpaRepository<PolicySettingsEntity, Long> {
    Optional<PolicySettingsEntity> findFirstByOrderByIdAsc();
}
