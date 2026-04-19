let currentSelection = {
  interior: null,
  exterior: null,
  chemical: null,
  ac: false,
  headlight: false,
  ceramic: false,
  engine: false
};

function rebuildSelectionFromList() {
  const items = [...document.querySelectorAll("#selection-list li span")].map(el => el.textContent.trim());

  currentSelection = {
    interior: null,
    exterior: null,
    chemical: null,
    ac: false,
    headlight: false,
    ceramic: false,
    engine: false
  };

  items.forEach(text => {
    // INTERIOR
    if (text.includes("Osnovno usisavanje")) currentSelection.interior = "basic";
    else if (text.includes("Usisavanje + čišćenje površina")) currentSelection.interior = "wipe";
    else if (text.includes("Kompletno unutarnje čišćenje")) currentSelection.interior = "full";

    // EXTERIOR
    else if (text.includes("Osnovno vanjsko pranje")) currentSelection.exterior = "basic";
    else if (text.includes("Vanjsko pranje + felge")) currentSelection.exterior = "rims";
    else if (text.includes("Kompletno vanjsko pranje")) currentSelection.exterior = "full";

    // CHEMICAL
    else if (text.includes("Kemijsko čišćenje sjedala")) currentSelection.chemical = "seats";
    else if (text.includes("Kemijsko čišćenje tepiha")) currentSelection.chemical = "carpets";
    else if (text.includes("Sjedala + tepisi")) currentSelection.chemical = "full";

    // EXTRAS
    else if (text.includes("Antibakterijski tretman klime")) currentSelection.ac = true;
    else if (text.includes("farova")) currentSelection.headlight = true;
    else if (text.includes("Keramička zaštita laka")) currentSelection.ceramic = true;
    else if (text.includes("motornog prostora")) currentSelection.engine = true;
  });

  const hasAnyRealService = items.some(text =>
    !text.includes("Bronze paket") &&
    !text.includes("Gold paket") &&
    !text.includes("Diamond paket")
  );

  if (!items.length || !hasAnyRealService) {
    displayTotalPrice({ min: 0, max: 0 });
    return;
  }

  updateTotal();
}

document.querySelectorAll('#interiorPopup .popup-btn')[0]
  ?.addEventListener('click', () => {

    const selected = document.querySelector('input[name="interior"]:checked');

    if (!selected) return;

    const text = selected.parentElement.innerText;

    if (text.includes("Osnovno")) currentSelection.interior = "basic";
    if (text.includes("čišćenje površina")) currentSelection.interior = "wipe";
    if (text.includes("Kompletno")) currentSelection.interior = "full";

    updateTotal();
});
 

/* ========================= */
/* HAMBURGER MENU */
/* ========================= */

const toggle = document.querySelector(".menu-toggle");
const menu = document.querySelector(".menu");
const nav = document.querySelector("nav");

toggle.addEventListener("click",(e)=>{
e.stopPropagation();
menu.classList.toggle("active");
});

document.querySelectorAll(".menu a").forEach(link=>{
link.addEventListener("click",()=>{
menu.classList.remove("active");
});
});

document.addEventListener("click",(e)=>{
if(!menu.contains(e.target) && !toggle.contains(e.target)){
menu.classList.remove("active");
}
});

window.addEventListener("scroll",()=>{
if(menu.classList.contains("active")) return;

if(window.scrollY > 50){
nav.classList.add("scrolled");
}else{
nav.classList.remove("scrolled");
}
});

/* ========================= */
/* SMOOTH SCROLL */
/* ========================= */

document.querySelectorAll('a[href^="#"]').forEach(anchor=>{
anchor.addEventListener("click",function(e){

const id = this.getAttribute("href");
if(id === "#") return;

const target = document.querySelector(id);

if(target){
e.preventDefault();
target.scrollIntoView({
behavior:"smooth",
block:"start"
});
}

});
});

/* ========================= */
/* FADE IN */
/* ========================= */

const faders = document.querySelectorAll(".fade-in");

const observer = new IntersectionObserver(entries=>{
entries.forEach(entry=>{
if(entry.isIntersecting){
entry.target.classList.add("visible");
}
});
});

faders.forEach(el=>observer.observe(el));

/* ========================= */
/* SERVICE POPUPS */
/* ========================= */

const servicePopupMap = [
    "interiorPopup",
    "exteriorPopup",
    "chemicalPopup",
    "acPopup",
    "headlightPopup",
    "ceramicPopup",
    "enginePopup"
];

document.querySelectorAll("#services .service-card").forEach((card, index) => {
    const popupId = servicePopupMap[index];
    const popup = document.getElementById(popupId);

    if (!popup) return;

    card.addEventListener("click", () => {
        closeAllPopups();
        popup.classList.add("show");
    });
});

/* ========================= */
/* POPUP ARROWS */
/* ========================= */

document.querySelectorAll(".popup-arrow").forEach(arrow=>{

arrow.addEventListener("click",()=>{

const currentPopup = arrow.closest(".popup");

const nextId = arrow.dataset.next;
const prevId = arrow.dataset.prev;

let targetPopup = null;

if(nextId){
targetPopup = document.getElementById(nextId);
}

if(prevId){
targetPopup = document.getElementById(prevId);
}

if(!targetPopup) return;

/* pokreni fade out starog */
currentPopup.classList.add("fade-out");

/* otvori novi popup */
targetPopup.classList.add("show");

/* makni stari kad animacija završi */
setTimeout(()=>{
currentPopup.classList.remove("show","fade-out");
},350);

});

});
/* ========================= */
/* CLICK OUTSIDE POPUP */
/* ========================= */

