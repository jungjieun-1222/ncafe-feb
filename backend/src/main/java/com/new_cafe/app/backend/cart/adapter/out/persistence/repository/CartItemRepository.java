package com.new_cafe.app.backend.cart.adapter.out.persistence.repository;

import com.new_cafe.app.backend.cart.adapter.out.persistence.entity.CartItemEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CartItemRepository extends JpaRepository<CartItemEntity, Long> {
    List<CartItemEntity> findAllByCartId(String cartId);
    void deleteAllByCartId(String cartId);
}
