package com.dermify;

import java.util.ArrayList;
import java.util.List;

/**
 * Product - represents ONE skincare product in the store.
 * Shows ENCAPSULATION: fields are private, access is through getters/setters.
 */
public class Product {

    // ---------- Private fields (hidden from other classes) ----------
    private int id;
    private String name;
    private String category;          // e.g. "Cleanser"
    private double price;
    private boolean inStock;
    private String description;
    private List<String> tags;        // concerns this product suits, e.g. "acne", "dry"

    // ---------- Constructors ----------
    public Product(int id, String name, String category, double price,
                   boolean inStock, String description) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.price = price;
        this.inStock = inStock;
        this.description = description;
        this.tags = new ArrayList<>();
    }

    // Second constructor (constructor overloading): also accepts tags
    public Product(int id, String name, String category, double price,
                   boolean inStock, String description, List<String> tags) {
        this(id, name, category, price, inStock, description);
        this.tags = new ArrayList<>(tags);
    }

    // ---------- Getters ----------
    public int getId() { return id; }
    public String getName() { return name; }
    public String getCategory() { return category; }
    public double getPrice() { return price; }
    public boolean isInStock() { return inStock; }
    public String getDescription() { return description; }
    public List<String> getTags() { return tags; }

    // ---------- Setters (with simple validation) ----------
    public void setName(String name) { this.name = name; }
    public void setCategory(String category) { this.category = category; }
    public void setPrice(double price) {
        if (price < 0) {
            throw new IllegalArgumentException("Price cannot be negative");
        }
        this.price = price;
    }
    public void setInStock(boolean inStock) { this.inStock = inStock; }
    public void setDescription(String description) { this.description = description; }

    public void addTag(String tag) {
        if (!tags.contains(tag)) {
            tags.add(tag);
        }
    }

    /** Returns true if this product is tagged for the given concern. */
    public boolean hasTag(String tag) {
        return tags.contains(tag.toLowerCase());
    }

    // ---------- METHOD OVERRIDING (we replace methods from Object) ----------
    @Override
    public String toString() {
        return String.format("#%d %-28s %-18s $%6.2f  %s",
                id, name, category, price, inStock ? "In stock" : "Out of stock");
    }

    // Two products are "equal" when they have the same id
    @Override
    public boolean equals(Object other) {
        if (this == other) return true;
        if (!(other instanceof Product)) return false;
        return this.id == ((Product) other).id;
    }

    @Override
    public int hashCode() {
        return Integer.hashCode(id);
    }
}
