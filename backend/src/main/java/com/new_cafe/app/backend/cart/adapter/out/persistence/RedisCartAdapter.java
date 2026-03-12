package com.new_cafe.app.backend.cart.adapter.out.persistence;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.new_cafe.app.backend.cart.application.port.out.DeleteCartPort;
import com.new_cafe.app.backend.cart.application.port.out.LoadCartPort;
import com.new_cafe.app.backend.cart.application.port.out.SaveCartPort;
import com.new_cafe.app.backend.cart.domain.Cart;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Repository;

import java.util.concurrent.TimeUnit;

// @Repository
@RequiredArgsConstructor
@lombok.extern.slf4j.Slf4j
public class RedisCartAdapter implements LoadCartPort, SaveCartPort, DeleteCartPort {

    private final RedisTemplate<String, String> redisTemplate;
    private final ObjectMapper objectMapper = new ObjectMapper();

    private static final String CART_KEY_PREFIX = "cart:";
    private static final long EXPIRE_DAYS = 7;

    @Override
    public Cart loadCart(String cartId) {
        String key = CART_KEY_PREFIX + cartId;
        String json = redisTemplate.opsForValue().get(key);
        log.debug("Loading cart for ID: {}, JSON: {}", cartId, json);
        
        if (json == null || json.isEmpty()) {
            return Cart.builder().cartId(cartId).build();
        }
        
        try {
            return objectMapper.readValue(json, Cart.class);
        } catch (Exception e) {
            log.error("Failed to deserialize cart JSON: {}", json, e);
            return Cart.builder().cartId(cartId).build();
        }
    }

    @Override
    public void saveCart(Cart cart) {
        String key = CART_KEY_PREFIX + cart.getCartId();
        try {
            String json = objectMapper.writeValueAsString(cart);
            log.debug("Saving cart for ID: {}, JSON: {}", cart.getCartId(), json);
            redisTemplate.opsForValue().set(key, json, EXPIRE_DAYS, TimeUnit.DAYS);
        } catch (Exception e) {
            log.error("Failed to serialize cart object: {}", cart, e);
        }
    }

    @Override
    public void deleteCart(String cartId) {
        String key = CART_KEY_PREFIX + cartId;
        log.debug("Deleting cart for ID: {}", cartId);
        redisTemplate.delete(key);
    }
}
