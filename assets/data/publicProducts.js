window.products = [
  {
    public: true,
    title: "RTK Test Product 1",
    slug: "test-prod-1",
    date: "2025-08-19",
    price: 0,
    originalPrice: 0, // <= triggers sale display
    description: "Test product 1.",
    tags: ["skyrim", "knight", "fantasy", "armor", "daz", "g9"],
    label: "",
    versions: ["g9", "g8"],
    previewCount: 3,
    buyLink: "https://yourlink.com/buy/test-prod-1", //payment link
    downloadId: "1gPC0cx2RxZ_DnZALM8rIymyrg9gf-BKe",  //null if not free product
    externalSite: "RenderHub", // optional
    externalSiteLink: "https://www.renderhub.com/retarka/example-product", // ← optional
    extraInfo: "Includes sword, shield, and 4 texture variants."
  },
  {
    public: true,
    title: "RTK Test Product 2",
    slug: "test-prod-2",
    date: "2025-08-19",
    price: 25,
    originalPrice: 30, // <= triggers sale display
    description: "Test product 2.",
    tags: ["char", "daz", "g8f"],
    label: "popular",
    versions: ["g8f"],
    previewCount: 3,
    buyLink: "https://yourlink.com/buy/test-prod-2",
    downloadId: null, //null if not free product
    externalSite: "RenderHub", // optional
    externalSiteLink: "https://www.renderhub.com/retarka/example-product", // ← optional
    extraInfo: "Includes armour, potions, and texture variants."
  }
];
