package com.new_cafe.app.backend.cart.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class Cart {
    private String cartId; // To identify who owns the cart (e.g., guestId or userId)
    
    @Builder.Default
    private List<CartItem> items = new ArrayList<>();

    public List<CartItem> getItems() {
        if (items == null) {
            items = new ArrayList<>();
        }
        return items;
    }

    @com.fasterxml.jackson.annotation.JsonProperty("totalPrice")
    public int getTotalPrice() {
        return items.stream()
                .mapToInt(CartItem::getTotalPrice)
                .sum();
    }

    public void addOrUpdateItem(CartItem newItem) {
        Optional<CartItem> existingItem = items.stream()
                .filter(i -> i.getMenuId().equals(newItem.getMenuId()) && i.hasSameOptions(newItem.getOptions()))
                .findFirst();

        if (existingItem.isPresent()) {
            existingItem.get().addQuantity(newItem.getQuantity());
        } else {
            items.add(newItem);
        }
    }

    public void updateQuantity(String cartItemId, int quantity) {
        items.stream()
                .filter(i -> i.getId().equals(cartItemId))
                .findFirst()
                .ifPresent(i -> i.updateQuantity(quantity));
    }

    public void updateOptions(String cartItemId, List<Option> options) {
        items.stream()
                .filter(i -> i.getId().equals(cartItemId))
                .findFirst()
                .ifPresent(i -> i.setOptions(options));
    }

    public void removeItem(String cartItemId) {
        items.removeIf(i -> i.getId().equals(cartItemId));
    }

    public void mergeFrom(Cart otherCart) {
        if (otherCart == null || otherCart.getItems() == null || otherCart.getItems().isEmpty()) {
            return;
        }
        for (CartItem otherItem : otherCart.getItems()) {
            addOrUpdateItem(otherItem);
        }
    }
}
