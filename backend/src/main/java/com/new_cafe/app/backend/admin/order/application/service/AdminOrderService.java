package com.new_cafe.app.backend.admin.order.application.service;

import com.new_cafe.app.backend.admin.order.application.port.in.ManageOrderUseCase;
import com.new_cafe.app.backend.order.adapter.out.persistence.OrderEntity;
import com.new_cafe.app.backend.order.adapter.out.persistence.OrderRepository;
import com.new_cafe.app.backend.order.domain.OrderStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class AdminOrderService implements ManageOrderUseCase {

    private final OrderRepository orderRepository;

    @Override
    public void updateOrderStatus(Long orderId, OrderStatus status) {
        OrderEntity order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        
        order.setStatus(status);
        // JPA의 Dirty Checking 기능으로 별도 save 호출이 없어도 업데이트됨
    }
}
