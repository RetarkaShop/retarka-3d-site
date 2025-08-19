document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("productMain");
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("slug");

  if (!slug || !window.products) {
    container.innerHTML = `
      <div class="text-center mt-20">
        <p class="text-red-400 text-xl font-semibold mb-4">Oops! Product not found.</p>
        <a href="../index.html" class="text-cyan-400 underline">Go back to Home</a>
      </div>
    `;
    return;
  }

  const product = window.products.find(p => p.slug === slug);
  if (!product) {
    container.innerHTML = `
      <div class="text-center mt-20">
        <p class="text-red-400 text-xl font-semibold mb-4">Sorry, this product does not exist.</p>
        <a href="../index.html" class="text-cyan-400 underline">Return to the shop</a>
      </div>
    `;
    return;
  }

  // --- 🧠 SEO + OG + Twitter ---
  const isDiscounted = product.originalPrice && product.originalPrice > product.price;
  const percentOff = isDiscounted
    ? Math.round(100 - (product.price / product.originalPrice) * 100)
    : null;
    
  const pageTitle = isDiscounted
    ? `${product.title} – Now $${product.price} (Was $${product.originalPrice}) - Retarka`
    : `${product.title} - Retarka`;

  const saleNote = isDiscounted ? `Now only $${product.price} (was $${product.originalPrice})! ` : '';
  const pageDescription = `${saleNote}${product.description?.slice(0, 140) || ''}`;

  const pageImage = `https://yourdomain.com/assets/images/products/${product.slug}/thumb.jpg`;
  const pageUrl = `https://yourdomain.com/products/product.html?slug=${product.slug}`;

  document.title = pageTitle;

  function setMeta(name, content, attr = "name") {
    let tag = document.head.querySelector(`[${attr}="${name}"]`);
    if (!tag) {
      tag = document.createElement("meta");
      tag.setAttribute(attr, name);
      document.head.appendChild(tag);
    }
    tag.setAttribute("content", content);
  }

  setMeta("description", pageDescription);
  setMeta("og:title", pageTitle, "property");
  setMeta("og:description", pageDescription, "property");
  setMeta("og:image", pageImage, "property");
  setMeta("og:url", pageUrl, "property");
  setMeta("twitter:title", pageTitle);
  setMeta("twitter:description", pageDescription);
  setMeta("twitter:image", pageImage);

  // --- Product HTML Display ---
  const imageBase = `../assets/images/products/${product.slug}`;
  const previewCount = product.previewCount || 3;

  let previewImages = "";
  let thumbnailImages = "";

  for (let i = 1; i <= previewCount; i++) {
    const imgPath = `${imageBase}/preview-${i}.jpg`;
    previewImages += `
      <div class="carousel-cell flex justify-center items-center">
        <img src="${imgPath}" 
          alt="${product.title} ${i}" 
          loading="lazy"
          class="preview-img rounded shadow-md cursor-zoom-in"
        />
      </div>
    `;
    thumbnailImages += `
      <img src="${imgPath}" 
        data-index="${i - 1}" 
        loading="lazy"
        class="thumb-img w-20 h-20 object-cover border border-gray-700 hover:ring-2 hover:ring-green-500 rounded cursor-pointer transition"
      />
    `;
  }

  container.innerHTML = `
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
      <div class="w-full">
        <div class="carousel js-flickity mb-4">${previewImages}</div>
        <div class="flex flex-wrap justify-center gap-2 overflow-x-auto pb-2 max-w-full">${thumbnailImages}</div>
      </div>
      <div class="flex flex-col justify-between space-y-4">
        <div>
          <h2 class="text-3xl font-bold">${product.title}</h2>
          ${
            product.price === 0
              ? `<p class="text-yellow-300 font-bold text-3xl mb-2">FREE</p>`
              : product.originalPrice && product.originalPrice > product.price
                ? `
                  <div class="mb-2">
                    <p class="text-3xl font-bold">
                      <span class="line-through text-red-400 mr-2">$${product.originalPrice.toFixed(2)}</span>
                      <span class="text-yellow-300">$${product.price.toFixed(2)}</span>
                    </p>
                    <div class="mt-2 flex flex-wrap items-center gap-2">
                      <span class="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">${percentOff}% OFF</span>
                      <span class="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">ON SALE</span>
                    </div>
                  </div>
                `
                : `<p class="text-yellow-300 font-bold text-3xl mb-2">$${product.price.toFixed(2)}</p>`
          }
          <span class="text-sm text-gray-400">${getVersionLabels(product.tags, product.versions)}</span>
          <p class="text-gray-300 mt-4">${product.description}</p>
          ${(product.externalLink || product.externalSite) ? `
            <p class="mt-4 text-sm text-gray-400">
              View this product on 
              <a href="${product.externalSiteLink || '#'}" class="underline text-green-400" target="_blank">
                ${product.externalSite || 'External Site'}
              </a>
            </p>` : ''}
          ${(() => {
            const isFree = product.price === 0;
            const buttonHref = isFree
              ? `../success.html?id=${product.downloadId}`
              : product.buyLink;
            const buttonLabel = isFree ? 'Free Download' : 'Buy with Crypto';
            const buttonColor = isFree ? 'bg-blue-500 hover:bg-blue-600' : 'bg-green-500 hover:bg-green-600';
            return `
              <a href="${buttonHref}" ${isFree ? '' : 'target="_blank"'}
                class="${buttonColor} mt-4 text-white w-full py-3 rounded text-lg font-bold block text-center">
                ${buttonLabel}
              </a>`;
          })()}
        </div>
      </div>
    </div>
    <div class="border-t border-gray-700 pt-8">
      <h3 class="text-2xl font-semibold mb-2">Additional Information</h3>
      <p class="text-gray-300 leading-relaxed">${product.extraInfo || "No extra information provided for this product."}</p>
    </div>
    <div id="imageModal" class="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 hidden">
      <div class="relative max-w-6xl w-full px-4">
        <button onclick="closeModal()" class="absolute top-2 right-2 text-white text-4xl font-bold">&times;</button>
        <img id="modalImage" src="" alt="Full View" loading="lazy" class="modal-img block mx-auto max-w-full max-h-screen object-contain rounded shadow-lg" />
      </div>
    </div>
  `;

  // Error fallback
  document.querySelectorAll('.preview-img, .thumb-img').forEach(img => {
    img.onerror = () => { img.src = '../assets/images/no-preview.jpg'; };
  });

  // Flickity Init
  const flickityScript = document.createElement("script");
  flickityScript.src = "https://unpkg.com/flickity@2/dist/flickity.pkgd.min.js";
  flickityScript.onload = () => {
    const flkty = new Flickity(".js-flickity", {
      imagesLoaded: true,
      wrapAround: true,
      pageDots: false,
    });
    document.querySelectorAll(".thumb-img").forEach(thumb => {
      thumb.addEventListener("click", () => flkty.select(parseInt(thumb.getAttribute("data-index"))));
    });
  };
  document.body.appendChild(flickityScript);

  // Modal logic
  const modal = document.getElementById("imageModal");
  const modalImg = document.getElementById("modalImage");
  document.addEventListener("click", (e) => {
    if (e.target.matches(".carousel-cell img")) {
      modalImg.src = e.target.src;
      modal.classList.remove("hidden");
    }
  });
  modal?.addEventListener("click", e => {
    if (e.target === modal) closeModal();
  });
  window.closeModal = function () {
    modal.classList.add("hidden");
    modalImg.src = "";
  };

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
});
