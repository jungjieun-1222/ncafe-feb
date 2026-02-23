package com.new_cafe.app.backend.cart.application.port.in;

import com.new_cafe.app.backend.cart.application.port.in.command.AddCartItemCommand;

public interface AddCartItemUseCase {
    void addCartItem(AddCartItemCommand command);
}
