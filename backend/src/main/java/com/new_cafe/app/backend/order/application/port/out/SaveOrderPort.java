package com.new_cafe.app.backend.order.application.port.out;

import com.new_cafe.app.backend.order.adapter.out.persistence.OrderEntity;

public interface SaveOrderPort {
    void saveOrder(OrderEntity order);
}
