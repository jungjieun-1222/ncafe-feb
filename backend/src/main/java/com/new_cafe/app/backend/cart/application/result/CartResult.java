package com.new_cafe.app.backend.cart.application.result;

import lombok.Builder;
import lombok.Getter;
import java.util.List;

@Getter
@Builder
public class CartResult {
    private List<CartItemResult> items;
    private int totalPrice;

    @Getter
    @Builder
    public static class CartItemResult {
        private Long id;
        private Long menuId;
        private String menuName;
        private int price;
        private int quantity;
        private int totalPrice;
    }
}
