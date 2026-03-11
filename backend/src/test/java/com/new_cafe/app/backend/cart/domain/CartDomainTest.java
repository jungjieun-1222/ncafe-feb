package com.new_cafe.app.backend.cart.domain;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class CartDomainTest {

    @Test
    @DisplayName("같은 메뉴라도 옵션이 다르면 hasSameOptions는 false를 반환한다")
    void testHasSameOptions_differentOptions() {
        // given
        Option hotOption = new Option("TEMPERATURE", "HOT", 0);
        Option icedOption = new Option("TEMPERATURE", "ICED", 500);

        CartItem item1 = CartItem.builder()
                .menuId(1L)
                .basePrice(4000)
                .quantity(1)
                .options(List.of(hotOption))
                .build();

        // when
        boolean isSame = item1.hasSameOptions(List.of(icedOption));

        // then
        assertThat(isSame).isFalse();
    }

    @Test
    @DisplayName("같은 메뉴에 완전히 동일한 옵션이면 true를 반환한다")
    void testHasSameOptions_sameOptions() {
        // given
        Option shotAdd1 = new Option("SHOT", "ADD", 500);
        Option shotAdd2 = new Option("SHOT", "ADD", 500);

        CartItem item1 = CartItem.builder()
                .menuId(1L)
                .basePrice(4000)
                .quantity(1)
                .options(List.of(shotAdd1))
                .build();

        // when
        boolean isSame = item1.hasSameOptions(List.of(shotAdd2));

        // then
        assertThat(isSame).isTrue();
    }

    @Test
    @DisplayName("카트에 아이템을 추가할 때, 옵션이 같으면 수량만 증가하고 다르면 새 아이템으로 분리된다")
    void testAddOrUpdateItem() {
        // given
        Cart cart = new Cart();
        
        Option grande = new Option("SIZE", "GRANDE", 500);
        Option venti = new Option("SIZE", "VENTI", 1000);

        CartItem initialItem = CartItem.builder()
                .menuId(10L)
                .basePrice(4500)
                .quantity(1)
                .options(List.of(grande))
                .build();

        CartItem sameOptionItem = CartItem.builder()
                .menuId(10L)
                .basePrice(4500)
                .quantity(2)
                .options(List.of(grande)) // 옵션 같음
                .build();

        CartItem differentOptionItem = CartItem.builder()
                .menuId(10L)
                .basePrice(4500)
                .quantity(1)
                .options(List.of(venti)) // 옵션 다름
                .build();

        // when
        cart.addOrUpdateItem(initialItem);
        cart.addOrUpdateItem(sameOptionItem);
        cart.addOrUpdateItem(differentOptionItem);

        // then
        assertThat(cart.getItems()).hasSize(2); // 옵션이 다르므로 2개의 아이템으로 분리됨
        
        // 첫번째 아이템(GRANDE)의 최종 수량은 3 (1 + 2)
        assertThat(cart.getItems().get(0).getQuantity()).isEqualTo(3);
        // 두번째 아이템(VENTI)의 최종 수량은 1
        assertThat(cart.getItems().get(1).getQuantity()).isEqualTo(1);
    }
}
