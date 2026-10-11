/* =====================================================================
   app.js  -  Dermify front-end logic (plain JavaScript, no frameworks)
   ---------------------------------------------------------------------
   Sections:
     1. Helpers & product images (SVG drawn in code, no image files)
     2. Shared layout (navbar, footer, product modal, toast)
     3. Cart system (saved in the browser with localStorage)
     4. DSA: linear search, filtering, sorting by price
     5. Recommendation engine (rule-based)
     6. Page setup (home, products, recommend, cart, contact)
   The same ideas exist in Java inside /backend/src/com/dermify.
   ===================================================================== */

/* ---------- 1. HELPERS & PRODUCT IMAGES ---------- */

const money = (n) => "$" + n.toFixed(2);
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
const getProduct = (id) => PRODUCTS.find((p) => p.id === id);

// Colours used for each category's product picture
const CAT_COLORS = {
  "Cleanser":            ["#d6eeff", "#6fb9ee"],
  "Moisturizer":         ["#e9e1ff", "#a58ae6"],
  "Sunscreen":           ["#fff1d2", "#f0b55a"],
  "Serum":               ["#d9f5e6", "#5cc592"],
  "Acne Treatment":      ["#ffe0ea", "#ee86a6"],
  "Sensitive Skin Care": ["#e4f1ff", "#8fa6f0"]
};

