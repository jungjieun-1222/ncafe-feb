package com.new_cafe.app.backend.cart.adapter.out.persistence.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "cart_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartItemEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "cart_id")
    private String cartId;

    @Column(name = "menu_id")
    private Long menuId;

    @Column(name = "menu_name")
    private String menuName;

    @Column(name = "base_price")
    private int basePrice;

    private int quantity;

    @Column(name = "total_price")
    private int totalPrice;

    @OneToMany(mappedBy = "cartItem", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<CartItemOptionEntity> options = new ArrayList<>();

    /**
     * 비즈니스 로직: 옵션 리스트 교체 및 가격 재계산
     */
    public void updateOptions(List<CartItemOptionEntity> newOptions) {
        // 기존 연관 관계 제거
        this.options.clear();
        
        // 새로운 연관 관계 설정
        if (newOptions != null) {
            for (CartItemOptionEntity option : newOptions) {
                option.setCartItem(this);
                this.options.add(option);
            }
        }
        
        recalculateTotalPrice();
    }

    /**
     * 비즈니스 로직: 수량 업데이트 및 가격 재계산
     */
    public void updateQuantity(int quantity) {
        if (quantity < 1) {
            throw new IllegalArgumentException("수량은 1개 이상이어야 합니다.");
        }
        this.quantity = quantity;
        recalculateTotalPrice();
    }

    /**
     * 비즈니스 로직: 객체 스스로 가격을 계산하는 "멋진 코드"
     */
    public void recalculateTotalPrice() {
        int optionTotal = options.stream()
                .mapToInt(CartItemOptionEntity::getPrice)
                .sum();
        this.totalPrice = (this.basePrice + optionTotal) * this.quantity;
    }
}
