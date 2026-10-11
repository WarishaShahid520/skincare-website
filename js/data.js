/* =====================================================================
   data.js  -  SAMPLE PRODUCT DATASET + RECOMMENDATION RULES
   ---------------------------------------------------------------------
   These 14 products match the ones inside the Java class ProductManager.
   Each product has "tags": the skin concerns it is labelled for.
   Tags are what the rule-based recommendation uses.
   This is educational data only - no medical claims.
   ===================================================================== */

const CATEGORIES = [
  { name: "Cleanser",            icon: "bi-droplet",        blurb: "Gentle daily washes" },
  { name: "Moisturizer",         icon: "bi-cloud-haze2",    blurb: "Hydration for every skin type" },
  { name: "Sunscreen",           icon: "bi-brightness-high", blurb: "Daily UV protection" },
  { name: "Serum",               icon: "bi-eyedropper",     blurb: "Targeted, lightweight formulas" },
  { name: "Acne Treatment",      icon: "bi-bullseye",       blurb: "Spot and blemish care" },
  { name: "Sensitive Skin Care", icon: "bi-heart",          blurb: "Fragrance-free and gentle" }
];

const PRODUCTS = [
  { id: 1,  name: "Gentle Foam Cleanser", category: "Cleanser", price: 12.00, inStock: true, featured: true,
    description: "Soft daily foaming wash.",
    details: "A mild, low-foam face wash designed for everyday use. Free from added fragrance. Use morning and night on damp skin, then rinse with lukewarm water.",
    tags: ["sensitive", "combination", "oily"] },
  { id: 2,  name: "Hydra Cream Cleanser", category: "Cleanser", price: 14.50, inStock: true, featured: false,
    description: "Creamy cleanser that leaves skin comfortable.",
    details: "A milky, non-foaming cleanser that removes dirt without leaving skin feeling tight. Massage onto skin and wipe or rinse off.",
    tags: ["dry", "sensitive"] },
  { id: 3,  name: "Clear Balance Gel Cleanser", category: "Cleanser", price: 11.00, inStock: true, featured: false,
    description: "Light gel wash for blemish-prone skin.",
    details: "A clear gel cleanser with a fresh, light feel. Helps remove excess oil and sunscreen. Suitable for twice-daily use.",
    tags: ["acne", "oily"] },
  { id: 4,  name: "Barrier Moisture Cream", category: "Moisturizer", price: 18.00, inStock: true, featured: true,
    description: "Rich cream with ceramides.",
    details: "A comforting cream with ceramides and glycerin to support the skin's moisture barrier. Apply to clean skin after serum.",
    tags: ["dry", "sensitive"] },
  { id: 5,  name: "Oil-Free Gel Moisturizer", category: "Moisturizer", price: 16.00, inStock: true, featured: false,
    description: "Water-light gel hydration.",
    details: "A fast-absorbing, oil-free gel that adds hydration without a greasy finish. Works well under sunscreen and makeup.",
    tags: ["oily", "combination", "acne"] },
  { id: 6,  name: "Daily Shield SPF 50", category: "Sunscreen", price: 19.00, inStock: true, featured: true,
    description: "Broad-spectrum daily sunscreen.",
    details: "A lightweight, invisible-finish sunscreen for daily use. Apply generously as the last step of your morning routine and reapply every two hours outdoors.",
    tags: ["darkspots", "combination", "oily"] },
  { id: 7,  name: "Mineral Calm SPF 40", category: "Sunscreen", price: 21.00, inStock: false, featured: false,
    description: "Mineral sunscreen for sensitive skin.",
    details: "A mineral (zinc-based) sunscreen with a soft, fragrance-free formula. Currently out of stock.",
    tags: ["sensitive", "darkspots"] },
  { id: 8,  name: "Niacinamide 10% Serum", category: "Serum", price: 13.00, inStock: true, featured: true,
    description: "Lightweight serum for a balanced look.",
    details: "A water-based serum with niacinamide and zinc. Apply a few drops to clean skin before moisturizer. Patch-test first.",
    tags: ["oily", "acne", "combination", "darkspots"] },
  { id: 9,  name: "Hyaluronic Boost Serum", category: "Serum", price: 15.00, inStock: true, featured: false,
    description: "Hydrating serum with hyaluronic acid.",
    details: "A plumping, lightweight hydration serum. Apply to slightly damp skin and follow with a moisturizer.",
    tags: ["dry", "combination", "sensitive"] },
  { id: 10, name: "Brightening Vitamin C Serum", category: "Serum", price: 24.00, inStock: true, featured: true,
    description: "Vitamin C serum for an even-looking tone.",
    details: "A stable vitamin C serum aimed at a brighter, more even-looking complexion. Use in the morning, followed by sunscreen.",
    tags: ["darkspots"] },
  { id: 11, name: "Spot Care Gel", category: "Acne Treatment", price: 10.00, inStock: true, featured: false,
    description: "Targeted gel for occasional blemishes.",
    details: "A small-tube gel to dab on individual blemishes at night. Do not use on broken skin.",
    tags: ["acne", "oily"] },
  { id: 12, name: "Clarifying Salicylic Lotion", category: "Acne Treatment", price: 17.00, inStock: true, featured: false,
    description: "Leave-on lotion with 2% salicylic acid.",
    details: "A leave-on exfoliating lotion to help keep pores clear. Start a few times a week and use sunscreen daily.",
    tags: ["acne", "oily", "combination"] },
  { id: 13, name: "Soothe Fragrance-Free Lotion", category: "Sensitive Skin Care", price: 15.50, inStock: true, featured: false,
    description: "Fragrance-free lotion for easily irritated skin.",
    details: "A simple, short-ingredient lotion without fragrance or essential oils, made for skin that dislikes complicated formulas.",
    tags: ["sensitive", "dry"] },
  { id: 14, name: "Calm Centella Cream", category: "Sensitive Skin Care", price: 20.00, inStock: true, featured: true,
    description: "Calming cream with centella extract.",
    details: "A light cream with centella asiatica extract and panthenol for a calm, comfortable feel.",
    tags: ["sensitive", "acne"] }
];

/* Rule-based recommendation: concern -> label + explanation */
const CONCERNS = {
  acne:        { label: "Acne",             icon: "bi-bullseye",
                 rule: "Acne is selected, so we show products tagged for Acne (like acne treatments and oil-free formulas)." },
  dry:         { label: "Dry Skin",         icon: "bi-droplet-half",
                 rule: "Dry Skin is selected, so we show products tagged for Dry Skin (rich hydrating creams and serums)." },
  oily:        { label: "Oily Skin",        icon: "bi-brightness-alt-high",
                 rule: "Oily Skin is selected, so we show products tagged for Oily Skin (light gels and oil-free formulas)." },
  sensitive:   { label: "Sensitive Skin",   icon: "bi-heart",
                 rule: "Sensitive Skin is selected, so we show products tagged for Sensitive Skin (fragrance-free, gentle options)." },
  darkspots:   { label: "Dark Spots",       icon: "bi-circle-half",
                 rule: "Dark Spots is selected, so we show products tagged for Dark Spots (brightening serums and sunscreens)." },
  combination: { label: "Combination Skin", icon: "bi-yin-yang",
                 rule: "Combination Skin is selected, so we show products tagged for Combination Skin (balanced, lightweight formulas)." }
};

const DISCLAIMER = "Recommendations are educational and not medical advice.";