/** Draws a simple product illustration as an SVG and returns it as a data URI. */
function productImage(p) {
  const [bg, fg] = CAT_COLORS[p.category] || ["#eee", "#999"];
  let shape = "";
  const label = `<rect x="112" y="150" width="76" height="52" rx="8" fill="#fff" opacity=".9"/>
                 <text x="150" y="172" font-family="Georgia,serif" font-size="11" text-anchor="middle" fill="${fg}">Dermify</text>
                 <rect x="128" y="182" width="44" height="3" rx="2" fill="${fg}" opacity=".5"/>
                 <rect x="136" y="190" width="28" height="3" rx="2" fill="${fg}" opacity=".35"/>`;

  if (p.category === "Moisturizer") {                        // jar
    shape = `<rect x="85" y="130" width="130" height="85" rx="18" fill="${fg}"/>
             <rect x="80" y="104" width="140" height="34" rx="12" fill="#fff"/>
             <rect x="80" y="104" width="140" height="34" rx="12" fill="${fg}" opacity=".25"/>
             <rect x="108" y="152" width="84" height="46" rx="8" fill="#fff" opacity=".9"/>
             <text x="150" y="180" font-family="Georgia,serif" font-size="13" text-anchor="middle" fill="${fg}">Dermify</text>`;
  } else if (p.category === "Serum") {                       // dropper bottle
    shape = `<rect x="132" y="48" width="36" height="46" rx="16" fill="#fff"/>
             <rect x="140" y="88" width="20" height="30" fill="${fg}" opacity=".6"/>
             <rect x="100" y="112" width="100" height="112" rx="20" fill="${fg}"/>
             <rect x="96" y="104" width="108" height="16" rx="6" fill="#fff"/>${label.replace('y="150"', 'y="140"').replace('y="172"', 'y="162"').replace('y="182"', 'y="172"').replace('y="190"', 'y="180"')}`;
  } else if (p.category === "Sunscreen" || p.category === "Acne Treatment") {   // tube
    const h = p.category === "Sunscreen" ? 170 : 130;
    shape = `<path d="M105 ${230 - h} h90 l-8 ${h - 14} h-74 z" fill="${fg}"/>
             <rect x="102" y="${224 - h + 6}" width="96" height="14" rx="4" fill="#fff" opacity=".85"/>
             <rect x="128" y="206" width="44" height="26" rx="6" fill="#fff"/>
             <rect x="112" y="${150 + (p.category === "Sunscreen" ? 0 : 6)}" width="76" height="52" rx="8" fill="#fff" opacity=".9"/>
             <text x="150" y="${172 + (p.category === "Sunscreen" ? 0 : 6)}" font-family="Georgia,serif" font-size="11" text-anchor="middle" fill="${fg}">Dermify</text>`;
  } else {                                                   // pump bottle (cleanser, sensitive)
    shape = `<rect x="138" y="50" width="24" height="26" rx="6" fill="#fff"/>
             <rect x="138" y="42" width="52" height="14" rx="7" fill="#fff"/>
             <rect x="144" y="74" width="12" height="34" fill="${fg}" opacity=".6"/>
             <rect x="102" y="104" width="96" height="124" rx="22" fill="${fg}"/>${label}`;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 260">
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${bg}"/><stop offset="1" stop-color="#ffffff"/></linearGradient></defs>
    <rect width="300" height="260" fill="url(#g)"/>
    <circle cx="245" cy="45" r="38" fill="${fg}" opacity=".12"/>
    <circle cx="50" cy="215" r="48" fill="${fg}" opacity=".10"/>
    <ellipse cx="150" cy="236" rx="70" ry="9" fill="#000" opacity=".08"/>
    ${shape}
  </svg>`;
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}

/* ---------- 2. SHARED LAYOUT ---------- */

const PAGES = [
  { file: "index.html",     key: "home",      label: "Home" },
  { file: "products.html",  key: "products",  label: "Shop" },
  { file: "recommend.html", key: "recommend", label: "Skin Finder" },
  { file: "about.html",     key: "about",     label: "About" },
  { file: "contact.html",   key: "contact",   label: "Contact" }
];

function renderNavbar() {
  const current = document.body.dataset.page;
  const links = PAGES.map((p) =>
    `<li class="nav-item"><a class="nav-link ${p.key === current ? "active" : ""}" href="${p.file}">${p.label}</a></li>`
  ).join("");

  $("#navbar").innerHTML = `
    <nav class="navbar navbar-expand-lg dermify-nav fixed-top">
      <div class="container">
        <a class="navbar-brand" href="index.html"><span class="brand-dot"></span>Dermify</a>
        <button class="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navMenu" aria-label="Toggle menu">
          <i class="bi bi-list fs-2"></i>
        </button>
        <div class="collapse navbar-collapse" id="navMenu">
          <ul class="navbar-nav mx-auto mb-2 mb-lg-0">${links}</ul>
          <a href="cart.html" class="btn btn-cart position-relative" aria-label="Open cart">
            <i class="bi bi-bag"></i> Cart
            <span id="cartCount" class="cart-badge">0</span>
          </a>
        </div>
      </div>
    </nav>`;
}

function renderFooter() {
  $("#footer").innerHTML = `
    <footer class="dermify-footer">
      <div class="container">
        <div class="row g-4">
          <div class="col-lg-4">
            <a class="navbar-brand text-white" href="index.html"><span class="brand-dot"></span>Dermify</a>
            <p class="mt-3 small opacity-75">A student-built skincare product explorer. Educational project only &mdash; not a real store and not medical advice.</p>
          </div>
          <div class="col-6 col-lg-2">
            <h6>Explore</h6>
            <ul class="list-unstyled small">
              <li><a href="products.html">Shop all</a></li>
              <li><a href="recommend.html">Skin Finder</a></li>
              <li><a href="cart.html">Cart</a></li>
            </ul>
          </div>
          <div class="col-6 col-lg-2">
            <h6>Company</h6>
            <ul class="list-unstyled small">
              <li><a href="about.html">About</a></li>
              <li><a href="contact.html">Contact</a></li>
            </ul>
          </div>
          <div class="col-lg-4">
            <h6>Categories</h6>
            <div class="d-flex flex-wrap gap-2">
              ${CATEGORIES.map((c) => `<a class="footer-chip" href="products.html?category=${encodeURIComponent(c.name)}">${c.name}</a>`).join("")}
            </div>
          </div>
        </div>
        <hr class="opacity-25 my-4">
        <p class="small opacity-75 mb-0">&copy; ${new Date().getFullYear()} Dermify &middot; ${DISCLAIMER}</p>
      </div>
    </footer>`;
}

/** One shared product-details modal + toast container are added to every page. */
function renderSharedWidgets() {
  document.body.insertAdjacentHTML("beforeend", `
    <div class="modal fade" id="productModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content glass-modal">
          <div class="modal-body p-0" id="productModalBody"></div>
        </div>
      </div>
    </div>
    <div class="toast-container position-fixed bottom-0 end-0 p-3">
      <div id="appToast" class="toast align-items-center border-0" role="status" aria-live="polite">
        <div class="d-flex"><div class="toast-body" id="toastMsg"></div>
        <button class="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button></div>
      </div>
    </div>`);
}

function showToast(message) {
  $("#toastMsg").textContent = message;
  bootstrap.Toast.getOrCreateInstance($("#appToast"), { delay: 2200 }).show();
}

/** Builds the HTML for one product card. */
function productCard(p, extraHtml = "") {
  const stock = p.inStock
    ? `<span class="badge-stock in"><i class="bi bi-check-circle-fill"></i> In stock</span>`
    : `<span class="badge-stock out"><i class="bi bi-x-circle-fill"></i> Out of stock</span>`;
  return `
    <div class="col-sm-6 col-lg-4 col-xl-3 reveal">
      <article class="product-card glass h-100">
        <button class="product-img-btn" data-details="${p.id}" aria-label="View details for ${p.name}">
          <img src="${productImage(p)}" alt="${p.name}" loading="lazy">
        </button>
        <div class="p-3 d-flex flex-column">
          <div class="d-flex justify-content-between align-items-center mb-1">
            <span class="cat-label">${p.category}</span>${stock}
          </div>
          <h3 class="product-name">${p.name}</h3>
          <p class="small text-muted mb-2">${p.description}</p>
          ${extraHtml}
          <div class="d-flex justify-content-between align-items-center mt-auto pt-2">
            <span class="price">${money(p.price)}</span>
            <div class="d-flex gap-2">
              <button class="btn btn-sm btn-soft" data-details="${p.id}">Details</button>
              <button class="btn btn-sm btn-brand" data-add="${p.id}" ${p.inStock ? "" : "disabled"}>
                <i class="bi bi-bag-plus"></i>
              </button>
            </div>
          </div>
        </div>
      </article>
    </div>`;
}

function openProductModal(id) {
  const p = getProduct(id);
  if (!p) return;
  const tags = p.tags.map((t) => `<span class="tag-pill">${CONCERNS[t].label}</span>`).join("");
  $("#productModalBody").innerHTML = `
    <button class="btn-close modal-close" data-bs-dismiss="modal" aria-label="Close"></button>
    <div class="row g-0">
      <div class="col-md-5"><img class="modal-img" src="${productImage(p)}" alt="${p.name}"></div>
      <div class="col-md-7 p-4">
        <span class="cat-label">${p.category}</span>
        <h2 class="h3 mt-1">${p.name}</h2>
        <p class="price fs-4 mb-2">${money(p.price)}</p>
        <p>${p.details}</p>
        <p class="small mb-1 fw-semibold">Labelled for:</p>
        <div class="mb-3">${tags}</div>
        <p class="small text-muted">Educational information only. Patch-test new products and ask a qualified professional about skin concerns.</p>
        <button class="btn btn-brand w-100" data-add="${p.id}" ${p.inStock ? "" : "disabled"}>
          ${p.inStock ? '<i class="bi bi-bag-plus"></i> Add to cart' : "Out of stock"}
        </button>
      </div>
    </div>`;
  bootstrap.Modal.getOrCreateInstance($("#productModal")).show();
}

/** One click listener for the whole page ("event delegation"):
 *  buttons with data-add add to cart, buttons with data-details open the modal. */
function setupGlobalClicks() {
  document.addEventListener("click", (e) => {
    const addBtn = e.target.closest("[data-add]");
    if (addBtn) {
      const id = Number(addBtn.dataset.add);
      if (addToCart(id)) showToast(getProduct(id).name + " added to cart");
      return;
    }
    const detailsBtn = e.target.closest("[data-details]");
    if (detailsBtn) openProductModal(Number(detailsBtn.dataset.details));
  });
}

/** Fade-in animation when elements scroll into view. */
function setupRevealAnimation() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  $$(".reveal").forEach((el) => observer.observe(el));
}

/* ---------- 3. CART SYSTEM ---------- */
// The cart is a list like [{ id: 3, qty: 2 }, { id: 8, qty: 1 }] saved in localStorage.

const CART_KEY = "dermify_cart";

function getCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
  catch (err) { return []; }
}
function saveCart(cart) {
  try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch (err) { /* storage blocked */ }
  updateCartBadge();
}
function addToCart(id) {
  const product = getProduct(id);
  if (!product || !product.inStock) return false;
  const cart = getCart();
  const line = cart.find((item) => item.id === id);
  if (line) line.qty += 1; else cart.push({ id, qty: 1 });
  saveCart(cart);
  return true;
}
function removeFromCart(id) {
  saveCart(getCart().filter((item) => item.id !== id));
}
function updateQuantity(id, qty) {
  if (qty < 1) return removeFromCart(id);
  const cart = getCart();
  const line = cart.find((item) => item.id === id);
  if (line) line.qty = Math.min(qty, 99);
  saveCart(cart);
}
function emptyCart() { saveCart([]); }
function cartItemCount() { return getCart().reduce((sum, item) => sum + item.qty, 0); }
function cartTotal() {
  return getCart().reduce((sum, item) => sum + getProduct(item.id).price * item.qty, 0);
}
function updateCartBadge() {
  const badge = $("#cartCount");
  if (!badge) return;
  const count = cartItemCount();
  badge.textContent = count;
  badge.classList.toggle("d-none", count === 0);
}

/* ---------- 4. DSA: SEARCH, FILTER, SORT ---------- */

/** LINEAR SEARCH - check every product one by one. Time: O(n). */
function linearSearch(list, keyword) {
  const key = keyword.trim().toLowerCase();
  if (key === "") return list.slice();
  const found = [];
  for (let i = 0; i < list.length; i++) {
    const p = list[i];
    if (p.name.toLowerCase().includes(key) || p.description.toLowerCase().includes(key) ||
        p.category.toLowerCase().includes(key)) {
      found.push(p);
    }
  }
  return found;
}

/** FILTERING - keep only products in one category ("All" keeps everything). */
function filterByCategory(list, category) {
  if (category === "All") return list.slice();
  const result = [];
  for (const p of list) {
    if (p.category === category) result.push(p);
  }
  return result;
}

/** SORTING BY PRICE - selection sort written by hand (same as the Java version). */
function sortByPrice(list, ascending) {
  const sorted = list.slice();                     // copy, so the original is untouched
  for (let i = 0; i < sorted.length - 1; i++) {
    let best = i;
    for (let j = i + 1; j < sorted.length; j++) {
      const better = ascending ? sorted[j].price < sorted[best].price
                               : sorted[j].price > sorted[best].price;
      if (better) best = j;
    }
    [sorted[i], sorted[best]] = [sorted[best], sorted[i]];   // swap
  }
  return sorted;
}

/* ---------- 5. RECOMMENDATION ENGINE (RULE-BASED) ---------- */
/* Rule: a product matches when its tags include a selected concern.
   Score = number of selected concerns it matches. Highest score first,
   cheaper first when scores are equal. No diagnosis, no AI. */

function recommend(selectedConcerns) {
  const matches = [];
  for (const p of PRODUCTS) {
    const matched = p.tags.filter((tag) => selectedConcerns.includes(tag));
    if (matched.length > 0) matches.push({ product: p, matched, score: matched.length });
  }
  matches.sort((a, b) => b.score - a.score || a.product.price - b.product.price);
  return matches;
}

/* ---------- 6. PAGE SETUP ---------- */

function initHome() {
  const featured = PRODUCTS.filter((p) => p.featured).slice(0, 4);
  $("#featuredGrid").innerHTML = featured.map((p) => productCard(p)).join("");

  $("#categoryGrid").innerHTML = CATEGORIES.map((c) => `
    <div class="col-6 col-md-4 reveal">
      <a class="category-tile glass" href="products.html?category=${encodeURIComponent(c.name)}">
        <i class="bi ${c.icon}"></i>
        <h3>${c.name}</h3>
        <p>${c.blurb}</p>
      </a>
    </div>`).join("");

  // Hero pictures
  $("#heroImgA").src = productImage(getProduct(8));
  $("#heroImgB").src = productImage(getProduct(4));
  $("#heroImgC").src = productImage(getProduct(6));
}

function initProducts() {
  const state = { search: "", category: "All", sort: "default", inStockOnly: false };
  const params = new URLSearchParams(location.search);
  if (CATEGORIES.some((c) => c.name === params.get("category"))) state.category = params.get("category");

  // Category pills
  const names = ["All", ...CATEGORIES.map((c) => c.name)];
  $("#categoryPills").innerHTML = names.map((n) =>
    `<button class="pill ${n === state.category ? "active" : ""}" data-cat="${n}">${n}</button>`).join("");

  function render() {
    let list = linearSearch(PRODUCTS, state.search);           // 1. search
    list = filterByCategory(list, state.category);             // 2. filter
    if (state.inStockOnly) list = list.filter((p) => p.inStock);
    if (state.sort === "low") list = sortByPrice(list, true);  // 3. sort
    if (state.sort === "high") list = sortByPrice(list, false);
    if (state.sort === "name") list.sort((a, b) => a.name.localeCompare(b.name));

    $("#resultCount").textContent = list.length + (list.length === 1 ? " product" : " products");
    $("#productGrid").innerHTML = list.length
      ? list.map((p) => productCard(p)).join("")
      : `<div class="col-12"><div class="empty-state glass"><i class="bi bi-search"></i>
           <h3>No products found</h3><p>Try a different word or choose another category.</p></div></div>`;
    setupRevealAnimation();
  }

  $("#searchInput").addEventListener("input", (e) => { state.search = e.target.value; render(); });
  $("#sortSelect").addEventListener("change", (e) => { state.sort = e.target.value; render(); });
  $("#stockOnly").addEventListener("change", (e) => { state.inStockOnly = e.target.checked; render(); });
  $("#categoryPills").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-cat]");
    if (!btn) return;
    state.category = btn.dataset.cat;
    $$("#categoryPills .pill").forEach((b) => b.classList.toggle("active", b === btn));
    render();
  });
  render();
}

function initRecommend() {
  // Build the concern chips
  $("#concernChips").innerHTML = Object.entries(CONCERNS).map(([key, c]) => `
    <label class="concern-chip">
      <input type="checkbox" value="${key}">
      <span><i class="bi ${c.icon}"></i> ${c.label}</span>
    </label>`).join("");
  $("#disclaimerText").textContent = DISCLAIMER;

  function showResults() {
    const selected = $$("#concernChips input:checked").map((i) => i.value);
    const box = $("#recResults");
    if (selected.length === 0) {
      box.innerHTML = `<div class="alert alert-warning glass-alert">Please choose at least one skin concern first.</div>`;
      return;
    }
    const results = recommend(selected);

    // Explanation of the rules that were applied
    const explanation = selected.map((key) => `<li>${CONCERNS[key].rule}</li>`).join("");
    const cards = results.map((r) => {
      const why = `<p class="why small mb-2"><i class="bi bi-lightbulb"></i> Matches: ${r.matched.map((m) => CONCERNS[m].label).join(", ")}</p>`;
      return productCard(r.product, why);
    }).join("");

    box.innerHTML = `
      <div class="glass p-4 mb-4">
        <h2 class="h5">How these were chosen</h2>
        <ul class="mb-2">${explanation}</ul>
        <p class="small mb-0">Products matching more of your selections appear first. If scores tie, the lower price comes first.</p>
      </div>
      <div class="alert glass-alert mb-4" role="note"><i class="bi bi-info-circle"></i> <strong>${DISCLAIMER}</strong></div>
      <h2 class="h4 mb-3">${results.length} suggested ${results.length === 1 ? "product" : "products"}</h2>
      <div class="row g-4">${cards}</div>`;
    setupRevealAnimation();
    box.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  $("#showRecs").addEventListener("click", showResults);
  $("#clearRecs").addEventListener("click", () => {
    $$("#concernChips input").forEach((i) => (i.checked = false));
    $("#recResults").innerHTML = "";
  });

  // Allow links like recommend.html?concern=acne
  const preset = new URLSearchParams(location.search).get("concern");
  if (preset && CONCERNS[preset]) {
    $(`#concernChips input[value="${preset}"]`).checked = true;
    showResults();
  }
}

