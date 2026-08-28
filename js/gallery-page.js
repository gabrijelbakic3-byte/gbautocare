const workImages = [
  "alfa-g-1.webp","alfa-g-2.webp","alfa-g-3.webp",
  "audi-a5-1.webp","audi-a5-2.webp","audi-a5-3.webp","audi-a5-v.webp",
  "bmw-b-1.webp","chevi-c-1.webp","chevi-c-2.webp","chevi-c-3.webp","chevi-c-4.webp",
  "jaguar-1.webp","jaguar-2.webp","jaguar-3.webp","jaguar-4.webp",
  "kia-c-1.webp","kia-c-2.webp","kia-c-3.webp","kia-c-4.webp","kia-c-5.webp",
  "lanc-1.webp","lanc-2.webp","lanc-3.webp","lanc-4.webp",
  "merc-c-1.webp","merc-c-2.webp","merc-c-3.webp","merc-c-4.webp","mercedes-zs-1.webp",
  "pezo-1.webp","rover-1.webp","rover-2.webp","rover-suhanek-1.webp",
  "suhanek-k-1.webp","suhanek-k-2.webp","suhanek-k-3.webp","suhanek-k-4.webp","suhanek-k-5.webp","suhanek-k-6.webp"
];

const comparisonPairs = [
  ["../kia-before.webp","../kia-after.webp"],
  ["chevi-1.webp","chevi-2.webp"],["jaguar-r-1.webp","jaguar-r-2.webp"],
  ["jaguar-s-1.webp","jaguar-s-2.webp"],["jaguar-z-1.webp","jaguar-z-2.webp"],
  ["kombi-p-1.webp","kombi-p-2.webp"],["kombi-r-1.webp","kombi-r-2.webp"],
  ["kombi-s-1.webp","kombi-s-2.webp"],["lancia-g-1.webp","lancia-g-2.webp"],
  ["lancia-t-1.webp","lancia-t-2.webp"],["lancia-v-1.webp","lancia-v-2.webp"],
  ["lancia-v-v-1.webp","lancia-v-v-2.webp"],["lancia-z-1.webp","lancia-z-2.webp"],
  ["merc-s-1.webp","merc-s-2.webp"],["merc-s-s-1.webp","merc-s-s-2.webp"],
  ["merc-s-s-3.webp","merc-s-s-4.webp"],["merc-s-s-5.webp","merc-s-s-6.webp"],
  ["merc-t-1.webp","merc-t-2.webp"],["merc-t-3.webp","merc-t-4.webp"],
  ["range-1.webp","range-2.webp"]
];

const lightboxItems = [];
let lightboxIndex = 0;

function readableName(file) {
  return file.replace(/\.webp$/i, "").replace(/-\d+$/i, "").replaceAll("-", " ").replace(/\b\w/g, letter => letter.toUpperCase());
}

function addLightboxItem(src, caption) {
  const index = lightboxItems.push({ src, caption }) - 1;
  return index;
}

function renderWorks() {
  const grid = document.getElementById("works-grid");
  const fragment = document.createDocumentFragment();
  workImages.forEach((file, position) => {
    const src = `slike-web-galerija-radova/${file}`;
    const caption = readableName(file);
    const lightboxPosition = addLightboxItem(src, caption);
    const button = document.createElement("button");
    button.className = "gallery-tile";
    button.type = "button";
    button.setAttribute("aria-label", `Otvori fotografiju ${position + 1}`);
    button.dataset.lightboxIndex = lightboxPosition;
    const image = document.createElement("img");
    image.src = src;
    image.alt = `GBAutoCare rad – ${caption}`;
    image.loading = "lazy";
    image.decoding = "async";
    button.appendChild(image);
    fragment.appendChild(button);
  });
  grid.appendChild(fragment);
}

function renderComparisons() {
  const grid = document.getElementById("comparison-grid");
  const fragment = document.createDocumentFragment();
  comparisonPairs.forEach((pair, position) => {
    const card = document.createElement("article");
    card.className = "comparison-card";
    const images = document.createElement("div");
    images.className = "comparison-images";
    pair.forEach((file, index) => {
      const src = `prije-poslije/${file}`;
      const label = index === 0 ? "Prije" : "Poslije";
      const lightboxPosition = addLightboxItem(src, `${label} – usporedba ${position + 1}`);
      const button = document.createElement("button");
      button.type = "button";
      button.className = `comparison-image ${index === 0 ? "before" : "after"}`;
      button.dataset.lightboxIndex = lightboxPosition;
      button.setAttribute("aria-label", `Otvori: ${label}, usporedba ${position + 1}`);
      const image = document.createElement("img");
      image.src = src;
      image.alt = `${label} čišćenja vozila`;
      image.loading = "lazy";
      image.decoding = "async";
      const badge = document.createElement("span");
      badge.textContent = label;
      button.append(image, badge);
      images.appendChild(button);
    });
    const title = document.createElement("h3");
    title.textContent = `Transformacija ${String(position + 1).padStart(2, "0")}`;
    card.append(images, title);
    fragment.appendChild(card);
  });
  grid.appendChild(fragment);
}

function setFilter(filter) {
  document.querySelectorAll(".filter-button").forEach(button => button.classList.toggle("active", button.dataset.filter === filter));
  document.querySelectorAll("[data-section]").forEach(section => {
    section.classList.toggle("hidden", filter !== "all" && section.dataset.section !== filter);
  });
}

function openLightbox(index) {
  lightboxIndex = index;
  const item = lightboxItems[lightboxIndex];
  document.getElementById("gallery-lightbox-image").src = item.src;
  document.getElementById("gallery-lightbox-caption").textContent = item.caption;
  const lightbox = document.getElementById("gallery-lightbox");
  lightbox.classList.add("active");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.classList.add("lightbox-open");
}

function closeLightbox() {
  const lightbox = document.getElementById("gallery-lightbox");
  lightbox.classList.remove("active");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.classList.remove("lightbox-open");
}

function moveLightbox(direction) {
  lightboxIndex = (lightboxIndex + direction + lightboxItems.length) % lightboxItems.length;
  openLightbox(lightboxIndex);
}

renderWorks();
renderComparisons();

document.addEventListener("click", event => {
  const filter = event.target.closest(".filter-button");
  if (filter) setFilter(filter.dataset.filter);
  const tile = event.target.closest("[data-lightbox-index]");
  if (tile) openLightbox(Number(tile.dataset.lightboxIndex));
  if (event.target.closest(".lightbox-close")) closeLightbox();
  if (event.target.closest(".lightbox-prev")) moveLightbox(-1);
  if (event.target.closest(".lightbox-next")) moveLightbox(1);
  if (event.target.id === "gallery-lightbox") closeLightbox();
});

document.addEventListener("keydown", event => {
  if (!document.getElementById("gallery-lightbox").classList.contains("active")) return;
  if (event.key === "Escape") closeLightbox();
  if (event.key === "ArrowLeft") moveLightbox(-1);
  if (event.key === "ArrowRight") moveLightbox(1);
});
