package com.new_cafe.app.backend.order.application.port.in;

import com.new_cafe.app.backend.order.adapter.out.persistence.OrderEntity;
import java.util.List;

public interface QueryOrderUseCase {
    List<OrderEntity> getAllOrders();
    List<OrderEntity> getOrdersByUserId(Long userId);
}