function initCart() {
  function render() {
    const cart = getCart();
    const wrap = $("#cartContent");
    if (cart.length === 0) {
      wrap.innerHTML = `
        <div class="empty-state glass">
          <i class="bi bi-bag"></i>
          <h3>Your cart is empty</h3>
          <p>Add a few products and they will show up here.</p>
          <a href="products.html" class="btn btn-brand">Browse products</a>
        </div>`;
      return;
    }
    const rows = cart.map((item) => {
      const p = getProduct(item.id);
      return `
        <div class="cart-row glass">
          <img src="${productImage(p)}" alt="${p.name}">
          <div class="flex-grow-1">
            <span class="cat-label">${p.category}</span>
            <h3 class="h6 mb-1">${p.name}</h3>
            <span class="small text-muted">${money(p.price)} each</span>
          </div>
          <div class="qty-box">
            <button data-dec="${p.id}" aria-label="Decrease quantity">&minus;</button>
            <span>${item.qty}</span>
            <button data-inc="${p.id}" aria-label="Increase quantity">+</button>
          </div>
          <strong class="line-total">${money(p.price * item.qty)}</strong>
          <button class="btn btn-sm btn-outline-danger" data-remove="${p.id}" aria-label="Remove ${p.name}"><i class="bi bi-trash"></i></button>
        </div>`;
    }).join("");

    wrap.innerHTML = `
      <div class="row g-4">
        <div class="col-lg-8"><div class="d-grid gap-3">${rows}</div></div>
        <div class="col-lg-4">
          <div class="glass p-4 summary-box">
            <h2 class="h5 mb-3">Order summary</h2>
            <div class="d-flex justify-content-between mb-2"><span>Items</span><span>${cartItemCount()}</span></div>
            <div class="d-flex justify-content-between fs-5 fw-semibold mb-3"><span>Total</span><span>${money(cartTotal())}</span></div>
            <button class="btn btn-brand w-100 mb-2" id="checkoutBtn">Checkout (demo)</button>
            <button class="btn btn-outline-secondary w-100" id="emptyBtn">Empty cart</button>
            <p class="small text-muted mt-3 mb-0">This is an educational project. No real payment is taken.</p>
          </div>
        </div>
      </div>`;
  }

  $("#cartContent").addEventListener("click", (e) => {
    const inc = e.target.closest("[data-inc]");
    const dec = e.target.closest("[data-dec]");
    const rem = e.target.closest("[data-remove]");
    const find = (id) => getCart().find((i) => i.id === Number(id));
    if (inc) { updateQuantity(Number(inc.dataset.inc), find(inc.dataset.inc).qty + 1); render(); }
    if (dec) { updateQuantity(Number(dec.dataset.dec), find(dec.dataset.dec).qty - 1); render(); }
    if (rem) { removeFromCart(Number(rem.dataset.remove)); render(); }
    if (e.target.closest("#emptyBtn")) {
      if (confirm("Remove everything from your cart?")) { emptyCart(); render(); }
    }
    if (e.target.closest("#checkoutBtn")) {
      alert("Thanks for exploring Dermify! This is a demo project, so no order was placed.");
    }
  });
  render();
}

