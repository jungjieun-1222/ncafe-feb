package com.new_cafe.app.backend.admin.settings.adapter.in.web.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class PolicySettingsWebModel {
    private boolean isOrderReceptionOpen;
    private String soldOutHandling;
    private Double rewardRate;
    private String welcomeBenefit;
}
