package com.dermify;

/**
 * CartItem - one line in the cart: a product + how many the user wants.
 * This is "composition": a CartItem HAS A Product.
 */
public class CartItem {

    private Product product;
    private int quantity;

    public CartItem(Product product, int quantity) {
        this.product = product;
        setQuantity(quantity);
    }

    public Product getProduct() { return product; }
    public int getQuantity() { return quantity; }

    public void setQuantity(int quantity) {
        if (quantity < 1) {
            throw new IllegalArgumentException("Quantity must be at least 1");
        }
        this.quantity = quantity;
    }

    public void increase() { quantity++; }

    /** Price of this line = unit price x quantity */
    public double getSubtotal() {
        return product.getPrice() * quantity;
    }

    @Override
    public String toString() {
        return String.format("%-28s x%d  = $%.2f", product.getName(), quantity, getSubtotal());
    }
}