document.querySelectorAll(".popup").forEach(popup=>{

popup.addEventListener("click",(e)=>{

if(e.target === popup){
closeAllPopups();
}

});

});

/* ========================= */
/* PACKAGE CARD CLICK */
/* ========================= */

document.querySelectorAll(".package-card").forEach((card) => {
    card.addEventListener("click", (e) => {
        if (e.target.closest(".package-btn") || e.target.closest(".package-more")) return;

        closeAllPopups();

        if (card.classList.contains("bronze")) {
            document.getElementById("bronzeInfoPopup").classList.add("show");
        }

        if (card.classList.contains("gold")) {
            document.getElementById("goldInfoPopup").classList.add("show");
        }

        if (card.classList.contains("diamond")) {
            document.getElementById("diamondInfoPopup").classList.add("show");
        }
    });
});



/* ========================= */
/* INFO POPUP */
/* ========================= */

document.querySelectorAll(".package-more").forEach(el=>{

el.addEventListener("click",(e)=>{

e.stopPropagation();

const card = el.closest(".package-card");

if(card.classList.contains("bronze")){
document.getElementById("bronzeInfoPopup").classList.add("show");
}

if(card.classList.contains("gold")){
document.getElementById("goldInfoPopup").classList.add("show");
}

if(card.classList.contains("diamond")){
document.getElementById("diamondInfoPopup").classList.add("show");
}

});

});


/* ========================= */
/* BRONZE CONFIG */
/* ========================= */

const bronzePopup = document.getElementById("bronzePopup");
const bronzeInterior = document.getElementById("bronze-interior");
const bronzeExterior = document.getElementById("bronze-exterior");

const interiorPopup = document.getElementById("bronzeInteriorPopup");
const exteriorPopup = document.getElementById("bronzeExteriorPopup");

document.querySelectorAll(".package-btn").forEach(btn=>{

btn.addEventListener("click",(e)=>{

e.preventDefault();
e.stopPropagation();
const card = btn.closest(".package-card");

if(card.classList.contains("bronze")){
bronzePopup.classList.add("show");
document.body.classList.add("popup-open");

}

});

});

document.querySelectorAll('input[name="bronzeInterior"]').forEach(option=>{

option.addEventListener("change",()=>{

/* samo promjena teksta u popupu */
bronzeInterior.textContent = option.value;

});

});

document.querySelectorAll('input[name="bronzeExterior"]').forEach(option=>{

option.addEventListener("change",()=>{

/* samo promjena teksta u popupu */
bronzeExterior.textContent = option.value;

});

});

/* CHANGE OPTIONS */

bronzeInterior?.addEventListener("click",()=>{
interiorPopup.classList.add("show");

});

bronzeExterior?.addEventListener("click",()=>{
exteriorPopup.classList.add("show");

});

document.querySelectorAll('input[name="bronzeInterior"]').forEach(option=>{

option.addEventListener("change",()=>{

bronzeInterior.textContent = option.value;
interiorPopup.classList.remove("show");

bronzeInterior.classList.add("option-changed");

setTimeout(()=>{
bronzeInterior.classList.remove("option-changed");
},400);

});

});

document.querySelectorAll('input[name="bronzeExterior"]').forEach(option=>{

option.addEventListener("change",()=>{

bronzeExterior.textContent = option.value;
exteriorPopup.classList.remove("show");

bronzeExterior.classList.add("option-changed");

setTimeout(()=>{
bronzeExterior.classList.remove("option-changed");
},400);

});

});

/* ========================= */
/* BRONZE INFO → CONFIG */
/* ========================= */

document.querySelectorAll("#bronzeInfoPopup .bronze-btn").forEach(btn=>{

btn.addEventListener("click",()=>{

const info = document.getElementById("bronzeInfoPopup");
bronzePopup.classList.add("show");
info.classList.remove("show");

setTimeout(()=>{

},200);

});

});

document.getElementById("bronzeInfoPopup")
?.querySelector(".close-popup")
?.addEventListener("click",()=>{
document.getElementById("bronzeInfoPopup").classList.remove("show");
});

/* ========================= */
/* GOLD CONFIG */
/* ========================= */

const goldPopup = document.getElementById("goldPopup");

document.querySelectorAll(".package-card.gold .package-btn").forEach(btn=>{

btn.addEventListener("click",(e)=>{

e.preventDefault();
e.stopPropagation();

goldPopup.classList.add("show");
document.body.classList.add("popup-open");

});

});

/* CLOSE GOLD */

goldPopup?.querySelector(".close-popup")?.addEventListener("click",()=>{

goldPopup.classList.remove("show");
document.body.classList.remove("popup-open");

});

/* ========================= */
/* GOLD INFO → CONFIG */
/* ========================= */

document.querySelectorAll("#goldInfoPopup .gold-btn").forEach(btn=>{

btn.addEventListener("click",()=>{

const info = document.getElementById("goldInfoPopup");

goldPopup.classList.add("show");
info.classList.remove("show");

});

});

document.getElementById("goldInfoPopup")
?.querySelector(".close-popup")
?.addEventListener("click",()=>{
document.getElementById("goldInfoPopup").classList.remove("show");
});

/* ========================= */
/* DIAMOND CONFIG */
/* ========================= */

const diamondPopup = document.getElementById("diamondPopup");

document.querySelectorAll(".package-card.diamond .package-btn").forEach(btn=>{

btn.addEventListener("click",(e)=>{

e.preventDefault();
e.stopPropagation();

diamondPopup.classList.add("show");
document.body.classList.add("popup-open");

});

});

