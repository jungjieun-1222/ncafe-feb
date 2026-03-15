package com.new_cafe.app.backend.order.application.port.in;

public interface PlaceOrderUseCase {
    String placeOrder(String userId, String cartId, String paymentMethod, String requestMessage);
}
