package com.new_cafe.app.backend.order.adapter.in.web;

import com.new_cafe.app.backend.order.adapter.out.persistence.OrderEntity;
import com.new_cafe.app.backend.order.application.port.in.ManageOrderUseCase;
import com.new_cafe.app.backend.order.application.port.in.PlaceOrderUseCase;
import com.new_cafe.app.backend.order.application.port.in.QueryOrderUseCase;
import com.new_cafe.app.backend.order.domain.OrderStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class OrderController {
 
    private final PlaceOrderUseCase placeOrderUseCase;
    private final QueryOrderUseCase queryOrderUseCase;
    private final ManageOrderUseCase manageOrderUseCase;
 
    @PostMapping
    public void placeOrder(@RequestBody OrderRequest request) {
        placeOrderUseCase.placeOrder(request.getCartId());
    }

    @GetMapping
    public List<OrderEntity> getAllOrders() {
        return queryOrderUseCase.getAllOrders();
    }

    @GetMapping("/user/{userId}")
    public List<OrderEntity> getOrdersByUserId(@PathVariable Long userId) {
        return queryOrderUseCase.getOrdersByUserId(userId);
    }

    @PatchMapping("/{id}/status")
    public void updateStatus(@PathVariable Long id, @RequestParam OrderStatus status) {
        manageOrderUseCase.updateOrderStatus(id, status);
    }

    @lombok.Data
    public static class OrderRequest {
        private String cartId;
    }
}
