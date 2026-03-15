package com.new_cafe.app.backend.order.adapter.out.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrderRepository extends JpaRepository<OrderEntity, Long> {
    List<OrderEntity> findByUserIdOrderByOrderedAtDesc(String userId);
    List<OrderEntity> findByCartIdOrderByOrderedAtDesc(String cartId);
    List<OrderEntity> findAllByOrderByOrderedAtDesc();

    @org.springframework.data.jpa.repository.Query("SELECT SUM(o.totalPrice) FROM OrderEntity o WHERE o.orderedAt BETWEEN :start AND :end")
    Long sumTotalPriceByOrderedAtBetween(java.time.LocalDateTime start, java.time.LocalDateTime end);

    long countByOrderedAtBetween(java.time.LocalDateTime start, java.time.LocalDateTime end);

    @org.springframework.data.jpa.repository.Query("SELECT o FROM OrderEntity o WHERE o.orderedAt BETWEEN :start AND :end")
    List<OrderEntity> findAllByOrderedAtBetween(java.time.LocalDateTime start, java.time.LocalDateTime end);
}