function initContact() {
  const form = $("#contactForm");
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  // Each field has a rule that returns an error message, or "" when valid
  const rules = {
    name:    (v) => (v.trim().length >= 2 ? "" : "Please enter your name (at least 2 letters)."),
    email:   (v) => (emailPattern.test(v.trim()) ? "" : "Please enter a valid email, like name@example.com."),
    message: (v) => (v.trim().length >= 10 ? "" : "Your message should be at least 10 characters.")
  };

  function check(field) {
    const input = form.elements[field];
    const error = rules[field](input.value);
    input.classList.toggle("is-invalid", error !== "");
    input.classList.toggle("is-valid", error === "");
    $(`#${field}Error`).textContent = error;
    return error === "";
  }

  Object.keys(rules).forEach((f) => form.elements[f].addEventListener("blur", () => check(f)));

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const allValid = Object.keys(rules).map(check).every(Boolean);   // run every check
    if (!allValid) return;
    $("#thanksName").textContent = form.elements.name.value.trim();
    $("#contactSuccess").classList.remove("d-none");
    form.reset();
    $$("input, textarea", form).forEach((el) => el.classList.remove("is-valid"));
    $("#contactSuccess").scrollIntoView({ behavior: "smooth", block: "center" });
  });
}

/* ---------- START EVERYTHING WHEN THE PAGE LOADS ---------- */
document.addEventListener("DOMContentLoaded", () => {
  renderNavbar();
  renderFooter();
  renderSharedWidgets();
  setupGlobalClicks();
  updateCartBadge();

  const page = document.body.dataset.page;
  if (page === "home") initHome();
  if (page === "products") initProducts();
  if (page === "recommend") initRecommend();
  if (page === "cart") initCart();
  if (page === "contact") initContact();

  setupRevealAnimation();
});
