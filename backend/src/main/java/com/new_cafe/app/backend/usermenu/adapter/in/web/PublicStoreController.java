package com.new_cafe.app.backend.usermenu.adapter.in.web;

import com.new_cafe.app.backend.admin.settings.application.port.in.GetSettingsUseCase;
import com.new_cafe.app.backend.admin.settings.domain.StoreSettings;
import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1/store")
@RequiredArgsConstructor
public class PublicStoreController {

    private final GetSettingsUseCase getSettingsUseCase;

    @GetMapping("/settings")
    public PublicStoreSettingsResponse getStoreSettings() {
        StoreSettings settings = getSettingsUseCase.getStoreSettings();
        return PublicStoreSettingsResponse.builder()
                .name(settings.getName())
                .logoUrl(settings.getLogoUrl())
                .phoneNumber(settings.getPhoneNumber())
                .address(settings.getAddress())
                .operatingHours(settings.getOperatingHours())
                .announcement(settings.getAnnouncement())
                .build();
    }

    @Getter
    @Builder
    public static class PublicStoreSettingsResponse {
        private String name;
        private String logoUrl;
        private String phoneNumber;
        private String address;
        private String operatingHours;
        private String announcement;
    }
}
