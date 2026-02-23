package com.new_cafe.app.backend.cart.application.port.out;

import com.new_cafe.app.backend.cart.domain.CartItem;
import java.util.List;

public interface LoadCartPort {
    List<CartItem> loadCartItems(Long userId);
}
