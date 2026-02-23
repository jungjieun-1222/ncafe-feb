package com.new_cafe.app.backend.cart.application.port.out;

import com.new_cafe.app.backend.cart.domain.CartItem;

public interface SaveCartPort {
    void saveCartItem(Long userId, CartItem item);
    void removeCartItem(Long itemId);
    void clearCart(Long userId);
}
