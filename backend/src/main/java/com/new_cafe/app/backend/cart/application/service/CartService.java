package com.new_cafe.app.backend.cart.application.service;

import com.new_cafe.app.backend.cart.application.port.in.CartUseCase;
import com.new_cafe.app.backend.cart.application.port.out.DeleteCartPort;
import com.new_cafe.app.backend.cart.application.port.out.LoadCartPort;
import com.new_cafe.app.backend.cart.application.port.out.SaveCartPort;
import com.new_cafe.app.backend.cart.domain.Cart;
import com.new_cafe.app.backend.cart.domain.CartItem;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CartService implements CartUseCase {
    private final LoadCartPort loadCartPort;
    private final SaveCartPort saveCartPort;
    private final DeleteCartPort deleteCartPort;

    @Override
    public Cart getCart(String cartId) {
        return loadCartPort.loadCart(cartId);
    }

    @Override
    public Cart addCartItem(String cartId, CartItem item) {
        Cart cart = loadCartPort.loadCart(cartId);
        cart.addOrUpdateItem(item);
        saveCartPort.saveCart(cart);
        return cart;
    }

    @Override
    public Cart updateQuantity(String cartId, String cartItemId, int quantity) {
        Cart cart = loadCartPort.loadCart(cartId);
        cart.updateQuantity(cartItemId, quantity);
        saveCartPort.saveCart(cart);
        return cart;
    }

    @Override
    public Cart removeCartItem(String cartId, String cartItemId) {
        Cart cart = loadCartPort.loadCart(cartId);
        cart.removeItem(cartItemId);
        saveCartPort.saveCart(cart);
        return cart;
    }

    @Override
    public Cart mergeCart(String guestCartId, String userCartId) {
        Cart guestCart = loadCartPort.loadCart(guestCartId);
        Cart userCart = loadCartPort.loadCart(userCartId);

        userCart.mergeFrom(guestCart);
        saveCartPort.saveCart(userCart);
        deleteCartPort.deleteCart(guestCartId);

        return userCart;
    }

    @Override
    public void clearCart(String cartId) {
        deleteCartPort.deleteCart(cartId);
    }
}
