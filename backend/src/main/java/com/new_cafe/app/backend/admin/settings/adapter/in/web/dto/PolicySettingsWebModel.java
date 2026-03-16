package com.new_cafe.app.backend.admin.settings.adapter.in.web.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PolicySettingsWebModel {
    @JsonProperty("orderReceptionOpen")
    private boolean isOrderReceptionOpen;
    
    private String soldOutHandling;
    private Double rewardRate;
    private String welcomeBenefit;
}
