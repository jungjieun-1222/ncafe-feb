package com.new_cafe.app.backend.order.application.service;

import com.new_cafe.app.backend.cart.application.port.in.CartUseCase;
import com.new_cafe.app.backend.cart.domain.Cart;
import com.new_cafe.app.backend.cart.domain.CartItem;
import com.new_cafe.app.backend.order.adapter.out.persistence.OrderEntity;
import com.new_cafe.app.backend.order.adapter.out.persistence.OrderItemEntity;
import com.new_cafe.app.backend.order.application.port.in.ManageOrderUseCase;
import com.new_cafe.app.backend.order.application.port.in.PlaceOrderUseCase;
import com.new_cafe.app.backend.order.application.port.in.QueryOrderUseCase;
import com.new_cafe.app.backend.order.application.port.out.LoadOrderPort;
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
public class OrderService implements PlaceOrderUseCase, QueryOrderUseCase, ManageOrderUseCase {

    private final CartUseCase cartUseCase;
    private final SaveOrderPort saveOrderPort;
    private final LoadOrderPort loadOrderPort;

    @Override
    public void placeOrder(String cartId) {
        Cart cart = cartUseCase.getCart(cartId);
        
        if (cart.getItems() == null || cart.getItems().isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        List<OrderItemEntity> orderItems = cart.getItems().stream()
                .map(item -> OrderItemEntity.builder()
                        .menuId(item.getMenuId())
                        .menuName(item.getMenuName())
                        .price(item.getTotalPrice())
                        .quantity(item.getQuantity())
                        .build())
                .collect(Collectors.toList());

        Long userId = null;
        if (cartId.startsWith("user-")) {
            try {
                userId = Long.parseLong(cartId.substring(5));
            } catch (NumberFormatException ignored) {}
        }

        OrderEntity order = OrderEntity.builder()
                .userId(userId)
                .items(orderItems)
                .totalPrice(cart.getTotalPrice())
                .status(OrderStatus.PENDING)
                .orderedAt(LocalDateTime.now())
                .build();

        saveOrderPort.saveOrder(order);
        
        // 주문 후 장바구니 비우기
        cartUseCase.clearCart(cartId);
    }

    @Override
    public List<OrderEntity> getAllOrders() {
        return loadOrderPort.loadAllOrders();
    }

    @Override
    public List<OrderEntity> getOrdersByUserId(Long userId) {
        return loadOrderPort.loadOrdersByUserId(userId);
    }

    @Override
    public void updateOrderStatus(Long orderId, OrderStatus status) {
        OrderEntity order = loadOrderPort.loadOrderById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        
        // 사용자가 취소하려고 할 때 (CANCELLED), 이미 준비 중이거나 완료된 경우 취소 불가
        if (status == OrderStatus.CANCELLED && order.getStatus() != OrderStatus.PENDING) {
            throw new RuntimeException("주문이 이미 준비 중이거나 완료되어 취소할 수 없습니다.");
        }

        order.setStatus(status);
        saveOrderPort.saveOrder(order);
    }
}
