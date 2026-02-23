package com.new_cafe.app.backend.order.adapter.out.persistence;

import com.new_cafe.app.backend.order.application.port.out.SaveOrderPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class OrderPersistenceAdapter implements SaveOrderPort {

    private final OrderRepository orderRepository;

    @Override
    public void saveOrder(OrderEntity order) {
        orderRepository.save(order);
    }
}
