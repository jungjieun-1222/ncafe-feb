package com.new_cafe.app.backend.cart.application.service;

import com.new_cafe.app.backend.cart.application.port.in.AddCartItemUseCase;
import com.new_cafe.app.backend.cart.application.port.in.GetCartUseCase;
import com.new_cafe.app.backend.cart.application.port.in.command.AddCartItemCommand;
import com.new_cafe.app.backend.cart.application.port.out.LoadCartPort;
import com.new_cafe.app.backend.cart.application.port.out.SaveCartPort;
import com.new_cafe.app.backend.cart.application.result.CartResult;
import com.new_cafe.app.backend.cart.domain.CartItem;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CartService implements AddCartItemUseCase, GetCartUseCase {

    private final LoadCartPort loadCartPort;
    private final SaveCartPort saveCartPort;

    @Override
    public void addCartItem(AddCartItemCommand command) {
        // 실제로는 메뉴 가격 등을 조회해야 함 (단순화를 위해 일단 구현생략)
        CartItem item = CartItem.builder()
                .menuId(command.getMenuId())
                .quantity(command.getQuantity())
                .build();
        
        // 현재는 userId 1로 가정
        saveCartPort.saveCartItem(1L, item);
    }

    @Override
    @Transactional(readOnly = true)
    public CartResult getCart(Long userId) {
        List<CartItem> items = loadCartPort.loadCartItems(userId);
        
        List<CartResult.CartItemResult> itemResults = items.stream()
                .map(item -> CartResult.CartItemResult.builder()
                        .id(item.getId())
                        .menuId(item.getMenuId())
                        .menuName(item.getMenuName())
                        .price(item.getPrice())
                        .quantity(item.getQuantity())
                        .totalPrice(item.getTotalPrice())
                        .build())
                .collect(Collectors.toList());

        int totalPrice = itemResults.stream().mapToInt(CartResult.CartItemResult::getTotalPrice).sum();

        return CartResult.builder()
                .items(itemResults)
                .totalPrice(totalPrice)
                .build();
    }
}
