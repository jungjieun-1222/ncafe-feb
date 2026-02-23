package com.new_cafe.app.backend.order.application.service;

import com.new_cafe.app.backend.cart.application.port.out.LoadCartPort;
import com.new_cafe.app.backend.cart.application.port.out.SaveCartPort;
import com.new_cafe.app.backend.cart.domain.CartItem;
import com.new_cafe.app.backend.order.adapter.out.persistence.OrderEntity;
import com.new_cafe.app.backend.order.adapter.out.persistence.OrderItemEntity;
import com.new_cafe.app.backend.order.application.port.in.PlaceOrderUseCase;
import com.new_cafe.app.backend.order.application.port.out.SaveOrderPort;
import com.new_cafe.app.backend.order.domain.OrderStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class OrderService implements PlaceOrderUseCase {

    private final LoadCartPort loadCartPort;
    private final SaveCartPort saveCartPort;
    private final SaveOrderPort saveOrderPort;

    @Override
    public void placeOrder(Long userId) {
        List<CartItem> cartItems = loadCartPort.loadCartItems(userId);
        if (cartItems.isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        List<OrderItemEntity> orderItems = cartItems.stream()
                .map(item -> OrderItemEntity.builder()
                        .menuId(item.getMenuId())
                        .price(item.getPrice())
                        .quantity(item.getQuantity())
                        .build())
                .collect(Collectors.toList());

        int totalPrice = orderItems.stream().mapToInt(i -> i.getPrice() * i.getQuantity()).sum();

        OrderEntity order = OrderEntity.builder()
                .userId(userId)
                .items(orderItems)
                .totalPrice(totalPrice)
                .status(OrderStatus.PENDING)
                .orderedAt(LocalDateTime.now())
                .build();

        saveOrderPort.saveOrder(order);
        
        // 주문 후 장바구니 비우기
        saveCartPort.clearCart(userId);
    }
}
