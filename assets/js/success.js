const products = window.products;

const params = new URLSearchParams(window.location.search);
const token = params.get("token");         // NEW
const fileId = params.get("id");           // LEGACY fallback (for free products)

const thankYouEl = document.getElementById("thank-you-message");
const productNameEl = document.getElementById("product-name");
const downloadSection = document.getElementById("download-section");
const downloadLinkEl = document.getElementById("download-link");
const errorMessageEl = document.getElementById("error-message");
const downloadMsgEl = document.getElementById("download-message");

function showError(message) {
  thankYouEl.classList.add("hidden");
  productNameEl.textContent = message;
  errorMessageEl.classList.remove("hidden");
  downloadMsgEl.classList.add("hidden");
  downloadSection.classList.add("hidden");
}

async function fetchFromWorkerByToken(token) {
  try {
    const response = await fetch(`https://retarka-token-gen.madebyretarka.workers.dev/verify?token=${token}`);
    const data = await response.json();

    if (!response.ok || !data.downloadUrl || !data.slug) {
      throw new Error(data.error || "Invalid worker response");
    }

    return {
      downloadUrl: data.downloadUrl,
      slug: data.slug
    };
  } catch (err) {
    console.error("Token verify error:", err);
    return null;
  }
}

async function init() {
  if (token) {
    // 🔐 Handle PAID PRODUCT via token
    const result = await fetchFromWorkerByToken(token);

    if (result) {
      const matchedProduct = products.find(p => p.slug === result.slug);
      const title = matchedProduct ? matchedProduct.title : "Your Product";

      productNameEl.classList.add("text-3xl", "font-bold", "mb-4");
      productNameEl.textContent = title;
      thankYouEl.innerHTML = '<h2 class="text-2xl font-bold mb-4">🎉 Thank you for your purchase!</h2>';

      downloadLinkEl.href = result.downloadUrl;
      downloadLinkEl.target = "_blank";
      downloadLinkEl.rel = "noopener";

      downloadSection.classList.remove("hidden");
      downloadMsgEl.classList.remove("hidden");
    } else {
      showError("We couldn't verify your token or find the product.");
    }

  } else if (fileId) {
    // 🎁 FREE PRODUCT
    const product = products.find(p => p.downloadId === fileId && p.price === 0);

    if (product) {
      productNameEl.classList.add("text-3xl", "font-bold", "mb-4");
      productNameEl.textContent = product.title;

      thankYouEl.innerHTML = '<h2 class="text-2xl font-bold mb-4">🎁 Thanks for grabbing this free product!</h2>';

      const driveLink = `https://drive.google.com/file/d/${fileId}/view?usp=sharing`;
      downloadLinkEl.href = driveLink;
      downloadLinkEl.target = "_blank";
      downloadLinkEl.rel = "noopener";

      downloadSection.classList.remove("hidden");
      downloadMsgEl.classList.remove("hidden");
    } else {
      showError("This free product download is no longer valid.");
    }

  } else {
    showError("Missing download token or ID.");
  }
}

init();
