package com.new_cafe.app.backend.admin.settings.adapter.in.web.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class StoreSettingsWebModel {
    private String name;
    private String logoUrl;
    private String phoneNumber;
    private String address;
    private String operatingHours;
    private String announcement;
}
