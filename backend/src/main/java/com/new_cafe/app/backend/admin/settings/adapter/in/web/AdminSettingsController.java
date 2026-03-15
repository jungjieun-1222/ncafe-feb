package com.new_cafe.app.backend.admin.settings.adapter.in.web;

import com.new_cafe.app.backend.admin.settings.adapter.in.web.dto.PolicySettingsWebModel;
import com.new_cafe.app.backend.admin.settings.adapter.in.web.dto.StoreSettingsWebModel;
import com.new_cafe.app.backend.admin.settings.application.port.in.GetSettingsUseCase;
import com.new_cafe.app.backend.admin.settings.application.port.in.UpdateSettingsUseCase;
import com.new_cafe.app.backend.admin.settings.domain.PolicySettings;
import com.new_cafe.app.backend.admin.settings.domain.StoreSettings;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/settings")
@RequiredArgsConstructor
public class AdminSettingsController {

    private final GetSettingsUseCase getSettingsUseCase;
    private final UpdateSettingsUseCase updateSettingsUseCase;

    @GetMapping("/store")
    public StoreSettingsWebModel getStoreSettings() {
        StoreSettings settings = getSettingsUseCase.getStoreSettings();
        return StoreSettingsWebModel.builder()
                .name(settings.getName())
                .logoUrl(settings.getLogoUrl())
                .phoneNumber(settings.getPhoneNumber())
                .address(settings.getAddress())
                .operatingHours(settings.getOperatingHours())
                .announcement(settings.getAnnouncement())
                .build();
    }

    @PutMapping("/store")
    public void updateStoreSettings(@RequestBody StoreSettingsWebModel request) {
        StoreSettings settings = StoreSettings.builder()
                .name(request.getName())
                .logoUrl(request.getLogoUrl())
                .phoneNumber(request.getPhoneNumber())
                .address(request.getAddress())
                .operatingHours(request.getOperatingHours())
                .announcement(request.getAnnouncement())
                .build();
        updateSettingsUseCase.updateStoreSettings(settings);
    }

    @GetMapping("/policy")
    public PolicySettingsWebModel getPolicySettings() {
        PolicySettings settings = getSettingsUseCase.getPolicySettings();
        return PolicySettingsWebModel.builder()
                .isOrderReceptionOpen(settings.isOrderReceptionOpen())
                .soldOutHandling(settings.getSoldOutHandling())
                .rewardRate(settings.getRewardRate())
                .welcomeBenefit(settings.getWelcomeBenefit())
                .build();
    }

    @PutMapping("/policy")
    public void updatePolicySettings(@RequestBody PolicySettingsWebModel request) {
        PolicySettings settings = PolicySettings.builder()
                .isOrderReceptionOpen(request.isOrderReceptionOpen())
                .soldOutHandling(request.getSoldOutHandling())
                .rewardRate(request.getRewardRate())
                .welcomeBenefit(request.getWelcomeBenefit())
                .build();
        updateSettingsUseCase.updatePolicySettings(settings);
    }
}