/* CLOSE DIAMOND */

diamondPopup?.querySelector(".close-popup")?.addEventListener("click",()=>{

diamondPopup.classList.remove("show");
document.body.classList.remove("popup-open");

});

/* ========================= */
/* DIAMOND INFO → CONFIG */
/* ========================= */

document.querySelectorAll("#diamondInfoPopup .diamond-btn").forEach(btn=>{

btn.addEventListener("click",()=>{

const info = document.getElementById("diamondInfoPopup");

diamondPopup.classList.add("show");
info.classList.remove("show");

});

});

document.getElementById("diamondInfoPopup")
?.querySelector(".close-popup")
?.addEventListener("click",()=>{
document.getElementById("diamondInfoPopup").classList.remove("show");
});

function closeAllPopups(){

document.querySelectorAll(".popup").forEach(p=>{
p.classList.remove("show");
});

document.body.classList.remove("popup-open");

}

document.querySelectorAll(".close-popup").forEach(btn=>{

btn.addEventListener("click",()=>{

closeAllPopups();

});

});



/* ========================= */
/* PACKAGE SELECTION */
/* ========================= */

function addService(serviceName){

const list = document.getElementById("selection-list");
const panel = document.getElementById("selection-panel");

/* koji je paket izabran */
const selectedPackage = list.querySelector(".selected-package");

/* iz kojeg popup-a dolazi usluga */
const popup = document.querySelector(".popup.show");
const popupId = popup ? popup.id : "";

/* BLOKADA USLUGA */

if(selectedPackage){

const paket = selectedPackage.textContent;

/* BRONZE */
if(paket.includes("Bronze")){
if(popupId === "interiorPopup" || popupId === "exteriorPopup"){
showWarning("Ova usluga je već uključena u Bronze paket.");
return;
}
}

/* GOLD */
if(paket.includes("Gold")){
if(popupId === "interiorPopup" || popupId === "exteriorPopup"){
showWarning("Ova usluga je već uključena u Gold paket.");
return;
}
}

/* DIAMOND */
if(paket.includes("Diamond")){
if(
popupId === "interiorPopup" ||
popupId === "exteriorPopup" ||
popupId === "chemicalPopup" ||
popupId === "acPopup"
){
showWarning("Ova usluga je već uključena u Diamond paket.");
return;
}
}

}

/* provjeri postoji li već */
const exists = [...list.querySelectorAll("li")]
.some(li => li.textContent === serviceName);

if(exists) return;

/* dodaj u moj izbor */
const item = document.createElement("li");

item.innerHTML = `
<span>${serviceName}</span>
<button class="remove-service">✕</button>
`;

list.appendChild(item);

/* otvori panel */
panel.classList.add("active");

}

/* ========================= */
/* CLICK EXTRA SERVICES */
/* ========================= */

document.querySelectorAll(".package-item .clickable").forEach(service=>{

service.addEventListener("click",()=>{

/* radi samo za Gold i Diamond */
const isGold = service.closest("#goldPopup");
const isDiamond = service.closest("#diamondPopup");

if(!isGold && !isDiamond) return;

service.classList.toggle("active");

});

});
/* ========================= */
/* BRONZE OPTIONS */
/* ========================= */

function updateBronzeService(type,value){

const list = document.getElementById("selection-list");

let existing = list.querySelector(`.${type}`);

if(existing){

existing.textContent = value;

}else{

const item = document.createElement("li");
item.textContent = value;
item.classList.add(type);

list.appendChild(item);

}

document.getElementById("selection-panel").classList.add("active");

}


/* BRONZE RADIO */

document.querySelector("#bronzePopup .popup-btn").addEventListener("click",(e)=>{

e.preventDefault();

const list = document.getElementById("selection-list");
const panel = document.getElementById("selection-panel");

/* očisti stari izbor */
list.innerHTML = "";

/* paket */
const packageItem = document.createElement("li");
packageItem.classList.add("selected-package");

packageItem.innerHTML = `
<span>Bronze paket</span>
<button class="remove-package">✕</button>
`;

list.appendChild(packageItem);

/* unutarnje */
const interior = document.querySelector('input[name="bronzeInterior"]:checked');
if(interior){

const item = document.createElement("li");
item.textContent = interior.value;
item.classList.add("package-sub");
list.appendChild(item);

}

/* vanjsko */
const exterior = document.querySelector('input[name="bronzeExterior"]:checked');
if(exterior){

const item = document.createElement("li");
item.textContent = exterior.value;
item.classList.add("package-sub");
list.appendChild(item);

}

panel.classList.add("active");

currentSelection = {
  interior: null,
  exterior: null,
  chemical: null,
  ac: false,
  headlight: false,
  ceramic: false,
  engine: false
};

displayTotalPrice({ min: 30, max: 50 });

closeAllPopups();

});

/* ========================= */
/* GOLD → MOJ IZBOR */
/* ========================= */

document.querySelector("#goldPopup .popup-btn").addEventListener("click",(e)=>{

e.preventDefault();

const list = document.getElementById("selection-list");
const panel = document.getElementById("selection-panel");

/* očisti stari izbor */
list.innerHTML = "";

/* paket */
const packageItem = document.createElement("li");
packageItem.classList.add("selected-package");

packageItem.innerHTML = `
<span>Gold paket</span>
<button class="remove-package">✕</button>
`;

list.appendChild(packageItem);
/* dodatne usluge */
document.querySelectorAll("#goldPopup .clickable.active").forEach(service=>{

const item = document.createElement("li");

item.innerHTML = `
<span>${service.textContent.trim()}</span>
<button class="remove-service">✕</button>
`;

list.appendChild(item);
});

panel.classList.add("active");

currentSelection = {
  interior: null,
  exterior: null,
  chemical: null,
  ac: false,
  headlight: false,
  ceramic: false,
  engine: false
};

displayTotalPrice({ min: 80, max: 110 });

closeAllPopups();

});

