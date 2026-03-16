package com.new_cafe.app.backend.cart.adapter.out.persistence;

import com.new_cafe.app.backend.cart.adapter.out.persistence.entity.CartItemEntity;
import com.new_cafe.app.backend.cart.adapter.out.persistence.entity.CartItemOptionEntity;
import com.new_cafe.app.backend.cart.adapter.out.persistence.repository.CartItemRepository;
import com.new_cafe.app.backend.cart.application.port.out.DeleteCartPort;
import com.new_cafe.app.backend.cart.application.port.out.LoadCartPort;
import com.new_cafe.app.backend.cart.application.port.out.SaveCartPort;
import com.new_cafe.app.backend.cart.domain.Cart;
import com.new_cafe.app.backend.cart.domain.CartItem;
import com.new_cafe.app.backend.cart.domain.Option;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Component
@Primary
@RequiredArgsConstructor
public class JpaCartAdapter implements LoadCartPort, SaveCartPort, DeleteCartPort {

    private final CartItemRepository cartItemRepository;

    @Override
    @Transactional(readOnly = true)
    public Cart loadCart(String cartId) {
        List<CartItemEntity> entities = cartItemRepository.findAllByCartId(cartId);
        
        List<CartItem> items = entities.stream()
                .map(this::mapToDomain)
                .collect(Collectors.toList());

        return Cart.builder()
                .cartId(cartId)
                .items(items)
                .build();
    }

    @Override
    @Transactional
    public void saveCart(Cart cart) {
        // 기존 DB 아이템들 조회
        List<CartItemEntity> existingEntities = cartItemRepository.findAllByCartId(cart.getCartId());
        
        // 1. 삭제된 아이템 처리
        List<String> domainIds = cart.getItems().stream()
                .map(CartItem::getId)
                .collect(Collectors.toList());
                
        existingEntities.stream()
                .filter(e -> !domainIds.contains(e.getId().toString()))
                .forEach(cartItemRepository::delete);

        // 2. 추가 및 업데이트
        for (CartItem domainItem : cart.getItems()) {
            CartItemEntity entity;
            try {
                // ID가 숫자인 경우 업데이트 시도
                Long id = Long.parseLong(domainItem.getId());
                entity = cartItemRepository.findById(id)
                        .orElse(new CartItemEntity());
            } catch (NumberFormatException e) {
                // UUID 형태인 경우 새로 생성
                entity = new CartItemEntity();
            }

            entity.setCartId(cart.getCartId());
            entity.setMenuId(domainItem.getMenuId());
            entity.setMenuName(domainItem.getMenuName());
            entity.setBasePrice(domainItem.getBasePrice());
            entity.setQuantity(domainItem.getQuantity());
            
            // 옵션 매핑
            List<CartItemOptionEntity> optionEntities = domainItem.getOptions().stream()
                    .map(o -> CartItemOptionEntity.builder()
                            .menuOptionId(o.getId())
                            .name(o.getName())
                            .value(o.getValue())
                            .price(o.getPrice())
                            .cartItem(null) // updateOptions에서 처리됨
                            .build())
                    .collect(Collectors.toList());
            
            entity.updateOptions(optionEntities);
            CartItemEntity savedEntity = cartItemRepository.saveAndFlush(entity);
            
            // 도메인 모델의 ID 업데이트 (신규 생성 시)
            if (savedEntity.getId() != null) {
                domainItem.setId(savedEntity.getId().toString());
            }
        }
    }

    @Override
    @Transactional
    public void deleteCart(String cartId) {
        cartItemRepository.deleteAllByCartId(cartId);
    }

    private CartItem mapToDomain(CartItemEntity entity) {
        return CartItem.builder()
                .id(entity.getId().toString())
                .menuId(entity.getMenuId())
                .menuName(entity.getMenuName())
                .basePrice(entity.getBasePrice())
                .quantity(entity.getQuantity())
                .options(entity.getOptions().stream()
                        .map(o -> Option.builder()
                                .id(o.getMenuOptionId())
                                .name(o.getName())
                                .value(o.getValue())
                                .price(o.getPrice())
                                .build())
                        .collect(Collectors.toList()))
                .build();
    }
}
