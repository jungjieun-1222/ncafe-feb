package com.new_cafe.app.backend.cart.adapter.out.persistence;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "cart_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartItemEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "menu_id")
    private Long menuId;

    private int quantity;
    
    // 현재는 사용자 식별자가 없으므로 세션 기반이겠지만, 
    // 나중을 위해 userId 필장을 비워둡니다.
    @Column(name = "user_id")
    private Long userId;
}
