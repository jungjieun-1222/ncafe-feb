package com.new_cafe.app.backend.cart.adapter.in.web.dto;

import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
public class UpdateCartItemRequest {
    private List<Long> optionIds;
    private Integer quantity;
}
