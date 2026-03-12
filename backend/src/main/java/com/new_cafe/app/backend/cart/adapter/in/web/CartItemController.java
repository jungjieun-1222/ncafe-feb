package com.new_cafe.app.backend.cart.adapter.in.web;

import com.new_cafe.app.backend.cart.adapter.in.web.dto.UpdateCartItemRequest;
import com.new_cafe.app.backend.cart.application.port.in.CartUseCase;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/cart/items")
@RequiredArgsConstructor
public class CartItemController {

    private final CartUseCase cartUseCase;

    /**
     * 1. 엔드포인트: PATCH /api/cart/items/{cartItemId}
     * (BFF 프록시를 통해 /api 가 제거되어 도달함)
     */
    @PatchMapping("/{cartItemId}")
    public ResponseEntity<Void> updateItemOptions(
            @PathVariable Long cartItemId,
            @RequestBody UpdateCartItemRequest request) {
        
        cartUseCase.updateItemOptions(cartItemId, request.getOptionIds(), request.getQuantity());
        return ResponseEntity.ok().build();
    }
}
