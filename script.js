
(function initTheme() {
  const saved = localStorage.getItem("aidchain-theme");
  const sysDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  document.documentElement.setAttribute("data-theme", saved || (sysDark ? "dark" : "light"));
})();
function updateThemeIcon() {
  const t = document.documentElement.getAttribute("data-theme");
  document.getElementById("themeIcon").className = t === "dark" ? "fa-solid fa-sun" : "fa-solid fa-moon";
}
document.getElementById("themeToggle").addEventListener("click", () => {
  const cur = document.documentElement.getAttribute("data-theme");
  const next = cur === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem("aidchain-theme", next);
  updateThemeIcon();
});
updateThemeIcon();


function route(id) {
  document.querySelectorAll(".page-engine").forEach((v) => v.classList.remove("active"));
  document.querySelectorAll(".nav-links a").forEach((l) => l.classList.remove("active"));
  document.getElementById(id + "-view").classList.add("active");
  const link = document.getElementById("lnk-" + id);
  if (link) link.classList.add("active");
  window.scrollTo({ top: 0, behavior: "smooth" });
}


const heroImages = [
  "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070",
  "https://images.unsplash.com/photo-1542810634-7bcbae4e9911?q=80&w=2070",
  "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?q=80&w=2070",
  "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=2070",
  "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2070"
];
const stage = document.getElementById("heroStage");
heroImages.forEach((src, i) => {
  const div = document.createElement("div");
  div.className = "hero-slide" + (i === 0 ? " active" : "");
  div.style.backgroundImage = `url('${src}')`;
  stage.appendChild(div);
  const img = new Image(); img.src = src;
});
let heroIdx = 0;
function nextHeroSlide() {
  const slides = stage.querySelectorAll(".hero-slide");
  const prev = heroIdx;
  heroIdx = (heroIdx + 1) % slides.length;
  slides[heroIdx].classList.add("active");
  setTimeout(() => slides[prev].classList.remove("active"), 1100);
}
setInterval(nextHeroSlide, 5500);


const CATS = [
  { key: "General Aid",    label: "🌍 General Aid" },
  { key: "Education",      label: "🎓 Education" },
  { key: "Medical",        label: "🏥 Medical" },
  { key: "Infrastructure", label: "🏗️ Infrastructure" },
];
const flow = {
  "General Aid":    320000,
  "Education":      485000,
  "Medical":        610000,
  "Infrastructure": 415000,
};
const feed = [];

function flowTotal() { return Object.values(flow).reduce((a,b)=>a+b,0); }
function fmt(n) { return "$" + Math.round(n).toLocaleString(); }
function cssId(k){ return k.replace(/\s+/g,"-"); }

function buildFlowSkeleton() {
  const bars = document.getElementById("bars");
  bars.innerHTML = CATS.map(c => `
    <div class="bar-row" id="bar-${cssId(c.key)}">
      <div class="bar-head">
        <span class="bar-name">${c.label}</span>
        <span class="bar-amt" id="amt-${cssId(c.key)}">$0</span>
      </div>
      <div class="bar-track">
        <div class="bar-fill" id="fill-${cssId(c.key)}"></div>
      </div>
    </div>
  `).join("");
}

function renderFlow(highlightKey) {
  const total = flowTotal();
  document.getElementById("flowTotal").textContent = fmt(total);
  const max = Math.max(...Object.values(flow), 1);

  CATS.forEach(c => {
    const v = flow[c.key];
    // Bars are scaled relative to the largest category so all bars stay visually meaningful
    const pct = (v / max) * 100;
    document.getElementById("amt-" + cssId(c.key)).textContent = fmt(v);
    document.getElementById("fill-" + cssId(c.key)).style.width = pct + "%";
    const row = document.getElementById("bar-" + cssId(c.key));
    row.classList.remove("bumped");
    if (highlightKey === c.key) {
      void row.offsetWidth;
      row.classList.add("bumped");
    }
  });
}

