document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("productGrid");
  const searchInput = document.getElementById("searchInput");
  const versionFilter = document.getElementById("versionFilter");
  const sortSelect = document.getElementById("sortSelect");
  const noResults = document.getElementById("noResults");

  const today = new Date();

  function renderProducts() {
    grid.innerHTML = "";

    const query = searchInput.value.toLowerCase();
    const version = versionFilter.value;
    const sort = sortSelect.value;

    let filtered = window.products.filter(p => {
      if (p.public === false) return false;

      const tagString = p.tags.join(", ").toLowerCase();
      const matchSearch = p.title.toLowerCase().includes(query) ||
                          p.description.toLowerCase().includes(query) ||
                          tagString.includes(query);

      const matchVersion = version === "all" || tagString.includes(version);
      return matchSearch && matchVersion;
    });

    filtered.sort((a, b) => {
      if (sort === "newest") return new Date(b.date) - new Date(a.date);
      if (sort === "oldest") return new Date(a.date) - new Date(b.date);
      if (sort === "priceLowHigh") return a.price - b.price;
      if (sort === "priceHighLow") return b.price - a.price;
      return 0;
    });

    filtered.forEach(product => {
      const diffDays = (today - new Date(product.date)) / (1000 * 60 * 60 * 24);
      const isNew = diffDays <= 7;
      const isPopular = product.label === "popular";
      const isFree = product.price === 0;
      const isOnSale = product.originalPrice && product.originalPrice > product.price;

      const card = document.createElement("div");
      card.setAttribute("role", "button");
      card.className = "relative product-card flex flex-col items-center text-center bg-gray-800 hover:bg-gray-700 p-4 rounded-lg shadow hover:shadow-lg hover:ring-2 hover:ring-green-500 transition cursor-pointer";

      const badgeHTML = `
        ${isNew ? `<span role="status" class="inline-block text-black bg-yellow-400 font-bold text-2xl px-3 py-1 rounded">New</span>` : ''}
        ${isPopular ? `<span role="status" class="inline-block text-white bg-green-500 font-bold text-2xl px-3 py-1 rounded">🔥 Popular</span>` : ''}
        ${isFree ? `<span role="status" class="inline-block text-white bg-blue-500 font-bold text-2xl px-3 py-1 rounded">🎁 Free Gift</span>` : ''}
        ${isOnSale ? `<span role="status" class="inline-block text-white bg-pink-500 font-bold text-2xl px-3 py-1 rounded">💸 On Sale</span>` : ''}
      `;

      const thumbPath = `assets/images/products/${product.slug}/thumb.jpg`;
      const placeholderPath = `assets/images/no-preview.jpg`;

      card.innerHTML = `
        <article>
          ${badgeHTML ? `<div class="absolute top-2 left-2 flex gap-2 z-10">${badgeHTML}</div>` : ''}
          <img src="${thumbPath}"
              alt="${product.title} preview image"
              loading="lazy"
              class="rounded mb-3 w-full max-w-[300px] aspect-[6/7] object-cover border border-gray-700 shadow-md"
              onerror="this.onerror=null;this.src='${placeholderPath}'" />

          <h2 class="text-xl font-semibold mb-1">${product.title}</h2>
          <p class="text-yellow-300 font-bold text-2xl mb-1">
            ${product.price === 0
              ? "FREE"
              : isOnSale
                ? `<span class="line-through text-red-400 text-xl mr-2">$${product.originalPrice}</span> $${product.price}`
                : `$${product.price}`
            }
          </p>
          <span class="text-sm text-gray-400">${getVersionLabels(product.tags, product.versions)}</span>
          <p class="text-sm text-gray-300 mt-2">${product.description}</p>

          <button type="button"
                  aria-label="${product.price === 0 ? 'Download for free' : 'Buy product using cryptocurrency'}"
                  class="mt-4 ${product.price === 0 ? 'bg-blue-500 hover:bg-blue-600' : 'bg-green-500 hover:bg-green-600'} text-white w-full py-2 rounded font-bold"
                  data-href="${product.price === 0
                    ? `success.html?id=${product.downloadId}`
                    : product.buyLink}">
            ${product.price === 0 ? 'Free Download' : 'Buy with Crypto'}
          </button>
        </article>
      `;

      // Open product page when clicking the card (but NOT the button)
      card.addEventListener("click", () => {
        window.location.href = `products/product.html?slug=${product.slug}`;
      });

      // Prevent card click if button is clicked
      const button = card.querySelector("button");
      button.addEventListener("click", (e) => {
        e.stopPropagation();
        const targetLink = e.currentTarget.getAttribute("data-href");
        if (targetLink) {
          window.open(targetLink, "_blank");
        }
      });

      grid.appendChild(card);
    });

    noResults.classList.toggle("hidden", filtered.length > 0);
  }

  function getVersionLabels(tags, versions) {
    const known = {
      g9f: "Genesis 9 Feminine",
      g9m: "Genesis 9 Masculine",
      g9: "Genesis 9",
      g8f: "Genesis 8 Female",
      g8m: "Genesis 8 Male",
      g8: "Genesis 8",
      blender: "Blender",
      daz: "Daz3D"
    };

    const set = new Set();

    // From tags (for legacy support or extra fallback)
    tags.forEach(tag => {
      if (known[tag.toLowerCase()]) set.add(known[tag.toLowerCase()]);
    });

    // From versions array (recommended primary source)
    if (Array.isArray(versions)) {
      versions.forEach(v => {
        if (known[v.toLowerCase()]) set.add(known[v.toLowerCase()]);
      });
    }

    return Array.from(set).join(", ");
  }

  searchInput.addEventListener("input", renderProducts);
  versionFilter.addEventListener("change", renderProducts);
  sortSelect.addEventListener("change", renderProducts);

  renderProducts();
});
