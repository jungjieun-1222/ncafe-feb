package com.new_cafe.app.backend.order.adapter.out.persistence;

import com.new_cafe.app.backend.order.application.port.out.LoadOrderPort;
import com.new_cafe.app.backend.order.application.port.out.SaveOrderPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class OrderPersistenceAdapter implements SaveOrderPort, LoadOrderPort {

    private final OrderRepository orderRepository;

    @Override
    public void saveOrder(OrderEntity order) {
        orderRepository.save(order);
    }

    @Override
    public List<OrderEntity> loadAllOrders() {
        return orderRepository.findAllByOrderByOrderedAtDesc();
    }

    @Override
    public List<OrderEntity> loadOrdersByUserId(Long userId) {
        return orderRepository.findByUserIdOrderByOrderedAtDesc(userId);
    }

    @Override
    public List<OrderEntity> loadOrdersByCartId(String cartId) {
        return orderRepository.findByCartIdOrderByOrderedAtDesc(cartId);
    }

    @Override
    public Optional<OrderEntity> loadOrderById(Long id) {
        return orderRepository.findById(id);
    }
}
