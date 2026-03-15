package com.new_cafe.app.backend.cart.adapter.in.web;

import com.new_cafe.app.backend.cart.adapter.in.web.dto.AddCartItemRequest;
import com.new_cafe.app.backend.cart.application.port.in.CartUseCase;
import com.new_cafe.app.backend.cart.domain.Cart;
import com.new_cafe.app.backend.cart.domain.CartItem;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/carts")
@RequiredArgsConstructor
public class CartController {

    private final CartUseCase cartUseCase;

    @GetMapping("/{cartId}")
    public ResponseEntity<Cart> getCart(@PathVariable String cartId) {
        return ResponseEntity.ok(cartUseCase.getCart(cartId));
    }

    @PostMapping("/{cartId}/items")
    public ResponseEntity<Cart> addCartItem(
            @PathVariable String cartId,
            @RequestBody AddCartItemRequest request) {
        
        if (request.getMenuId() != null) {
            return ResponseEntity.ok(cartUseCase.addCartItemWithIds(cartId, request.getMenuId(), request.getQuantity(), request.getOptionIds()));
        }

        CartItem cartItem = CartItem.builder()
                .menuId(request.getMenuId())
                .menuName(request.getMenuName())
                .basePrice(request.getBasePrice())
                .quantity(request.getQuantity())
                .options(request.getOptions())
                .build();
                
        return ResponseEntity.ok(cartUseCase.addCartItem(cartId, cartItem));
    }
    
    @PostMapping("/{cartId}/items/by-slug")
    public ResponseEntity<Cart> addCartItemBySlug(
            @PathVariable String cartId,
            @RequestBody com.new_cafe.app.backend.cart.adapter.in.web.dto.AddCartItemBySlugRequest request) {
        
        return ResponseEntity.ok(cartUseCase.addCartItemBySlug(cartId, request.getSlug(), request.getQuantity(), request.getOptionIds()));
    }

    @PatchMapping("/{cartId}/items/{itemId}")
    public ResponseEntity<Cart> updateQuantity(
            @PathVariable String cartId,
            @PathVariable String itemId,
            @RequestParam int quantity) {
        return ResponseEntity.ok(cartUseCase.updateQuantity(cartId, itemId, quantity));
    }

    @PatchMapping("/{cartId}/items/{itemId}/options")
    public ResponseEntity<Cart> updateOptions(
            @PathVariable String cartId,
            @PathVariable String itemId,
            @RequestBody java.util.List<com.new_cafe.app.backend.cart.domain.Option> options) {
        return ResponseEntity.ok(cartUseCase.updateOptions(cartId, itemId, options));
    }

    @DeleteMapping("/{cartId}/items/{itemId}")
    public ResponseEntity<Cart> removeCartItem(
            @PathVariable String cartId,
            @PathVariable String itemId) {
        return ResponseEntity.ok(cartUseCase.removeCartItem(cartId, itemId));
    }

    @PostMapping("/merge")
    public ResponseEntity<Cart> mergeCart(
            @RequestParam String guestCartId,
            @RequestParam String userCartId) {
        return ResponseEntity.ok(cartUseCase.mergeCart(guestCartId, userCartId));
    }

    @DeleteMapping("/{cartId}")
    public ResponseEntity<Void> clearCart(@PathVariable String cartId) {
        cartUseCase.clearCart(cartId);
        return ResponseEntity.noContent().build();
    }
}
