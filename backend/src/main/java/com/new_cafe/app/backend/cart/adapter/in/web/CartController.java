package com.new_cafe.app.backend.cart.adapter.in.web;

import com.new_cafe.app.backend.cart.application.port.in.AddCartItemUseCase;
import com.new_cafe.app.backend.cart.application.port.in.GetCartUseCase;
import com.new_cafe.app.backend.cart.application.port.in.command.AddCartItemCommand;
import com.new_cafe.app.backend.cart.application.result.CartResult;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/cart")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class CartController {

    private final AddCartItemUseCase addCartItemUseCase;
    private final GetCartUseCase getCartUseCase;

    @GetMapping
    public CartResult getCart() {
        // 현재는 하드코딩된 userId 1 사용
        return getCartUseCase.getCart(1L);
    }

    @PostMapping("/items")
    public void addCartItem(@RequestBody AddCartItemRequest request) {
        addCartItemUseCase.addCartItem(AddCartItemCommand.builder()
                .menuId(request.getMenuId())
                .quantity(request.getQuantity())
                .build());
    }

    @Getter
    @NoArgsConstructor
    public static class AddCartItemRequest {
        private Long menuId;
        private int quantity;
    }
}
