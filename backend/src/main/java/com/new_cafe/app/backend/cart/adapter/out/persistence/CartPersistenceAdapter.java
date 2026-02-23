package com.new_cafe.app.backend.cart.adapter.out.persistence;

import com.new_cafe.app.backend.cart.application.port.out.LoadCartPort;
import com.new_cafe.app.backend.cart.application.port.out.SaveCartPort;
import com.new_cafe.app.backend.cart.domain.CartItem;
import com.new_cafe.app.backend.usermenu.adapter.out.persistence.entity.UserMenuEntity;
import com.new_cafe.app.backend.usermenu.adapter.out.persistence.repository.UserMenuRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class CartPersistenceAdapter implements LoadCartPort, SaveCartPort {

    private final CartItemRepository cartItemRepository;
    private final UserMenuRepository userMenuRepository;

    @Override
    public List<CartItem> loadCartItems(Long userId) {
        return cartItemRepository.findAllByUserId(userId).stream()
                .map(entity -> {
                    UserMenuEntity menu = userMenuRepository.findById(entity.getMenuId()).orElse(null);
                    return CartItem.builder()
                            .id(entity.getId())
                            .menuId(entity.getMenuId())
                            .menuName(menu != null ? menu.getKorName() : "Unknown")
                            .price(menu != null ? menu.getPrice() : 0)
                            .quantity(entity.getQuantity())
                            .build();
                })
                .collect(Collectors.toList());
    }

    @Override
    public void saveCartItem(Long userId, CartItem item) {
        CartItemEntity entity = CartItemEntity.builder()
                .id(item.getId())
                .userId(userId)
                .menuId(item.getMenuId())
                .quantity(item.getQuantity())
                .build();
        cartItemRepository.save(entity);
    }

    @Override
    public void removeCartItem(Long itemId) {
        cartItemRepository.deleteById(itemId);
    }

    @Override
    public void clearCart(Long userId) {
        List<CartItemEntity> items = cartItemRepository.findAllByUserId(userId);
        cartItemRepository.deleteAll(items);
    }
}
