package com.new_cafe.app.backend.cart.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
public class Option {
    private Long id;
    private String name; // e.g., SIZE, SHOT, SYRUP
    private String value; // e.g., GRANDE, +1, VANILLA
    private int price; // Additional price
}
