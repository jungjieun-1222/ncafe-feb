package com.new_cafe.app.backend.cart.application.port.in;

import com.new_cafe.app.backend.cart.domain.Cart;
import com.new_cafe.app.backend.cart.domain.CartItem;

public interface CartUseCase {
    Cart getCart(String cartId);
    Cart addCartItem(String cartId, CartItem item);
    Cart updateQuantity(String cartId, String cartItemId, int quantity);
    Cart removeCartItem(String cartId, String cartItemId);
    Cart mergeCart(String guestCartId, String userCartId);
    void clearCart(String cartId);
}
