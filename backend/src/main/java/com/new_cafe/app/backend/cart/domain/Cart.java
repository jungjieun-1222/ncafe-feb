package com.new_cafe.app.backend.cart.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import java.util.List;

@Getter
@Builder
@AllArgsConstructor
public class Cart {
    private List<CartItem> items;

    public int getTotalPrice() {
        return items.stream()
                .mapToInt(CartItem::getTotalPrice)
                .sum();
    }
}
