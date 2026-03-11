package com.new_cafe.app.backend.order.application.port.out;

import com.new_cafe.app.backend.order.adapter.out.persistence.OrderEntity;
import java.util.List;
import java.util.Optional;

public interface LoadOrderPort {
    List<OrderEntity> loadAllOrders();
    List<OrderEntity> loadOrdersByUserId(Long userId);
    Optional<OrderEntity> loadOrderById(Long id);
}
