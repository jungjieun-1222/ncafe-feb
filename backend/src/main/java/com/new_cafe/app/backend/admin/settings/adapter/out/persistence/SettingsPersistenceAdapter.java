package com.new_cafe.app.backend.admin.settings.adapter.out.persistence;

import com.new_cafe.app.backend.admin.settings.adapter.out.persistence.entity.PolicySettingsEntity;
import com.new_cafe.app.backend.admin.settings.adapter.out.persistence.entity.StoreSettingsEntity;
import com.new_cafe.app.backend.admin.settings.adapter.out.persistence.repository.PolicySettingsRepository;
import com.new_cafe.app.backend.admin.settings.adapter.out.persistence.repository.StoreSettingsRepository;
import com.new_cafe.app.backend.admin.settings.application.port.out.*;
import com.new_cafe.app.backend.admin.settings.domain.PolicySettings;
import com.new_cafe.app.backend.admin.settings.domain.StoreSettings;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@RequiredArgsConstructor
public class SettingsPersistenceAdapter implements 
        LoadStoreSettingsPort, SaveStoreSettingsPort, 
        LoadPolicySettingsPort, SavePolicySettingsPort {

    private final StoreSettingsRepository storeSettingsRepository;
    private final PolicySettingsRepository policySettingsRepository;

    @Override
    public Optional<StoreSettings> loadStoreSettings() {
        return storeSettingsRepository.findFirstByOrderByIdAsc()
                .map(this::mapToStoreDomain);
    }

    @Override
    public void saveStoreSettings(StoreSettings settings) {
        StoreSettingsEntity existing = storeSettingsRepository.findFirstByOrderByIdAsc().orElse(null);
        StoreSettingsEntity entity = StoreSettingsEntity.builder()
                .id(existing != null ? existing.getId() : null)
                .name(settings.getName())
                .logoUrl(settings.getLogoUrl())
                .phoneNumber(settings.getPhoneNumber())
                .address(settings.getAddress())
                .operatingHours(settings.getOperatingHours())
                .announcement(settings.getAnnouncement())
                .build();
        storeSettingsRepository.save(entity);
    }

    @Override
    public Optional<PolicySettings> loadPolicySettings() {
        return policySettingsRepository.findFirstByOrderByIdAsc()
                .map(this::mapToPolicyDomain);
    }

    @Override
    public void savePolicySettings(PolicySettings settings) {
        PolicySettingsEntity existing = policySettingsRepository.findFirstByOrderByIdAsc().orElse(null);
        PolicySettingsEntity entity = PolicySettingsEntity.builder()
                .id(existing != null ? existing.getId() : null)
                .isOrderReceptionOpen(settings.isOrderReceptionOpen())
                .soldOutHandling(settings.getSoldOutHandling())
                .rewardRate(settings.getRewardRate())
                .welcomeBenefit(settings.getWelcomeBenefit())
                .build();
        policySettingsRepository.save(entity);
    }

    private StoreSettings mapToStoreDomain(StoreSettingsEntity entity) {
        return StoreSettings.builder()
                .id(entity.getId())
                .name(entity.getName())
                .logoUrl(entity.getLogoUrl())
                .phoneNumber(entity.getPhoneNumber())
                .address(entity.getAddress())
                .operatingHours(entity.getOperatingHours())
                .announcement(entity.getAnnouncement())
                .build();
    }

    private PolicySettings mapToPolicyDomain(PolicySettingsEntity entity) {
        return PolicySettings.builder()
                .id(entity.getId())
                .isOrderReceptionOpen(entity.isOrderReceptionOpen())
                .soldOutHandling(entity.getSoldOutHandling())
                .rewardRate(entity.getRewardRate())
                .welcomeBenefit(entity.getWelcomeBenefit())
                .build();
    }
}
