package com.new_cafe.app.backend.admin.settings.application.service;

import com.new_cafe.app.backend.admin.settings.application.port.in.GetSettingsUseCase;
import com.new_cafe.app.backend.admin.settings.application.port.in.UpdateSettingsUseCase;
import com.new_cafe.app.backend.admin.settings.application.port.out.*;
import com.new_cafe.app.backend.admin.settings.domain.PolicySettings;
import com.new_cafe.app.backend.admin.settings.domain.StoreSettings;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class SettingsService implements GetSettingsUseCase, UpdateSettingsUseCase {

    private final LoadStoreSettingsPort loadStoreSettingsPort;
    private final SaveStoreSettingsPort saveStoreSettingsPort;
    private final LoadPolicySettingsPort loadPolicySettingsPort;
    private final SavePolicySettingsPort savePolicySettingsPort;

    @Override
    public StoreSettings getStoreSettings() {
        return loadStoreSettingsPort.loadStoreSettings()
                .map(settings -> {
                    if (settings.getOperatingHours() == null || settings.getOperatingHours().trim().isEmpty() || "{}".equals(settings.getOperatingHours().trim())) {
                        return settings.toBuilder()
                                .operatingHours("매일 09:00 - 22:00")
                                .build();
                    }
                    return settings;
                })
                .orElse(StoreSettings.builder()
                        .name("N-카페")
                        .address("서울특별시 강남구")
                        .phoneNumber("02-123-4567")
                        .operatingHours("매일 09:00 - 22:00")
                        .build());
    }

    @Override
    public PolicySettings getPolicySettings() {
        return loadPolicySettingsPort.loadPolicySettings()
                .orElse(PolicySettings.builder()
                        .isOrderReceptionOpen(true)
                        .soldOutHandling("LABEL")
                        .rewardRate(5.0)
                        .build());
    }

    @Override
    public void updateStoreSettings(StoreSettings settings) {
        saveStoreSettingsPort.saveStoreSettings(settings);
    }

    @Override
    public void updatePolicySettings(PolicySettings settings) {
        savePolicySettingsPort.savePolicySettings(settings);
    }
}