/* ========================= */
/* DIAMOND → MOJ IZBOR */
/* ========================= */

document.querySelector("#diamondPopup .popup-btn").addEventListener("click",(e)=>{

e.preventDefault();

const list = document.getElementById("selection-list");
const panel = document.getElementById("selection-panel");

/* očisti stari izbor */
list.innerHTML = "";

/* paket */
const packageItem = document.createElement("li");
packageItem.classList.add("selected-package");

packageItem.innerHTML = `
<span>Diamond paket</span>
<button class="remove-package">✕</button>
`;

list.appendChild(packageItem);

/* dodatne usluge */
document.querySelectorAll("#diamondPopup .clickable.active").forEach(service=>{

const item = document.createElement("li");

item.innerHTML = `
<span>${service.textContent.trim()}</span>
<button class="remove-service">✕</button>
`;

list.appendChild(item);

});

panel.classList.add("active");

currentSelection = {
  interior: null,
  exterior: null,
  chemical: null,
  ac: false,
  headlight: false,
  ceramic: false,
  engine: false
};

displayTotalPrice({ min: 120, max: 300 });

closeAllPopups();

});

/* ========================= */
/* SERVICES → MOJ IZBOR */
/* ========================= */

[
  "interiorPopup",
  "exteriorPopup",
  "chemicalPopup",
  "acPopup",
  "headlightPopup",
  "ceramicPopup",
  "enginePopup"
].forEach(popupId => {
  const popup = document.getElementById(popupId);
  if (!popup) return;

  const btn = popup.querySelector(".popup-btn");
  if (!btn) return;

  btn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();

    const selected = popup.querySelector("input[type='radio']:checked");
    if (!selected) return;

    const serviceName = selected
      .closest(".popup-option")
      .querySelector("strong")
      .innerText
      .trim();

    addService(serviceName);
    popup.classList.remove("show");
    document.getElementById("selection-panel").classList.add("active");
    syncBookingSelection();
  });
});

/* MOJ IZBOR */

const selectionPanel = document.getElementById("selection-panel");
const selectionList = document.getElementById("selection-list");
const openButton = document.getElementById("open-reservation");
const closeButton = document.getElementById("close-selection");

openButton.addEventListener("click", function(e){
e.preventDefault();
selectionPanel.classList.add("active");
});

closeButton.addEventListener("click", function(){
selectionPanel.classList.remove("active");
});

document.addEventListener("click", function(e){

if(
selectionPanel.classList.contains("active") &&
!selectionPanel.contains(e.target) &&
!openButton.contains(e.target)
){
selectionPanel.classList.remove("active");
}

});

function showWarning(text){

const warning = document.getElementById("selection-warning");

warning.textContent = text;
warning.style.display = "block";

setTimeout(()=>{
warning.style.display = "none";
},3000);

}

document.addEventListener("click", function(e) {
  if (e.target.classList.contains("remove-package")) {
    const list = document.getElementById("selection-list");
    list.innerHTML = "";

    currentSelection = {
      interior: null,
      exterior: null,
      chemical: null,
      ac: false,
      headlight: false,
      ceramic: false,
      engine: false
    };

    displayTotalPrice({ min: 0, max: 0 });
    syncBookingSelection();
  }
});




document.addEventListener("click", function(e) {
  if (e.target.classList.contains("remove-service")) {
    const item = e.target.closest("li");
    if (item) item.remove();

    rebuildSelectionFromList();
    syncBookingSelection();
  }
});






const carousel = document.getElementById("carousel");

const images = [
"alfa-g-1.webp","alfa-g-2.webp","alfa-g-3.webp",
"audi-a5-1.webp","audi-a5-2.webp","audi-a5-3.webp","audi-a5-v.webp",
"bmw-b-1.webp",
"chevi-c-1.webp","chevi-c-2.webp","chevi-c-3.webp","chevi-c-4.webp",
"jaguar-1.webp","jaguar-2.webp","jaguar-3.webp","jaguar-4.webp",
"kia-c-1.webp","kia-c-2.webp","kia-c-3.webp","kia-c-4.webp","kia-c-5.webp",
"lanc-1.webp","lanc-2.webp","lanc-3.webp","lanc-4.webp",
"merc-c-1.webp","merc-c-2.webp","merc-c-3.webp","merc-c-4.webp",
"mercedes-zs-1.webp",
"pezo-1.webp",
"rover-1.webp","rover-2.webp","rover-suhanek-1.webp",
"suhanek-k-1.webp","suhanek-k-2.webp","suhanek-k-3.webp","suhanek-k-4.webp","suhanek-k-5.webp","suhanek-k-6.webp"
];

let current = 0;
let imgs = [];

function preloadCarouselNeighbors() {
  const indexes = [
    current,
    (current - 1 + imgs.length) % imgs.length,
    (current + 1) % imgs.length,
    (current - 2 + imgs.length) % imgs.length,
    (current + 2) % imgs.length
  ];

  indexes.forEach(i => {
    const img = imgs[i];
    if (img && !img.dataset.preloaded) {
      const preload = new Image();
      preload.src = img.src;
      img.dataset.preloaded = "true";
    }
  });
}

images.forEach(src => {
  const img = document.createElement("img");
  img.loading = "lazy";
  img.decoding = "async";
  img.src = "slike-web-galerija-radova/" + src;
  carousel.appendChild(img);
  imgs.push(img);
});

