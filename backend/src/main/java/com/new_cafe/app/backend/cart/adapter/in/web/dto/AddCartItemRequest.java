package com.new_cafe.app.backend.cart.adapter.in.web.dto;

import com.new_cafe.app.backend.cart.domain.Option;
import lombok.Data;

import java.util.List;

@Data
public class AddCartItemRequest {
    private Long menuId;
    private String menuName;
    private int basePrice;
    private int quantity;
    private List<Option> options;
    private List<Long> optionIds;
}
