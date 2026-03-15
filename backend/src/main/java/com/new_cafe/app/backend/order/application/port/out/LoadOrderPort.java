package com.new_cafe.app.backend.order.application.port.out;

import com.new_cafe.app.backend.order.adapter.out.persistence.OrderEntity;
import java.util.List;
import java.util.Optional;

public interface LoadOrderPort {
    List<OrderEntity> loadAllOrders();
    List<OrderEntity> loadOrdersByUserId(String userId);
    List<OrderEntity> loadOrdersByCartId(String cartId);
    Optional<OrderEntity> loadOrderById(Long id);
}
