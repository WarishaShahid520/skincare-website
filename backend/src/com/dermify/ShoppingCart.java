package com.dermify;

import java.util.ArrayList;
import java.util.List;

/**
 * ShoppingCart - holds CartItems. Add, remove, update, total, empty.
 */
public class ShoppingCart {

    private final List<CartItem> items = new ArrayList<>();

    /** Add a product. If it is already in the cart, just increase the quantity. */
    public void addProduct(Product product) {
        if (!product.isInStock()) {
            System.out.println("Sorry, " + product.getName() + " is out of stock.");
            return;
        }
        CartItem existing = findItem(product.getId());
        if (existing != null) {
            existing.increase();
        } else {
            items.add(new CartItem(product, 1));
        }
    }

    /** Remove a product completely. Returns true if something was removed. */
    public boolean removeProduct(int productId) {
        CartItem existing = findItem(productId);
        return existing != null && items.remove(existing);
    }

    /** Change quantity. A quantity of 0 or less removes the item. */
    public void updateQuantity(int productId, int newQuantity) {
        CartItem existing = findItem(productId);
        if (existing == null) return;
        if (newQuantity <= 0) {
            items.remove(existing);
        } else {
            existing.setQuantity(newQuantity);
        }
    }

    public double getTotal() {
        double total = 0;
        for (CartItem item : items) {
            total += item.getSubtotal();
        }
        return total;
    }

    /** Total number of units (this is the "cart counter" on the website). */
    public int getItemCount() {
        int count = 0;
        for (CartItem item : items) {
            count += item.getQuantity();
        }
        return count;
    }

    public void empty() { items.clear(); }

    public boolean isEmpty() { return items.isEmpty(); }

    public List<CartItem> getItems() { return items; }

    // Private helper: linear search through the cart
    private CartItem findItem(int productId) {
        for (CartItem item : items) {
            if (item.getProduct().getId() == productId) {
                return item;
            }
        }
        return null;
    }

    @Override
    public String toString() {
        if (items.isEmpty()) return "Cart is empty.";
        StringBuilder sb = new StringBuilder();
        for (CartItem item : items) {
            sb.append("  ").append(item).append("\n");
        }
        sb.append(String.format("  TOTAL: $%.2f", getTotal()));
        return sb.toString();
    }
}
