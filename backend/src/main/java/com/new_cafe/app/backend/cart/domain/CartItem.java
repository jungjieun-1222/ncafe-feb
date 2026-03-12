package com.new_cafe.app.backend.cart.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class CartItem {
    @Builder.Default
    private String id = UUID.randomUUID().toString();

    public String getId() {
        if (id == null) {
            id = UUID.randomUUID().toString();
        }
        return id;
    }
    private Long menuId;
    private String menuName;
    private int basePrice;
    private int quantity;

    @Builder.Default
    private List<Option> options = new ArrayList<>();

    public List<Option> getOptions() {
        if (options == null) {
            options = new ArrayList<>();
        }
        return options;
    }

    @com.fasterxml.jackson.annotation.JsonProperty("totalPrice")
    public int getTotalPrice() {
        int optionPriceSum = options != null ? options.stream().mapToInt(Option::getPrice).sum() : 0;
        return (basePrice + optionPriceSum) * quantity;
    }

    public boolean hasSameOptions(List<Option> newOptions) {
        if (this.options == null && newOptions == null) return true;
        if (this.options == null || newOptions == null) return false;
        if (this.options.size() != newOptions.size()) return false;
        
        return this.options.containsAll(newOptions) && newOptions.containsAll(this.options);
    }

    public void addQuantity(int amount) {
        this.quantity += amount;
    }

    public void updateQuantity(int quantity) {
        if (quantity > 0) {
            this.quantity = quantity;
        }
    }
}