function pushFeed(entry) {
  feed.unshift(entry);
  const el = document.getElementById("feed");
  el.innerHTML = feed.slice(0, 3).map((f, i) => `
    <div class="feed-line" style="animation-delay:${i*60}ms">
      <b>${f.anon ? "Anonymous" : f.name}</b> → <span style="color:var(--primary)">${f.sector}</span>
      · $${f.amt.toLocaleString()}
    </div>
  `).join("");
}

buildFlowSkeleton();
renderFlow();
pushFeed({ name: "Satoshi Protocol", amt: 500000, sector: "Infrastructure", anon: false });
pushFeed({ name: "Addis Tech Hub",   amt: 125000, sector: "Education",      anon: false });

/* ---------- DEPLOYMENTS (with Pexels API for live imagery) ---------- */
const PEXELS_KEY = "9GoYKPQmQoGAg28HUDyvJwhivmqpZznOpHKbAwDK1HdOLukW1y1T9JaN";

const deployments = [
  { tag: "Infrastructure", title: "Solar Water Wells",
    query: "people water well community africa",
    fallback: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?q=80&w=600",
    desc: "Solar-powered boreholes in the Somali region. Each well provides clean water to 200+ households daily." },
  { tag: "Education", title: "Rural Tech Hubs",
    query: "rural school children classroom",
    fallback: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=600",
    desc: "Bringing digital literacy to remote districts with satellite-connected learning hubs and refurbished laptops." },
  { tag: "Medical", title: "Vaccine Logistics",
    query: "healthcare remote village medicine",
    fallback: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=600",
    desc: "Temperature-controlled storage and drone delivery to bring vaccines to remote mountain villages." },
  { tag: "Infrastructure", title: "Off-Grid Microgrids",
    query: "solar panels village africa",
    fallback: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?q=80&w=600",
    desc: "Solar microgrids powering clinics, schools and small businesses in regions without reliable electricity." },
  { tag: "Education", title: "Girls' Scholarship Corridor",
    query: "african girl student school uniform",
    fallback: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=600",
    desc: "Funding tuition, books and mentorship for girls in rural communities, audited on the ledger." },
  { tag: "Medical", title: "Mobile Maternal Clinics",
    query: "mother baby clinic africa",
    fallback: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=600",
    desc: "Outfitted vans bringing prenatal care, ultrasounds and emergency birthing kits to remote villages." },
  { tag: "General Aid", title: "Drought Response Convoys",
    query: "humanitarian aid food distribution",
    fallback: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=600",
    desc: "Rapid food, water and shelter convoys deployed to drought-stricken regions within 72 hours." },
  { tag: "Infrastructure", title: "Community Sanitation Blocks",
    query: "clean water sanitation community",
    fallback: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?q=80&w=600",
    desc: "Building safe, lit sanitation facilities in dense informal settlements to reduce disease." },
  { tag: "Education", title: "Open Library Network",
    query: "library books reading children",
    fallback: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=600",
    desc: "Solar-lit reading rooms with curated books, e-readers and study resources for after-school learning." }
];

// Cache photos per-card so prev/next can cycle
const pexelsCache = {}; // idx -> { photos: [...], i: 0 }

