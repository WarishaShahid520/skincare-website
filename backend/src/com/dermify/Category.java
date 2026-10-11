package com.dermify;

import java.util.ArrayList;
import java.util.List;

/**
 * Category - a group of products (Cleanser, Serum, ...).
 * Used as the VALUE in a HashMap<String, Category> inside ProductManager.
 */
public class Category {

    private String name;
    private String description;
    private List<Product> products = new ArrayList<>();

    public Category(String name, String description) {
        this.name = name;
        this.description = description;
    }

    public String getName() { return name; }
    public String getDescription() { return description; }
    public List<Product> getProducts() { return products; }

    public void addProduct(Product p) { products.add(p); }

    public int size() { return products.size(); }

    @Override
    public String toString() {
        return name + " (" + products.size() + " products)";
    }
}