function updateCarousel(){
imgs.forEach((img, i)=>{
img.className = "";

if(i === current) img.classList.add("active");
else if(i === (current - 1 + imgs.length) % imgs.length) img.classList.add("left");
else if(i === (current + 1) % imgs.length) img.classList.add("right");
else if(i === (current - 2 + imgs.length) % imgs.length) img.classList.add("left2");
else if(i === (current + 2) % imgs.length) img.classList.add("right2");
});
}


updateCarousel();
preloadCarouselNeighbors();
document.addEventListener("keydown", (e)=>{
if(e.key === "ArrowRight"){
current = (current + 1) % imgs.length;
updateCarousel();
preloadCarouselNeighbors();
}
if(e.key === "ArrowLeft"){
current = (current - 1 + imgs.length) % imgs.length;
updateCarousel();
preloadCarouselNeighbors();
}
});

document.querySelector(".carousel-wrapper .nav.next").onclick = () => {
    current = (current + 1) % imgs.length;
    updateCarousel();
    preloadCarouselNeighbors();
};

document.querySelector(".carousel-wrapper .nav.prev").onclick = () => {
    current = (current - 1 + imgs.length) % imgs.length;
    updateCarousel();
    preloadCarouselNeighbors();
};

const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");

const btnNext = document.querySelector(".lb-next");
const btnPrev = document.querySelector(".lb-prev");
const btnClose = document.querySelector(".lb-close");

let lbIndex = 0;
let scale = 1;

/* OPEN */
imgs.forEach((img, i)=>{
img.addEventListener("click", ()=>{
if(i === current){
lbIndex = i;
lightbox.classList.add("active");
lightboxImg.src = imgs[lbIndex].src;
scale = 1;
lightboxImg.style.transform = "scale(1)";
}
});
});

/* CLOSE */
btnClose.onclick = () => lightbox.classList.remove("active");

/* NEXT */
btnNext.onclick = () => {
lightboxImg.classList.add("lb-exit-left");

setTimeout(()=>{
lbIndex = (lbIndex + 1) % imgs.length;
lightboxImg.src = imgs[lbIndex].src;

lightboxImg.classList.remove("lb-exit-left");
lightboxImg.classList.add("lb-enter");

setTimeout(()=>{
lightboxImg.classList.remove("lb-enter");
}, 400);

}, 200);
};

/* PREV */
btnPrev.onclick = () => {
lightboxImg.classList.add("lb-exit-right");

setTimeout(()=>{
lbIndex = (lbIndex - 1 + imgs.length) % imgs.length;
lightboxImg.src = imgs[lbIndex].src;

lightboxImg.classList.remove("lb-exit-right");
lightboxImg.classList.add("lb-enter");

setTimeout(()=>{
lightboxImg.classList.remove("lb-enter");
}, 400);

}, 200);
};

/* KEYBOARD */
document.addEventListener("keydown", (e)=>{
if(!lightbox.classList.contains("active")) return;

if(e.key === "ArrowRight") btnNext.onclick();
if(e.key === "ArrowLeft") btnPrev.onclick();
if(e.key === "Escape") lightbox.classList.remove("active");
});

/* SCROLL ZOOM */
lightbox.addEventListener("wheel", (e)=>{
e.preventDefault();

if(e.deltaY < 0){
scale += 0.1;
}else{
scale -= 0.1;
}

scale = Math.max(1, Math.min(scale, 3));
lightboxImg.style.transform = `scale(${scale})`;
});

/* SWIPE (MOBITEL) */
let startX = 0;

lightbox.addEventListener("touchstart", e => {
    startX = e.touches[0].clientX;
});

lightbox.addEventListener("touchend", e => {
    let endX = e.changedTouches[0].clientX;

    if (startX - endX > 50) btnNext.onclick();
    if (endX - startX > 50) btnPrev.onclick();
});

lightbox.addEventListener("click", (e) => {
    // ako klikneš na pozadinu (ne na sliku ni gumb)
    if (e.target === lightbox) {
        lightbox.classList.remove("active");
    }
});

/* ========================= */
/* BEFORE / AFTER */
/* ========================= */

