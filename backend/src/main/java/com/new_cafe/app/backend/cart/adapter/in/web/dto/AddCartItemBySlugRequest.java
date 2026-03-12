package com.new_cafe.app.backend.cart.adapter.in.web.dto;

import lombok.Data;
import java.util.List;

@Data
public class AddCartItemBySlugRequest {
    private String slug;
    private int quantity;
    private List<Long> optionIds;
}
