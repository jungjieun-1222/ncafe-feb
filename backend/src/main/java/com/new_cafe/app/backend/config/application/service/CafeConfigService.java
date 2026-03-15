package com.new_cafe.app.backend.config.application.service;

import com.new_cafe.app.backend.config.adapter.out.persistence.entity.CafeConfigEntity;
import com.new_cafe.app.backend.config.adapter.out.persistence.repository.CafeConfigRepository;
import com.new_cafe.app.backend.config.application.port.in.GetCafeConfigUseCase;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CafeConfigService implements GetCafeConfigUseCase {

    private final CafeConfigRepository cafeConfigRepository;

    @Override
    public Map<String, String> getAllConfigs() {
        return cafeConfigRepository.findAll().stream()
                .collect(Collectors.toMap(
                        CafeConfigEntity::getConfigKey,
                        CafeConfigEntity::getConfigValue
                ));
    }

    @Override
    public String getConfig(String key) {
        return cafeConfigRepository.findByConfigKey(key)
                .map(CafeConfigEntity::getConfigValue)
                .orElse(null);
    }
}
