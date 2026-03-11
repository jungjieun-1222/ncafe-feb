package com.new_cafe.app.backend.order.application.port.in;

import com.new_cafe.app.backend.order.domain.OrderStatus;

public interface ManageOrderUseCase {
    void updateOrderStatus(Long orderId, OrderStatus status);
}
