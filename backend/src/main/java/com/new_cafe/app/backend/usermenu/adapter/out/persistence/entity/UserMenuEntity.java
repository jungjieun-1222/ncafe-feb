package com.new_cafe.app.backend.usermenu.adapter.out.persistence.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Builder;

@Entity
@Table(name = "menus")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserMenuEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "kor_name")
    private String korName;

    @Column(name = "eng_name")
    private String engName;

    private String slug;

    private String description;
    private Integer price;

    @Column(name = "category_id")
    private Integer categoryId;

    @Column(name = "is_available")
    private Boolean isAvailable;
    
    @Column(name = "allergy_info")
    private String allergyInfo;
}