async function fetchPexels(idx, query) {
  try {
    const res = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=8&page=1`,
      { headers: { Authorization: PEXELS_KEY } }
    );
    if (!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();
    if (data.photos && data.photos.length) {
      pexelsCache[idx] = { photos: data.photos, i: 0 };
      updateCardImage(idx);
    }
  } catch (e) {
    console.warn("Pexels fetch failed for", query, e);
  }
}

function updateCardImage(idx) {
  const cache = pexelsCache[idx];
  if (!cache) return;
  const photo = cache.photos[cache.i];
  const img = document.getElementById("mimg-" + idx);
  const credit = document.getElementById("mcredit-" + idx);
  if (img) img.src = photo.src.large;
  if (credit) credit.textContent = "📷 " + photo.photographer;
}

function cyclePexels(idx, dir) {
  const cache = pexelsCache[idx];
  if (!cache) return;
  const len = cache.photos.length;
  cache.i = (cache.i + dir + len) % len;
  updateCardImage(idx);
}

function renderMissions() {
  document.getElementById("missionGrid").innerHTML = deployments.map((d, idx) => `
    <div class="mission-card">
      <div class="mission-img-wrap" style="position:relative; overflow:hidden;">
        <img id="mimg-${idx}" src="${d.fallback}" alt="${d.title}" />
        <div class="pexels-nav" style="position:absolute; bottom:10px; right:10px; display:flex; gap:6px; z-index:2;">
          <button onclick="cyclePexels(${idx},-1)" aria-label="Previous photo"
            style="width:32px;height:32px;border-radius:50%;border:0;background:rgba(0,0,0,0.55);color:#fff;cursor:pointer;backdrop-filter:blur(6px);">‹</button>
          <button onclick="cyclePexels(${idx}, 1)" aria-label="Next photo"
            style="width:32px;height:32px;border-radius:50%;border:0;background:rgba(0,0,0,0.55);color:#fff;cursor:pointer;backdrop-filter:blur(6px);">›</button>
        </div>
        <span id="mcredit-${idx}" style="position:absolute; bottom:10px; left:10px; font-size:0.6rem; letter-spacing:1px; color:#fff; background:rgba(0,0,0,0.45); padding:4px 8px; border-radius:999px; backdrop-filter:blur(6px);"></span>
      </div>
      <div class="mission-body">
        <span class="mission-tag">${d.tag}</span>
        <h3>${d.title}</h3>
        <p>${d.desc}</p>
        <button class="btn-gold" style="width:100%; padding:15px" onclick="contributeTo('${d.tag}')">Contribute</button>
      </div>
    </div>
  `).join("");

  // Kick off Pexels fetches after DOM is in place
  deployments.forEach((d, idx) => fetchPexels(idx, d.query));
}
renderMissions();

function contributeTo(sector) {
  route("home");
  const sel = document.getElementById("inSector");
  const known = ["General Aid","Education","Medical","Infrastructure"];
  sel.value = known.includes(sector) ? sector : "General Aid";
  setTimeout(() => {
    document.getElementById("impact-terminal").scrollIntoView({ behavior: "smooth", block: "center" });
    document.getElementById("inName").focus();
  }, 600);
}

/* ---------- DONATION EXECUTION ---------- */
let donorsList = [
  { name: "Satoshi Protocol", amt: 500000, country: "Japan", sector: "Infrastructure", anon: false },
  { name: "Addis Tech Hub", amt: 125000, country: "Ethiopia", sector: "Education", anon: false }
];

function executeImpact() {
  const anon = document.getElementById("inAnon").checked;
  const nameRaw = document.getElementById("inName").value.trim();
  const country = document.getElementById("inCountry").value.trim() || "Global";
  const sector = document.getElementById("inSector").value;
  const amt = parseInt(document.getElementById("inAmt").value);
  if (!amt || amt <= 0) return alert("Please enter an amount.");

  flow[sector] = (flow[sector] || 0) + amt;
  renderFlow(sector);
  pushFeed({ name: nameRaw || "Anonymous Ally", amt, sector, anon });

  const displayName = anon ? "Anonymous Donor" : (nameRaw || "Anonymous Ally");
  donorsList.unshift({
    name: displayName, amt, country: anon ? "Undisclosed" : country, sector, anon
  });


  document.getElementById("inName").value = "";
  document.getElementById("inCountry").value = "";
  document.getElementById("inAmt").value = "";
  document.getElementById("inAnon").checked = false;

  renderWall();

  route("donors");
}

function renderWall() {
  document.getElementById("donor-ledger").innerHTML = donorsList.map(d => `
    <div class="donor-card">
      <div style="display:flex; justify-content:space-between; margin-bottom:15px;">
        <span class="mission-tag">${d.sector}</span>
        <span style="font-size:0.7rem; font-weight:700; opacity:0.5;">📍 ${d.country.toUpperCase()}</span>
      </div>
      <h3>${d.name}${d.anon ? '<span class="anon-badge">ANON</span>' : ''}</h3>
      <div class="amt">$${d.amt.toLocaleString()}</div>
      <p style="opacity:0.35; font-size:0.6rem; margin-top:20px; letter-spacing:1px;">
        TX-ID: 2026-${Math.floor(Math.random() * 9999)}
      </p>
    </div>
  `).join("");
}
renderWall();
