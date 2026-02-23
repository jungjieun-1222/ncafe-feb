package com.new_cafe.app.backend.order.adapter.in.web;

import com.new_cafe.app.backend.order.application.port.in.PlaceOrderUseCase;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class OrderController {

    private final PlaceOrderUseCase placeOrderUseCase;

    @PostMapping
    public void placeOrder() {
        // 현재는 하드코딩된 userId 1 사용
        placeOrderUseCase.placeOrder(1L);
    }
}
