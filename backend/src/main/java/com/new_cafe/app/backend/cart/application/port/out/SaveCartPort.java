package com.new_cafe.app.backend.cart.application.port.out;

import com.new_cafe.app.backend.cart.domain.Cart;

public interface SaveCartPort {
    void saveCart(Cart cart);
}
