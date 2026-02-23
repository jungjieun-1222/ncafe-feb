package com.new_cafe.app.backend.usermenu.adapter.out.persistence.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "menu_images")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MenuImageEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "menu_id")
    private Long menuId;

    @Column(name = "src_url")
    private String srcUrl;

    @Column(name = "alt_text")
    private String altText;

    @Column(name = "sort_order")
    private int sortOrder;
}
