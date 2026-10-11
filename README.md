# Dermify - Smart Skincare Product Recommendation System

An **educational** skincare e-commerce website with a rule-based product recommender and a Java OOP backend design.

> **Disclaimer:** Dermify does not diagnose skin conditions or give medical advice.
> *Recommendations are educational and not medical advice.*

## Features

- Modern home page: hero banner, call-to-action buttons, featured products, benefits section
- Product catalogue with cards (image, name, category, price, availability, short description)
- Live search, category filter, in-stock filter, sort by price or name
- Product details modal
- 6 categories: Cleanser, Moisturizer, Sunscreen, Serum, Acne Treatment, Sensitive Skin Care
- Cart: add, remove, change quantity, total price, empty cart, live item counter (saved in `localStorage`)
- Skin Finder: pick concerns (Acne, Dry, Oily, Sensitive, Dark Spots, Combination) and get products plus an explanation of the rule used
- Contact form with validation (name, email, message)
- About page with educational purpose and team placeholder
- Glassmorphism cards, smooth animations, responsive layout (white, light blue, soft green, lavender)

## Technologies used

| Part | Tools |
|---|---|
| Frontend | HTML5, CSS3, JavaScript (ES6), Bootstrap 5.3, Bootstrap Icons, Google Fonts |
| Backend design | Java (OOP): encapsulation, constructors, getters/setters, overriding |
| Data structures | `ArrayList<Product>`, `HashMap<String, Category>`, Collections framework |
| Algorithms | Linear search, filtering, selection sort by price, score-based recommendation matching |

## Folder structure

```
dermify/
├── index.html            Home page
├── products.html         Catalogue (search, filter, sort, details modal)
├── recommend.html        Skin Finder (rule-based recommendations)
├── cart.html             Shopping cart
├── about.html            About + team placeholder
├── contact.html          Contact form with validation
├── css/
│   └── style.css         Theme, glassmorphism, responsive rules
├── js/
│   ├── data.js           Sample products, categories, recommendation rules
│   └── app.js            Navbar/footer, cart, search/filter/sort, recommender, forms
├── data/
│   ├── products.csv      Sample dataset (spreadsheet-friendly)
│   └── products.json     Same dataset as JSON
├── backend/
│   └── src/com/dermify/
│       ├── Product.java
│       ├── Category.java
│       ├── CartItem.java
│       ├── ShoppingCart.java
│       ├── RecommendationEngine.java
│       ├── ProductManager.java
│       └── Main.java
├── docs/
│   └── CLASS_DIAGRAM.md  Text class diagram + OOP/DSA tables
└── README.md
```

## How to run

**Website:** double-click `index.html` (needs internet once for Bootstrap and fonts from CDN). For a local server: `python -m http.server 8000`, then open <http://localhost:8000>.

**Java demo** (JDK 17 or newer):

```bash
cd backend
mkdir out
javac -d out src/com/dermify/*.java
java -cp out com.dermify.Main
```

The demo prints: all products, a linear search, a category filter, a price sort, the HashMap category map, recommendations for `acne` + `oily`, and a full cart walk-through.

## How the recommendation works

1. Each product has **tags** (the concerns it is labelled for), for example `["acne", "oily"]`.
2. The user selects concerns. Rule: *if Acne is selected, show products tagged Acne.*
3. Each product gets a **score** = number of selected concerns it matches. Score 0 = not shown.
4. Results are sorted by score (high to low), then price (low to high).
5. The page shows which rule produced the results, plus the disclaimer.

## What is connected and what is not

- The **website** runs fully in the browser using `js/data.js`. It does **not** call the Java code.
- The **Java classes** implement the same ideas (same 14 products, same rules, same cart behaviour) as a separate console program.
- Connecting them (for example a REST API in Spring Boot or `HttpServer`, plus a database via JDBC) is a good next step but is **not** included here.

## Ideas for future work

- Serve products from the Java backend through a REST API
- Store products in SQLite with JDBC
- Unit tests with JUnit for `ShoppingCart` and `RecommendationEngine`
- User accounts and order history
