# Dermify - Class Diagram (text format)

## 1. Classes, fields and methods

```
+------------------------------+          +-----------------------------+
|           Product            |          |          Category           |
+------------------------------+          +-----------------------------+
| - id : int                   |          | - name : String             |
| - name : String              |          | - description : String      |
| - category : String          |          | - products : List<Product>  |
| - price : double             |          +-----------------------------+
| - inStock : boolean          |          | + addProduct(Product)       |
| - description : String       |          | + size() : int              |
| - tags : List<String>        |          | + toString() : String       |
+------------------------------+          +-----------------------------+
| + getters / setters          |
| + addTag(String)             |
| + hasTag(String) : boolean   |
| + toString()   (override)    |
| + equals()     (override)    |
| + hashCode()   (override)    |
+------------------------------+
            ^
            | has-a (1 product)
+------------------------------+          +-----------------------------+
|          CartItem            |   many   |        ShoppingCart         |
+------------------------------+<---------+-----------------------------+
| - product : Product          |          | - items : List<CartItem>    |
| - quantity : int             |          +-----------------------------+
+------------------------------+          | + addProduct(Product)       |
| + getSubtotal() : double     |          | + removeProduct(int)        |
| + increase()                 |          | + updateQuantity(int,int)   |
| + toString()   (override)    |          | + getTotal() : double       |
+------------------------------+          | + getItemCount() : int      |
                                          | + empty()                   |
                                          +-----------------------------+

+--------------------------------------+   +-------------------------------------+
|           ProductManager             |   |        RecommendationEngine         |
+--------------------------------------+   +-------------------------------------+
| - products : ArrayList<Product>      |   | - rules : Map<String,String>        |
| - categories : HashMap<String,       |   +-------------------------------------+
|                Category>             |   | + recommend(List<Product>,          |
+--------------------------------------+   |             List<String>)           |
| + addProduct(Product)                |   |       : List<Product>               |
| + linearSearch(String) : List        |   | + explain(String) : String          |
| + findById(int) : Product            |   | + getSupportedConcerns() : List     |
| + filterByCategory(String) : List    |   +-------------------------------------+
| + filterInStock() : List             |
| + sortByPrice(boolean) : List        |   +-------------------------------------+
+--------------------------------------+   |               Main                  |
                                           +-------------------------------------+
                                           | + main(String[])  (console demo)    |
                                           +-------------------------------------+
```

## 2. Relationships

```
Main ----------------> ProductManager ----(owns many)----> Product
Main ----------------> RecommendationEngine --(reads)----> Product
Main ----------------> ShoppingCart ----(owns many)----> CartItem ----(has one)----> Product
ProductManager ----(HashMap: name -> Category)----> Category ----(has many)----> Product
```

| Relationship | Type | Meaning |
|---|---|---|
| CartItem -> Product | Composition / association | A cart line HAS a product |
| ShoppingCart -> CartItem | Composition | A cart OWNS its lines |
| ProductManager -> Product | Aggregation | Manager keeps the master list |
| ProductManager -> Category | HashMap value | Category lookup by name in O(1) |
| RecommendationEngine -> Product | Dependency | Reads tags, does not own products |

## 3. OOP concepts and where to find them

| Concept | Where |
|---|---|
| Encapsulation | Private fields + getters/setters in `Product`, `CartItem` |
| Constructors (and overloading) | Two `Product` constructors |
| Method overriding | `toString`, `equals`, `hashCode` in `Product`; `toString` in others |
| Validation in setters | `Product.setPrice`, `CartItem.setQuantity` |
| Collections | `ArrayList`, `HashMap`, `List`, `Map` |

## 4. Algorithms

| Algorithm | Class / method | Time |
|---|---|---|
| Linear search | `ProductManager.linearSearch`, `findById` | O(n) |
| Filtering | `ProductManager.filterByCategory`, `filterInStock` | O(n) |
| Selection sort by price | `ProductManager.sortByPrice` | O(n^2) |
| Recommendation matching + insertion sort | `RecommendationEngine.recommend` | O(n*k + m^2) |
