package com.new_cafe.app.backend.cart.application.port.in.command;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AddCartItemCommand {
    private Long menuId;
    private int quantity;
}
