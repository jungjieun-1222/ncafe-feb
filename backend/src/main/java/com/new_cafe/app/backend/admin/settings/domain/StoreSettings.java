package com.new_cafe.app.backend.admin.settings.domain;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder(toBuilder = true)
public class StoreSettings {
    private Long id;
    private String name;
    private String logoUrl;
    private String phoneNumber;
    private String address;
    private String operatingHours; // Store as JSON string
    private String announcement;
}
