package com.new_cafe.app.backend.cart.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class CartItem {
    private Long id;
    private Long menuId;
    private String menuName;
    private int price;
    private int quantity;

    public int getTotalPrice() {
        return price * quantity;
    }
}