document.addEventListener("DOMContentLoaded", () => {
const pairs = [
  ["kia-before.webp", "kia-after.webp"],
  ["prije-poslije/chevi-1.webp", "prije-poslije/chevi-2.webp"],
  ["prije-poslije/jaguar-r-1.webp", "prije-poslije/jaguar-r-2.webp"],
  ["prije-poslije/jaguar-s-1.webp", "prije-poslije/jaguar-s-2.webp"],
  ["prije-poslije/jaguar-z-1.webp", "prije-poslije/jaguar-z-2.webp"],
  ["prije-poslije/kombi-p-1.webp", "prije-poslije/kombi-p-2.webp"],
  ["prije-poslije/kombi-r-1.webp", "prije-poslije/kombi-r-2.webp"],
  ["prije-poslije/kombi-s-1.webp", "prije-poslije/kombi-s-2.webp"],
  ["prije-poslije/lancia-g-1.webp", "prije-poslije/lancia-g-2.webp"],
  ["prije-poslije/lancia-t-1.webp", "prije-poslije/lancia-t-2.webp"],
  ["prije-poslije/lancia-v-1.webp", "prije-poslije/lancia-v-2.webp"],
  ["prije-poslije/lancia-v-v-1.webp", "prije-poslije/lancia-v-v-2.webp"],
  ["prije-poslije/lancia-z-1.webp", "prije-poslije/lancia-z-2.webp"],
  ["prije-poslije/merc-s-1.webp", "prije-poslije/merc-s-2.webp"],
 ["prije-poslije/merc-t-1.webp", "prije-poslije/merc-t-2.webp"],
  ["prije-poslije/merc-t-3.webp", "prije-poslije/merc-t-4.webp"],
  ["prije-poslije/merc-s-s-1.webp", "prije-poslije/merc-s-s-2.webp"],
  ["prije-poslije/merc-s-s-3.webp", "prije-poslije/merc-s-s-4.webp"],
  ["prije-poslije/merc-s-s-5.webp", "prije-poslije/merc-s-s-6.webp"],
  ["prije-poslije/range-1.webp", "prije-poslije/range-2.webp"]
];


  let index = 0;

  const base = document.querySelector(".compare-base");
  const top = document.querySelector(".compare-top");
  const bg = document.querySelector(".compare-bg");

  const slider = document.querySelector(".compare-slider");
  const overlay = document.querySelector(".compare-overlay");
  const handle = document.querySelector(".compare-handle");
  const divider = document.querySelector(".compare-divider");

  const prev = document.querySelector(".compare-nav.prev");
  const next = document.querySelector(".compare-nav.next");

  function update(instant = false) {
    const dirty = pairs[index][0];
    const clean = pairs[index][1];
    const val = slider.value;

    overlay.style.clipPath = `inset(0 ${100 - val}% 0 0)`;
    overlay.style.webkitClipPath = `inset(0 ${100 - val}% 0 0)`;
    handle.style.left = val + "%";
    divider.style.left = val + "%";

    top.src = dirty;
    base.src = clean;
    bg.style.backgroundImage = `url(${clean})`;

    if (!instant) {
      top.classList.add("compare-fade-in");
      base.classList.add("compare-fade-in");
      bg.classList.add("compare-fade-in");

      setTimeout(() => {
        top.classList.remove("compare-fade-in");
        base.classList.remove("compare-fade-in");
        bg.classList.remove("compare-fade-in");
      }, 200);
    }
  }

  slider.addEventListener("input", () => {
    const val = slider.value;
    overlay.style.clipPath = `inset(0 ${100 - val}% 0 0)`;
    overlay.style.webkitClipPath = `inset(0 ${100 - val}% 0 0)`;
    handle.style.left = val + "%";
    divider.style.left = val + "%";
  });

  next.addEventListener("click", () => {
    index = (index + 1) % pairs.length;
    update();
  });

  prev.addEventListener("click", () => {
    index = (index - 1 + pairs.length) % pairs.length;
    update();
  });

  update(true);
});


/* ========================= */
/* BOOKING FORM */
/* ========================= */

const bookingForm = document.getElementById("booking-form");
const bookingSelectedServices = document.getElementById("booking-selected-services");
const bookingOpenSelection = document.getElementById("booking-open-selection");
const bookingDateInput = document.getElementById("bookingDate");
const bookingTimeInput = document.getElementById("bookingTime");

if (bookingDateInput) {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");

    const todayFormatted = `${yyyy}-${mm}-${dd}`;
    bookingDateInput.value = todayFormatted;
    bookingDateInput.min = todayFormatted;
}

if (bookingTimeInput) {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, "0");
    const min = String(now.getMinutes()).padStart(2, "0");

  
    bookingTimeInput.addEventListener("input", () => {
        let value = bookingTimeInput.value.replace(/[^\d]/g, "");

        if (value.length > 2) {
            value = value.slice(0, 2) + ":" + value.slice(2);
        }

        bookingTimeInput.value = value.slice(0, 5);
    });
}
function syncBookingSelection() {
    if (!bookingSelectedServices) return;

    const items = [...document.querySelectorAll("#selection-list li")];
    bookingSelectedServices.innerHTML = "";

    if (!items.length) {
        bookingSelectedServices.innerHTML = "<li>Niste još odabrali paket ili usluge.</li>";
        return;
    }

    items.forEach(item => {
        const cloned = document.createElement("li");
        const textHolder = item.querySelector("span");

        if (textHolder) {
            cloned.textContent = textHolder.textContent.trim();
        } else {
            cloned.textContent = item.textContent.replace("✕", "").trim();
        }

        bookingSelectedServices.appendChild(cloned);
    });
}

bookingOpenSelection?.addEventListener("click", () => {
    const servicesSection = document.getElementById("services");

    if (servicesSection) {
        servicesSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
});

openButton?.addEventListener("click", () => {
    setTimeout(syncBookingSelection, 50);
});

closeButton?.addEventListener("click", () => {
    setTimeout(syncBookingSelection, 50);
});

document.addEventListener("click", (e) => {
    if (e.target.classList.contains("remove-package") || e.target.classList.contains("remove-service")) {
        setTimeout(syncBookingSelection, 50);
    }
});

document.querySelectorAll(".popup-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        setTimeout(syncBookingSelection, 100);
    });
});

document.addEventListener("DOMContentLoaded", syncBookingSelection);

