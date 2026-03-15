package com.new_cafe.app.backend.admin.settings.adapter.out.persistence.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "policy_settings")
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PolicySettingsEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private boolean isOrderReceptionOpen;
    private String soldOutHandling;
    private Double rewardRate;
    private String welcomeBenefit;
}
