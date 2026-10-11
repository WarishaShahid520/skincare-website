package com.dermify;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * RecommendationEngine - simple RULE-BASED matching.
 *
 * IMPORTANT: this is NOT a medical tool and does NOT diagnose anything.
 * Rule example: "If Acne is selected, show products tagged 'acne'."
 */
public class RecommendationEngine {

    public static final String DISCLAIMER =
            "Recommendations are educational and not medical advice.";

    // concern name -> explanation text shown to the user
    private final Map<String, String> rules = new HashMap<>();

    public RecommendationEngine() {
        rules.put("acne", "Products tagged for Acne are shown because they are labelled for blemish-prone skin.");
        rules.put("dry", "Products tagged for Dry Skin are shown because they focus on hydration and moisture.");
        rules.put("oily", "Products tagged for Oily Skin are shown because they are lightweight and non-greasy.");
        rules.put("sensitive", "Products tagged for Sensitive Skin are shown because they are labelled gentle.");
        rules.put("darkspots", "Products tagged for Dark Spots are shown because they focus on an even-looking tone.");
        rules.put("combination", "Products tagged for Combination Skin are shown because they balance oily and dry areas.");
    }

    public String explain(String concern) {
        return rules.getOrDefault(concern.toLowerCase(), "No rule found for this concern.");
    }

    /**
     * Recommendation matching logic:
     *  1. Give each product a score = how many selected concerns it matches.
     *  2. Keep only products with score > 0.
     *  3. Sort: highest score first (simple insertion sort), cheaper first when tied.
     */
    public List<Product> recommend(List<Product> allProducts, List<String> selectedConcerns) {
        List<Product> matches = new ArrayList<>();
        Map<Product, Integer> scores = new HashMap<>();

        for (Product p : allProducts) {
            int score = 0;
            for (String concern : selectedConcerns) {
                if (p.hasTag(concern)) score++;
            }
            if (score > 0) {
                matches.add(p);
                scores.put(p, score);
            }
        }

        // Insertion sort by score (descending), then price (ascending)
        for (int i = 1; i < matches.size(); i++) {
            Product key = matches.get(i);
            int j = i - 1;
            while (j >= 0 && isWorse(matches.get(j), key, scores)) {
                matches.set(j + 1, matches.get(j));
                j--;
            }
            matches.set(j + 1, key);
        }
        return matches;
    }

    // true when 'a' should come AFTER 'b'
    private boolean isWorse(Product a, Product b, Map<Product, Integer> scores) {
        int sa = scores.get(a), sb = scores.get(b);
        if (sa != sb) return sa < sb;
        return a.getPrice() > b.getPrice();
    }

    public List<String> getSupportedConcerns() {
        List<String> list = new ArrayList<>(rules.keySet());
        Collections.sort(list);
        return list;
    }
}
