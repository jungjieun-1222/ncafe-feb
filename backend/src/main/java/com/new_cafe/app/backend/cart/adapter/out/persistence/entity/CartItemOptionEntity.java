package com.new_cafe.app.backend.cart.adapter.out.persistence.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "cart_item_options")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartItemOptionEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long menuOptionId;

    private String name;
    private String value;
    private int price;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cart_item_id")
    private CartItemEntity cartItem;

    public static CartItemOptionEntity from(MenuOptionEntity menuOption) {
        return CartItemOptionEntity.builder()
                .menuOptionId(menuOption.getId())
                .name(menuOption.getName())
                .value(menuOption.getValue())
                .price(menuOption.getPrice())
                .build();
    }
}
