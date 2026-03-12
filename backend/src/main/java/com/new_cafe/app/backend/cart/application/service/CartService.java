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
    private final com.new_cafe.app.backend.cart.adapter.out.persistence.repository.CartItemRepository cartItemRepository;
    private final com.new_cafe.app.backend.cart.adapter.out.persistence.repository.MenuOptionRepository menuOptionRepository;
    private final com.new_cafe.app.backend.admin.menu.application.port.out.LoadAdminMenuPort loadAdminMenuPort;

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
    @org.springframework.transaction.annotation.Transactional
    public Cart addCartItemWithIds(String cartId, Long menuId, int quantity, java.util.List<Long> optionIds) {
        // 1. 메뉴 정보 조회
        com.new_cafe.app.backend.admin.menu.domain.AdminMenu menu = loadAdminMenuPort.loadAdminMenuById(menuId)
                .orElseThrow(() -> new RuntimeException("Menu not found: " + menuId));

        // 2. 옵션 정보 조회
        java.util.List<com.new_cafe.app.backend.cart.domain.Option> domainOptions = new java.util.ArrayList<>();
        if (optionIds != null && !optionIds.isEmpty()) {
            java.util.List<com.new_cafe.app.backend.cart.adapter.out.persistence.entity.MenuOptionEntity> optionEntities = 
                    menuOptionRepository.findAllById(optionIds);
            
            domainOptions = optionEntities.stream()
                    .map(o -> com.new_cafe.app.backend.cart.domain.Option.builder()
                            .id(o.getId())
                            .name(o.getName())
                            .value(o.getValue())
                            .price(o.getPrice())
                            .build())
                    .collect(java.util.stream.Collectors.toList());
        }

        // 3. 도메인 객체 생성
        com.new_cafe.app.backend.cart.domain.CartItem cartItem = com.new_cafe.app.backend.cart.domain.CartItem.builder()
                .id(java.util.UUID.randomUUID().toString())
                .menuId(menuId)
                .menuName(menu.getEngName() != null ? menu.getEngName() : menu.getKorName())
                .basePrice(menu.getPrice())
                .quantity(quantity)
                .options(domainOptions)
                .build();
        
        // korName이 더 정확할 수 있으니 korName 사용 (AdminMenu에는 korName이 있음)
        cartItem.setMenuName(menu.getKorName());

        // 4. 장바구니에 추가 및 저장
        return addCartItem(cartId, cartItem);
    }

    @Override
    public Cart updateQuantity(String cartId, String cartItemId, int quantity) {
        Cart cart = loadCartPort.loadCart(cartId);
        cart.updateQuantity(cartItemId, quantity);
        saveCartPort.saveCart(cart);
        return cart;
    }

    @Override
    public Cart updateOptions(String cartId, String cartItemId, java.util.List<com.new_cafe.app.backend.cart.domain.Option> options) {
        Cart cart = loadCartPort.loadCart(cartId);
        cart.updateOptions(cartItemId, options);
        saveCartPort.saveCart(cart);
        return cart;
    }

    @Override
    @org.springframework.transaction.annotation.Transactional
    public void updateItemOptions(Long cartItemId, java.util.List<Long> optionIds, Integer quantity) {
        // 1. cartItemId를 조회해서 해당 아이템이 존재하는지 확인
        com.new_cafe.app.backend.cart.adapter.out.persistence.entity.CartItemEntity item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found: " + cartItemId));

        // 2. 새로운 옵션 리스트로 교체
        if (optionIds != null) {
            java.util.List<com.new_cafe.app.backend.cart.adapter.out.persistence.entity.MenuOptionEntity> menuOptions = menuOptionRepository.findAllById(optionIds);
            java.util.List<com.new_cafe.app.backend.cart.adapter.out.persistence.entity.CartItemOptionEntity> newOptions = menuOptions.stream()
                    .map(com.new_cafe.app.backend.cart.adapter.out.persistence.entity.CartItemOptionEntity::from)
                    .collect(java.util.stream.Collectors.toList());
            
            // 객체 스스로 옵션을 관리하는 도메인 로직 호출
            item.updateOptions(newOptions);
        }

        // 3. 수량 변경 (선택 사항)
        if (quantity != null) {
            item.updateQuantity(quantity);
        }

        // JPA Dirty Checking에 의해 옵션 삭제/교체 및 가격 업데이트가 자동으로 반영됨
        cartItemRepository.save(item);
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
