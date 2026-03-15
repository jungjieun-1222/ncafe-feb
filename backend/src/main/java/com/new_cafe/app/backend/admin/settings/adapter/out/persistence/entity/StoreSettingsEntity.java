package com.new_cafe.app.backend.admin.settings.adapter.out.persistence.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "store_settings")
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StoreSettingsEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String logoUrl;
    private String phoneNumber;
    private String address;

    @Column(columnDefinition = "TEXT")
    private String operatingHours;

    @Column(columnDefinition = "TEXT")
    private String announcement;
}
