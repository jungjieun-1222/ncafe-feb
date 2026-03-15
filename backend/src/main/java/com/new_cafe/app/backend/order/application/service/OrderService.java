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
    public String placeOrder(String userId, String cartId, String paymentMethod, String requestMessage) {
        Cart cart = cartUseCase.getCart(cartId);
        
        if (cart.getItems() == null || cart.getItems().isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        // 1) 총 결제 금액 검증
        int calculatedTotal = cart.getItems().stream()
                .mapToInt(CartItem::getTotalPrice)
                .sum();
        
        if (calculatedTotal != cart.getTotalPrice()) {
            throw new RuntimeException("결제 금액 검증에 실패했습니다.");
        }

        // 2) 상세 내역 복사 (주문 시점의 가격/옵션 고정)
        List<OrderItemEntity> orderItems = cart.getItems().stream()
                .map(item -> {
                    String optionsText = item.getOptions() != null ? 
                        item.getOptions().stream()
                            .map(o -> o.getName() + ": " + o.getValue())
                            .collect(Collectors.joining(", ")) : "";
                    
                    return OrderItemEntity.builder()
                        .menuId(item.getMenuId())
                        .menuName(item.getMenuName())
                        .price(item.getTotalPrice() / item.getQuantity()) // 옵션 포함된 개당 가격
                        .quantity(item.getQuantity())
                        .optionsText(optionsText)
                        .build();
                })
                .collect(Collectors.toList());

        // 가상 결제 승인 번호 생성
        String approvalNumber = "APP-" + java.util.UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        OrderEntity order = OrderEntity.builder()
                .userId(userId)
                .cartId(cartId)
                .items(orderItems)
                .totalPrice(cart.getTotalPrice())
                .status(OrderStatus.PENDING)
                .orderedAt(LocalDateTime.now())
                .paymentMethod(paymentMethod)
                .requestMessage(requestMessage)
                .approvalNumber(approvalNumber)
                .build();

        saveOrderPort.saveOrder(order);
        
        // 3) 주문 성공 후 장바구니 비우기
        cartUseCase.clearCart(cartId);

        // 4) 승인 번호 반환
        return approvalNumber;
    }

    @Override
    public List<OrderEntity> getAllOrders() {
        return loadOrderPort.loadAllOrders();
    }

    @Override
    public List<OrderEntity> getOrdersByUserId(String userId) {
        return loadOrderPort.loadOrdersByUserId(userId);
    }

    @Override
    public List<OrderEntity> getOrdersByCartId(String cartId) {
        return loadOrderPort.loadOrdersByCartId(cartId);
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