bookingForm?.addEventListener("submit", function(e){
    e.preventDefault();

    const fullName = document.getElementById("fullName").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const vehicle = document.getElementById("vehicle").value.trim();
    const vehicleType = document.getElementById("vehicleType").value;
    const rawDate = document.getElementById("bookingDate").value;
    const bookingTime = document.getElementById("bookingTime").value.trim();
    const contactMethod = document.getElementById("contactMethod").value;
    const bookingNote = document.getElementById("bookingNote").value.trim();

    if (!rawDate) {
        alert("Molimo odaberite datum.");
        return;
    }

    const [year, month, day] = rawDate.split("-");
    const bookingDate = `${day}.${month}.${year}.`;

    const timeMatch = bookingTime.match(/^(\d{2}):(\d{2})$/);

    if (!timeMatch) {
        alert("Vrijeme mora biti u formatu HH:mm.");
        return;
    }

    const dayNum = parseInt(day, 10);
    const monthNum = parseInt(month, 10);
    const yearNum = parseInt(year, 10);

    const hour = parseInt(timeMatch[1], 10);
    const minute = parseInt(timeMatch[2], 10);

    if (hour > 23 || minute > 59) {
        alert("Unesite ispravno vrijeme u 24-satnom formatu.");
        return;
    }

    const selectedDate = new Date(yearNum, monthNum - 1, dayNum);
    selectedDate.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (
        selectedDate.getFullYear() !== yearNum ||
        selectedDate.getMonth() !== monthNum - 1 ||
        selectedDate.getDate() !== dayNum
    ) {
        alert("Unesite ispravan datum.");
        return;
    }

    if (selectedDate < today) {
        alert("Ne možete odabrati prošli datum.");
        return;
    }

    if (selectedDate.getDay() === 0) {
        alert("Nedjeljom ne radimo. Molimo odaberite drugi dan.");
        return;
    }

    const selectedItems = [...document.querySelectorAll("#booking-selected-services li")]
        .map(li => li.textContent.trim())
        .filter(text => text && text !== "Niste još odabrali paket ili usluge.");

    const servicesText = selectedItems.length
        ? selectedItems.map(item => `- ${item}`).join("\n")
        : "- Nije odabran paket/usluga";

    const message =
`Pozdrav, želim rezervirati termin.

Ime i prezime: ${fullName}
Telefon: ${phone}
Vozilo: ${vehicle || "-"}
Veličina vozila: ${vehicleType || "-"}
Željeni datum: ${bookingDate}
Željeno vrijeme: ${bookingTime}
Način kontakta: ${contactMethod}

Odabrane usluge / paket:
${servicesText}

Napomena:
${bookingNote || "-"}`;

const encodedMessage = encodeURIComponent(message);
const phoneNumber = "385996471243";

if (contactMethod === "Messenger") {
    const messengerUrl = `https://m.me/61585371756913`;
    
    // Kopiramo poruku u međuspremnik
    navigator.clipboard.writeText(message).then(() => {
        // Otvaramo naš lijepi popup
        const msgPopup = document.getElementById('messengerPopup');
        msgPopup.classList.add('show');
        
        // Što se događa kada korisnik klikne "U redu"
        document.getElementById('openMessengerBtn').onclick = function() {
            msgPopup.classList.remove('show'); // Zatvori popup
            window.open(messengerUrl, "_blank"); // Otvori Messenger
        };
        
        // Što se događa ako korisnik klikne X (samo zatvori)
        document.getElementById('closeMessengerPopup').onclick = function() {
            msgPopup.classList.remove('show');
        };
        
    }).catch(err => {
        // Ako mobitel blokira kopiranje, samo otvori Messenger direktno
        console.error("Greška pri kopiranju:", err);
        window.open(messengerUrl, "_blank");
    });
}

if (contactMethod === "WhatsApp") {
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
}

if (contactMethod === "Poziv") {
    const confirmCall = confirm("Preusmjeravamo vas na poziv 📞");
    if (confirmCall) {
        window.location.href = `tel:+${phoneNumber}`;
    }
}

if (contactMethod === "SMS") {
    window.location.href = `sms:+${phoneNumber}?body=${encodedMessage}`;
}
});

const selectionNote = document.getElementById("selection-note");
const bookingNoteField = document.getElementById("bookingNote");
const goToBookingBtn = document.getElementById("go-to-booking");

/* Moj izbor -> Rezervacija */
selectionNote?.addEventListener("input", () => {
    if (bookingNoteField) {
        bookingNoteField.value = selectionNote.value;
    }
});

/* Rezervacija -> Moj izbor */
bookingNoteField?.addEventListener("input", () => {
    if (selectionNote) {
        selectionNote.value = bookingNoteField.value;
    }
});

/* klik na Nastavi rezervaciju */
goToBookingBtn?.addEventListener("click", () => {
    if (selectionNote && bookingNoteField) {
        bookingNoteField.value = selectionNote.value;
    }

    const bookingSection = document.getElementById("booking");

    if (bookingSection) {
        bookingSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }

    document.getElementById("selection-panel").classList.remove("active");
});

/* ========================= */
/* SAVED VEHICLES IN BOOKING */
/* ========================= */


async function testLoggedUser() {
    const user = await getCurrentUser();
    console.log('Trenutni user:', user);
  }

  testLoggedUser();

  
function calculateTotalPrice(selection) {
  let total = { min: 0, max: 0 };

  // INTERIOR
  if (selection.interior === "basic") {
    addPrice(total, PRICES.interior.basic);
  }
  if (selection.interior === "wipe") {
    addPrice(total, PRICES.interior.wipe_and_vacuum);
  }
  if (selection.interior === "full") {
    addPrice(total, PRICES.interior.full);
  }

  // EXTERIOR
  if (selection.exterior === "basic") {
    addPrice(total, PRICES.exterior.basic);
  }
  if (selection.exterior === "rims") {
    addPrice(total, PRICES.exterior.wash_and_rims);
  }
  if (selection.exterior === "full") {
    addPrice(total, PRICES.exterior.full);
  }

  // CHEMICAL
  if (selection.chemical === "seats") {
    addPrice(total, PRICES.chemical.seats);
  }
  if (selection.chemical === "carpets") {
    addPrice(total, PRICES.chemical.carpets);
  }
  if (selection.chemical === "full") {
    addPrice(total, PRICES.chemical.seats_and_carpets);
  }

  // EXTRAS
  if (selection.ac) addPrice(total, PRICES.extras.antibacterial);
  if (selection.headlight) addPrice(total, PRICES.extras.headlights_polishing);
  if (selection.ceramic) addPrice(total, PRICES.extras.ceramic_protection);
  if (selection.engine) addPrice(total, PRICES.extras.engine_cleaning);

  return total;
}

