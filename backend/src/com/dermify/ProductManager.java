package com.dermify;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * ProductManager - stores all products and offers the DSA features:
 *   - Linear search
 *   - Filtering
 *   - Sorting by price
 * Data structures used: ArrayList<Product> and HashMap<String, Category>.
 */
public class ProductManager {

    private final ArrayList<Product> products = new ArrayList<>();
    private final HashMap<String, Category> categories = new HashMap<>();

    public ProductManager() {
        loadSampleData();
    }

    // ---------- Adding data ----------
    public void addProduct(Product p) {
        products.add(p);
        // category mapping: create the category the first time we see it
        Category c = categories.get(p.getCategory());
        if (c == null) {
            c = new Category(p.getCategory(), "");
            categories.put(p.getCategory(), c);
        }
        c.addProduct(p);
    }

    // ---------- LINEAR SEARCH: O(n) ----------
    /** Look at every product one by one; keep those whose name contains the keyword. */
    public List<Product> linearSearch(String keyword) {
        List<Product> found = new ArrayList<>();
        String key = keyword.toLowerCase();
        for (int i = 0; i < products.size(); i++) {
            Product p = products.get(i);
            if (p.getName().toLowerCase().contains(key)
                    || p.getDescription().toLowerCase().contains(key)) {
                found.add(p);
            }
        }
        return found;
    }

    /** Linear search by id: returns the product or null. */
    public Product findById(int id) {
        for (Product p : products) {
            if (p.getId() == id) return p;
        }
        return null;
    }

    // ---------- FILTERING ALGORITHM ----------
    public List<Product> filterByCategory(String categoryName) {
        List<Product> result = new ArrayList<>();
        for (Product p : products) {
            if (p.getCategory().equalsIgnoreCase(categoryName)) {
                result.add(p);
            }
        }
        return result;
    }

    public List<Product> filterInStock() {
        List<Product> result = new ArrayList<>();
        for (Product p : products) {
            if (p.isInStock()) result.add(p);
        }
        return result;
    }

    // ---------- SORTING BY PRICE (selection sort, written by hand) ----------
    /** Returns a NEW sorted list; the original list is not changed. */
    public List<Product> sortByPrice(boolean ascending) {
        List<Product> sorted = new ArrayList<>(products);
        for (int i = 0; i < sorted.size() - 1; i++) {
            int best = i;                              // index of the "best" item so far
            for (int j = i + 1; j < sorted.size(); j++) {
                boolean better = ascending
                        ? sorted.get(j).getPrice() < sorted.get(best).getPrice()
                        : sorted.get(j).getPrice() > sorted.get(best).getPrice();
                if (better) best = j;
            }
            // swap
            Product temp = sorted.get(i);
            sorted.set(i, sorted.get(best));
            sorted.set(best, temp);
        }
        return sorted;
    }

    // ---------- Getters ----------
    public List<Product> getAllProducts() { return products; }
    public Map<String, Category> getCategories() { return categories; }

    // ---------- Sample data (same products as js/data.js, shortened) ----------
    private void loadSampleData() {
        addProduct(new Product(1, "Gentle Foam Cleanser", "Cleanser", 12.00, true,
                "Soft daily foaming wash.", Arrays.asList("sensitive", "combination", "oily")));
        addProduct(new Product(2, "Hydra Cream Cleanser", "Cleanser", 14.50, true,
                "Creamy cleanser that leaves skin comfortable.", Arrays.asList("dry", "sensitive")));
        addProduct(new Product(3, "Clear Balance Gel Cleanser", "Cleanser", 11.00, true,
                "Light gel wash for blemish-prone skin.", Arrays.asList("acne", "oily")));
        addProduct(new Product(4, "Barrier Moisture Cream", "Moisturizer", 18.00, true,
                "Rich cream with ceramides.", Arrays.asList("dry", "sensitive")));
        addProduct(new Product(5, "Oil-Free Gel Moisturizer", "Moisturizer", 16.00, true,
                "Water-light gel hydration.", Arrays.asList("oily", "combination", "acne")));
        addProduct(new Product(6, "Daily Shield SPF 50", "Sunscreen", 19.00, true,
                "Broad-spectrum daily sunscreen.", Arrays.asList("darkspots", "combination", "oily")));
        addProduct(new Product(7, "Mineral Calm SPF 40", "Sunscreen", 21.00, false,
                "Mineral sunscreen for sensitive skin.", Arrays.asList("sensitive", "darkspots")));
        addProduct(new Product(8, "Niacinamide 10% Serum", "Serum", 13.00, true,
                "Lightweight serum for a balanced look.", Arrays.asList("oily", "acne", "combination", "darkspots")));
        addProduct(new Product(9, "Hyaluronic Boost Serum", "Serum", 15.00, true,
                "Hydrating serum with hyaluronic acid.", Arrays.asList("dry", "combination", "sensitive")));
        addProduct(new Product(10, "Brightening Vitamin C Serum", "Serum", 24.00, true,
                "Vitamin C serum for an even-looking tone.", Arrays.asList("darkspots")));
        addProduct(new Product(11, "Spot Care Gel", "Acne Treatment", 10.00, true,
                "Targeted gel for occasional blemishes.", Arrays.asList("acne", "oily")));
        addProduct(new Product(12, "Clarifying Salicylic Lotion", "Acne Treatment", 17.00, true,
                "Leave-on lotion with 2% salicylic acid.", Arrays.asList("acne", "oily", "combination")));
        addProduct(new Product(13, "Soothe Fragrance-Free Lotion", "Sensitive Skin Care", 15.50, true,
                "Fragrance-free lotion for easily irritated skin.", Arrays.asList("sensitive", "dry")));
        addProduct(new Product(14, "Calm Centella Cream", "Sensitive Skin Care", 20.00, true,
                "Calming cream with centella extract.", Arrays.asList("sensitive", "acne")));
    }
}
