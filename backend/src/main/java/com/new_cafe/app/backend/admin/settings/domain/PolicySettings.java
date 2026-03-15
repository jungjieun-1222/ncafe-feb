package com.new_cafe.app.backend.admin.settings.domain;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class PolicySettings {
    private Long id;
    private boolean isOrderReceptionOpen;
    private String soldOutHandling; // e.g., "HIDE", "LABEL"
    private Double rewardRate;
    private String welcomeBenefit;
}
