package com.dermify;

import java.util.Arrays;
import java.util.List;

/**
 * Main - a small console demo that shows every class working together.
 * Run it, then read the output next to the code.
 */
public class Main {

    public static void main(String[] args) {
        ProductManager manager = new ProductManager();
        RecommendationEngine engine = new RecommendationEngine();
        ShoppingCart cart = new ShoppingCart();

        System.out.println("=== DERMIFY (educational project) ===\n");

        // 1. All products
        System.out.println("1) All products:");
        printList(manager.getAllProducts());

        // 2. Linear search
        System.out.println("\n2) Linear search for 'serum':");
        printList(manager.linearSearch("serum"));

        // 3. Filtering
        System.out.println("\n3) Filter by category 'Sunscreen':");
        printList(manager.filterByCategory("Sunscreen"));

        // 4. Sorting by price
        System.out.println("\n4) Sorted by price (low to high):");
        printList(manager.sortByPrice(true));

        // 5. HashMap category mapping
        System.out.println("\n5) Category map:");
        manager.getCategories().forEach((name, cat) -> System.out.println("  " + cat));

        // 6. Recommendations
        List<String> concerns = Arrays.asList("acne", "oily");
        System.out.println("\n6) Recommendations for " + concerns + ":");
        for (String c : concerns) {
            System.out.println("  Rule: " + engine.explain(c));
        }
        printList(engine.recommend(manager.getAllProducts(), concerns));
        System.out.println("  * " + RecommendationEngine.DISCLAIMER);

        // 7. Cart
        System.out.println("\n7) Cart demo:");
        cart.addProduct(manager.findById(3));
        cart.addProduct(manager.findById(3));   // same product -> quantity becomes 2
        cart.addProduct(manager.findById(8));
        cart.addProduct(manager.findById(7));   // out of stock -> message
        cart.updateQuantity(8, 3);
        System.out.println(cart);
        System.out.println("  Items in cart: " + cart.getItemCount());
        cart.removeProduct(3);
        System.out.println("After removing product 3:\n" + cart);
        cart.empty();
        System.out.println("After emptying: " + cart);
    }

    private static void printList(List<Product> list) {
        if (list.isEmpty()) {
            System.out.println("  (nothing found)");
            return;
        }
        for (Product p : list) {
            System.out.println("  " + p);
        }
    }
}
