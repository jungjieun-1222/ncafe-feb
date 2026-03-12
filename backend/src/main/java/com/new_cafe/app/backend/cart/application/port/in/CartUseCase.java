package com.new_cafe.app.backend.cart.application.port.in;

import com.new_cafe.app.backend.cart.domain.Cart;
import com.new_cafe.app.backend.cart.domain.CartItem;

public interface CartUseCase {
    Cart getCart(String cartId);
    Cart addCartItem(String cartId, CartItem item);
    Cart addCartItemWithIds(String cartId, Long menuId, int quantity, java.util.List<Long> optionIds);
    Cart addCartItemBySlug(String cartId, String slug, int quantity, java.util.List<Long> optionIds);
    Cart updateQuantity(String cartId, String cartItemId, int quantity);
    Cart updateOptions(String cartId, String cartItemId, java.util.List<com.new_cafe.app.backend.cart.domain.Option> options);
    void updateItemOptions(Long cartItemId, java.util.List<Long> optionIds, Integer quantity);
    Cart removeCartItem(String cartId, String cartItemId);
    Cart mergeCart(String guestCartId, String userCartId);
    void clearCart(String cartId);
}
