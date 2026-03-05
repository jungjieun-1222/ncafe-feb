package com.new_cafe.app.backend.admin.order.adapter.in.web;

import com.new_cafe.app.backend.admin.order.application.port.in.ManageOrderUseCase;
import com.new_cafe.app.backend.order.domain.OrderStatus;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class AdminOrderController {

    private final ManageOrderUseCase manageOrderUseCase;

    @PatchMapping("/{id}/status")
    public void updateStatus(@PathVariable Long id, @RequestBody UpdateStatusRequest request) {
        manageOrderUseCase.updateOrderStatus(id, request.getStatus());
    }

    @Getter
    @NoArgsConstructor
    public static class UpdateStatusRequest {
        private OrderStatus status;
    }
}
