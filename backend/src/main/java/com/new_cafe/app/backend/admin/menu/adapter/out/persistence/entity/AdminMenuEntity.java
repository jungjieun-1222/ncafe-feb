package com.new_cafe.app.backend.admin.menu.adapter.out.persistence.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
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
public class AdminMenuEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "kor_name", nullable = false)
    private String korName;

    @Column(name = "eng_name")
    private String engName;

    @Column(unique = true)
    private String slug;

    private String description;
    private Integer price;

    @Column(name = "category_id")
    private Integer categoryId;

    @Column(name = "is_available")
    private Boolean isAvailable;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "alt_text")
    private String altText;
    
    @Column(name = "cost_price")
    private Integer costPrice;

    @Column(name = "admin_memo")
    private String adminMemo;

    @Column(name = "sort_order")
    private Integer sortOrder;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "menu_option_mapping",
        joinColumns = @JoinColumn(name = "menu_id"),
        inverseJoinColumns = @JoinColumn(name = "option_id")
    )
    @Builder.Default
    private java.util.List<com.new_cafe.app.backend.cart.adapter.out.persistence.entity.MenuOptionEntity> options = new java.util.ArrayList<>();

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "menu_curation_tags", joinColumns = @JoinColumn(name = "menu_id"))
    @Column(name = "tag")
    @Builder.Default
    private java.util.List<String> curationTags = new java.util.ArrayList<>();
}
