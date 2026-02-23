package com.new_cafe.app.backend.cart.application.port.in;

import com.new_cafe.app.backend.cart.application.result.CartResult;

public interface GetCartUseCase {
    CartResult getCart(Long userId);
}