function displayTotalPrice(total) {
  const el = document.getElementById("total-price");

  if (!el) return;

  if (total.min === 0 && total.max === 0) {
    el.textContent = "";
    return;
  }

  if (total.min === total.max) {
    el.textContent = `Procijenjena cijena: ${total.min}€`;
  } else {
    el.textContent = `Procijenjena cijena: ${total.min}€ – ${total.max}€`;
  }
}

const PRICES = {
  interior: {
    basic: 10,
    wipe_and_vacuum: 15,
    full: 20
  },
  exterior: {
    basic: 15,
    wash_and_rims: 17,
    full: 20
  },
  chemical: {
    seats: { min: 50, max: 70 },
    carpets: { min: 20, max: 50 },
    seats_and_carpets: { min: 65, max: 90 }
  },
  extras: {
    antibacterial: 15,
    headlights_polishing: { min: 50, max: 80 },
    ceramic_protection: { min: 30, max: 60 },
    engine_cleaning: { min: 20, max: 40 }
  }
};

function addPrice(total, price) {
  if (typeof price === "number") {
    total.min += price;
    total.max += price;
  } else {
    total.min += price.min;
    total.max += price.max;
  }
}

function calculateTotalPrice(selection) {
  let total = { min: 0, max: 0 };

  if (selection.interior === "basic") addPrice(total, PRICES.interior.basic);
  if (selection.interior === "wipe") addPrice(total, PRICES.interior.wipe_and_vacuum);
  if (selection.interior === "full") addPrice(total, PRICES.interior.full);

  if (selection.exterior === "basic") addPrice(total, PRICES.exterior.basic);
  if (selection.exterior === "rims") addPrice(total, PRICES.exterior.wash_and_rims);
  if (selection.exterior === "full") addPrice(total, PRICES.exterior.full);

  if (selection.chemical === "seats") addPrice(total, PRICES.chemical.seats);
  if (selection.chemical === "carpets") addPrice(total, PRICES.chemical.carpets);
  if (selection.chemical === "full") addPrice(total, PRICES.chemical.seats_and_carpets);

  if (selection.ac) addPrice(total, PRICES.extras.antibacterial);
  if (selection.headlight) addPrice(total, PRICES.extras.headlights_polishing);
  if (selection.ceramic) addPrice(total, PRICES.extras.ceramic_protection);
  if (selection.engine) addPrice(total, PRICES.extras.engine_cleaning);

  return total;
}

function displayTotalPrice(total) {
  const el = document.getElementById("total-price");
  if (!el) return;

  if (total.min === 0 && total.max === 0) {
    el.textContent = "";
    return;
  }

  if (total.min === total.max) {
    el.textContent = `Procijenjena cijena: ${total.min}€`;
  } else {
    el.textContent = `Procijenjena cijena: ${total.min}€ – ${total.max}€`;
  }
}

function updateTotal() {
  const total = calculateTotalPrice(currentSelection);
  displayTotalPrice(total);
}

document.querySelectorAll('#interiorPopup .popup-btn')[0]
  ?.addEventListener('click', () => {

    const selected = document.querySelector('input[name="interior"]:checked');

    if (!selected) return;

    const text = selected.parentElement.innerText;

    if (text.includes("Osnovno")) currentSelection.interior = "basic";
    if (text.includes("čišćenje površina")) currentSelection.interior = "wipe";
    if (text.includes("Kompletno")) currentSelection.interior = "full";

    updateTotal();
});

document.querySelector('#exteriorPopup .popup-btn')
  ?.addEventListener('click', () => {
    const selected = document.querySelector('input[name="exterior"]:checked');
    if (!selected) return;

    const text = selected.parentElement.innerText;

    if (text.includes("Osnovno")) currentSelection.exterior = "basic";
    if (text.includes("felge")) currentSelection.exterior = "rims";
    if (text.includes("Kompletno")) currentSelection.exterior = "full";

    updateTotal();
});

document.querySelector('#chemicalPopup .popup-btn')
  ?.addEventListener('click', () => {
    const selected = document.querySelector('input[name="chemical"]:checked');
    if (!selected) return;

    const text = selected.parentElement.innerText;

    if (text.includes("sjedala") && !text.includes("tepisi")) currentSelection.chemical = "seats";
    else if (text.includes("tepiha") && !text.includes("sjedala")) currentSelection.chemical = "carpets";
    else currentSelection.chemical = "full";

    updateTotal();
});

document.querySelector('#acPopup .popup-btn')
  ?.addEventListener('click', () => {
    currentSelection.ac = true;
    updateTotal();
});

document.querySelector('#headlightPopup .popup-btn')
  ?.addEventListener('click', () => {
    currentSelection.headlight = true;
    updateTotal();
});

document.querySelector('#ceramicPopup .popup-btn')
  ?.addEventListener('click', () => {
    currentSelection.ceramic = true;
    updateTotal();
});

document.querySelector('#enginePopup .popup-btn')
  ?.addEventListener('click', () => {
    currentSelection.engine = true;
    updateTotal();

});