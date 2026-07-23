// ========================
// STATE GLOBALE
// ========================
let archivio = [];
let progArchivio = [];

// iPhone: elimina ritardo click
document.addEventListener("touchstart", () => {}, { passive: true });

// =========================
// UTILITY
// =========================
const num = (v) => Number(v) || 0;

function debounce(fn, delay = 80) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), delay);
  };
}

// =========================
// FIREBASE – FRESE
// =========================
async function saveFresa(item) {
  const payload = {
    ...item,
    utente: CURRENT_USER,
    data_creazione: new Date().toISOString()
  };

  const ref = await db.collection("archivio_frese").add(payload);
  archivio.push({ id: ref.id, ...payload });
}

async function getFrese() {
  const snap = await db
    .collection("archivio_frese")
    .where("utente", "==", CURRENT_USER)
    .get();

  const result = [];
  snap.forEach(d => result.push({ id: d.id, ...d.data() }));
  return result;
}

// =========================
// FIREBASE – PROGRAMMAZIONE
// =========================
async function saveScheda(item) {
  const payload = {
    ...item,
    utente: CURRENT_USER,
    data_creazione: new Date().toISOString()
  };

  const ref = await db.collection("programmazione_schede").add(payload);
  progArchivio.push({ id: ref.id, ...payload });
}

async function getSchede() {
  const snap = await db
    .collection("programmazione_schede")
    .where("utente", "==", CURRENT_USER)
    .get();

  const result = [];
  snap.forEach(d => result.push({ id: d.id, ...d.data() }));
  return result;
}

// =========================
// FIREBASE – TIMELINE
// =========================
async function saveTimelineEntry(entry) {
  const payload = {
    ...entry,
    utente: CURRENT_USER,
    data_evento: new Date().toISOString()
  };

  await db.collection("storia_timeline").add(payload);
}

// =========================
// TEMA (SOLE / LUNA)
// =========================
const btnTheme = document.getElementById("btnTheme");
const themeIcon = document.getElementById("themeIcon");

const iconMoon = `
<svg width="22" height="22" viewBox="0 0 24 24" fill="none">
  <path d="M21 14.5A9 9 0 0 1 10.5 3 7.5 7.5 0 1 0 21 14.5Z" fill="currentColor"/>
</svg>
`;

const iconSun = `
<svg width="22" height="22" viewBox="0 0 24 24" fill="none">
  <circle cx="12" cy="12" r="5" fill="currentColor"/>
  <g stroke="currentColor" stroke-width="2">
    <line x1="12" y1="1" x2="12" y2="4"/>
    <line x1="12" y1="20" x2="12" y2="23"/>
    <line x1="1" y1="12" x2="4" y2="12"/>
    <line x1="20" y1="12" x2="23" y2="12"/>
    <line x1="4.2" y1="4.2" x2="6.3" y2="6.3"/>
    <line x1="17.7" y1="17.7" x2="19.8" y2="19.8"/>
    <line x1="4.2" y1="19.8" x2="6.3" y2="17.7"/>
    <line x1="17.7" y1="6.3" x2="19.8" y2="4.2"/>
  </g>
</svg>
`;

const savedTheme = localStorage.getItem("theme");
if (savedTheme === "light") {
  document.body.classList.add("light");
  document.body.classList.remove("dark");
  themeIcon.innerHTML = iconSun;
} else {
  document.body.classList.add("dark");
  document.body.classList.remove("light");
  themeIcon.innerHTML = iconMoon;
}

btnTheme.addEventListener("click", () => {
  const isLight = document.body.classList.toggle("light");
  if (isLight) {
    document.body.classList.remove("dark");
    themeIcon.innerHTML = iconSun;
    localStorage.setItem("theme", "light");
  } else {
    document.body.classList.add("dark");
    themeIcon.innerHTML = iconMoon;
    localStorage.setItem("theme", "dark");
  }
});

// =========================
// ELEMENTI MODAL FRESE
// =========================
const edit_denominazione = document.getElementById("edit_denominazione");
const edit_diametro = document.getElementById("edit_diametro");
const edit_taglienti = document.getElementById("edit_taglienti");
const edit_s = document.getElementById("edit_s");
const edit_avanzamento = document.getElementById("edit_avanzamento");
const edit_materiale = document.getElementById("edit_materiale");
const edit_refrigerante = document.getElementById("edit_refrigerante");
const edit_dettagli = document.getElementById("edit_dettagli");

// =========================
// ELEMENTI MODAL PROGRAMMAZIONE
// =========================
const edit_prog_macchina = document.getElementById("edit_prog_macchina");
const edit_prog_commessa = document.getElementById("edit_prog_commessa");
const edit_prog_disegno = document.getElementById("edit_prog_disegno");
const edit_prog_rev = document.getElementById("edit_prog_rev");
const edit_prog_data = document.getElementById("edit_prog_data");
const edit_prog_tempo = document.getElementById("edit_prog_tempo");
const edit_prog_operatore = document.getElementById("edit_prog_operatore");
const edit_prog_stato = document.getElementById("edit_prog_stato");
const edit_prog_note = document.getElementById("edit_prog_note");

// =========================
// ELEMENTI PAGINA PROGRAMMAZIONE
// =========================
const prog_macchina = document.getElementById("prog_macchina");
const prog_commessa = document.getElementById("prog_commessa");
const prog_disegno = document.getElementById("prog_disegno");
const prog_rev = document.getElementById("prog_rev");
const prog_data = document.getElementById("prog_data");
const prog_tempo = document.getElementById("prog_tempo");
const prog_operatore = document.getElementById("prog_operatore");
const prog_stato = document.getElementById("prog_stato");
const prog_note = document.getElementById("prog_note");

// =========================
// ELEMENTI PAGINA NUOVO
// =========================
const den = document.getElementById("denominazione_fresa");
const diam = document.getElementById("diametro");
const tagl = document.getElementById("taglienti");
const s = document.getElementById("s");
const f = document.getElementById("f");
const mmin = document.getElementById("mmin");
const s_calc = document.getElementById("s_calc");
const avanzamento = document.getElementById("avanzamento");
const f_calc = document.getElementById("f_calc");
const zap = document.getElementById("zap");
const xyae = document.getElementById("xyae");
const codFresa = document.getElementById("codice_fresa");
const codInserto = document.getElementById("codice_inserto");
const materiale = document.getElementById("materiale");
const refrigerante = document.getElementById("refrigerante");
const dettagli = document.getElementById("dettagli");

// =========================
// DASHBOARD
// =========================
const dash_tot_schede = document.getElementById("dash_tot_schede");
const dash_in_prog = document.getElementById("dash_in_prog");
const dash_programmato = document.getElementById("dash_programmato");
const dash_produzione = document.getElementById("dash_produzione");
const dash_sospeso = document.getElementById("dash_sospeso");
const dash_finito = document.getElementById("dash_finito");
const dash_recent_schede = document.getElementById("dash_recent_schede");
const dash_recent_frese = document.getElementById("dash_recent_frese");

function renderDashboard() {
  const tot = progArchivio.length;
  const inProg = progArchivio.filter(x => x.stato === "in_programmazione").length;
  const programmato = progArchivio.filter(x => x.stato === "programmato").length;
  const produzione = progArchivio.filter(x => x.stato === "in_produzione").length;
  const sospeso = progArchivio.filter(x => x.stato === "sospeso").length;
  const finito = progArchivio.filter(x => x.stato === "finito").length;

  dash_tot_schede.textContent = tot;
  dash_in_prog.textContent = inProg;
  dash_programmato.textContent = programmato;
  dash_produzione.textContent = produzione;
  dash_sospeso.textContent = sospeso;
  dash_finito.textContent = finito;

  dash_recent_schede.innerHTML = progArchivio
    .slice(-5)
    .reverse()
    .map(item => `
      <div class="dash-item">
        <div class="dash-item-title">${item.commessa}</div>
        <div class="dash-item-meta">${item.stato.replace("_"," ")}</div>
      </div>
    `)
    .join("");

  dash_recent_frese.innerHTML = archivio
    .slice(-5)
    .reverse()
    .map(item => `
      <div class="dash-item">
        <div class="dash-item-title">${item.denominazione}</div>
        <div class="dash-item-meta">Ø ${item.diametro} — ${item.materiale}</div>
      </div>
    `)
    .join("");
}

// =========================
// TIMELINE
// =========================
const prog_timeline = document.getElementById("prog_timeline");

function renderProgTimeline() {
  prog_timeline.innerHTML = "";

  const frag = document.createDocumentFragment();

  progArchivio.forEach(item => {
    const div = document.createElement("div");
    div.className = "timeline-item";

    div.innerHTML = `
      <div class="timeline-title">${item.commessa}</div>
      <div class="timeline-meta">${item.stato.replace("_"," ")}</div>
      <div class="timeline-date">${item.dataProgramma || item.data_evento}</div>
    `;

    frag.appendChild(div);
  });

  prog_timeline.appendChild(frag);
}

// =========================
// POPOLA LISTE
// =========================
materiale.innerHTML = `
  <option>Acciaio</option>
  <option>Temprato</option>
  <option>Inox</option>
  <option>Alluminio</option>
  <option>Ghisa</option>
  <option>Rame</option>
  <option>Ottone</option>
`;

refrigerante.innerHTML = `
  <option>Acqua interna</option>
  <option>Acqua esterna</option>
  <option>Aria intero</option>
  <option>Aria esterna</option>
  <option>Secco</option>
`;

document.getElementById("edit_materiale").innerHTML =
  document.getElementById("materiale").innerHTML;
document.getElementById("edit_refrigerante").innerHTML =
  document.getElementById("refrigerante").innerHTML;

// =========================
// TOAST
// =========================
const toast = document.getElementById("toast");
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.remove("hidden");
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
    toast.classList.add("hidden");
  }, 1800);
}

// =========================
// CALCOLI PAGINA NUOVO
// =========================
diam.addEventListener("input", debounce(calcolaS));
mmin.addEventListener("input", debounce(calcolaS));

function calcolaS() {
  const D = num(diam.value);
  const M = num(mmin.value);
  if (D > 0 && M > 0) {
    s_calc.value = Math.round((1000 * M) / (Math.PI * D));
  } else {
    s_calc.value = "";
  }
}

tagl.addEventListener("input", debounce(calcolaF));
avanzamento.addEventListener("input", debounce(calcolaF));
s_calc.addEventListener("input", debounce(calcolaF));
f.addEventListener("input", debounce(calcolaF));

function calcolaF() {
  const S = num(s_calc.value);
  const Fg = num(f.value);
  const Z = num(tagl.value);
  const A = num(avanzamento.value);

  if (S > 0) {
    if (Fg > 0) {
      f_calc.value = Math.round(S * Fg);
    } else if (Z > 0 && A > 0) {
      f_calc.value = Math.round(S * Z * A);
    } else {
      f_calc.value = "";
    }
  } else {
    f_calc.value = "";
  }
}

// =========================
const pages = {
  dashboard: document.getElementById("page-dashboard"),
  nuovo: document.getElementById("page-nuovo"),
  archivio: document.getElementById("page-archivio"),
  programmazione: document.getElementById("page-programmazione"),
  timeline: document.getElementById("page-timeline")
};

const viewSelect = document.getElementById("viewSelect");

viewSelect.addEventListener("change", (e) => {
  const page = e.target.value;

  Object.values(pages).forEach(p => {
    p.style.display = "none";
  });
  pages[page].style.display = "block";

  if (page === "dashboard") renderDashboard();
  if (page === "archivio") renderArchivio();
  if (page === "programmazione") {
    renderProgArchivio();
    renderProgTimeline();
  }
  if (page === "timeline") renderProgTimeline();
});

// =========================
// ARCHIVIO FRESE
// =========================
const lista = document.getElementById("lista");
const sortSelect = document.getElementById("sortSelect");
const orderSelect = document.getElementById("orderSelect");

function resetCampiNuovo() {
  den.value = "";
  diam.value = "";
  tagl.value = "";
  s.value = "";
  f.value = "";
  mmin.value = "";
  s_calc.value = "";
  avanzamento.value = "";
  f_calc.value = "";
  zap.value = "";
  xyae.value = "";
  codFresa.value = "";
  codInserto.value = "";
  materiale.value = "";
  refrigerante.value = "";
  dettagli.value = "";
}

document.getElementById("btnSalva").addEventListener("click", async () => {
  const item = {
    denominazione: den.value.trim(),
    diametro: num(diam.value),
    taglienti: num(tagl.value),
    s: num(s.value),
    f: num(f.value),
    mmin: num(mmin.value),
    sCalc: num(s_calc.value),
    avanzamento: num(avanzamento.value),
    fCalc: num(f_calc.value),
    zap: num(zap.value),
    xyae: num(xyae.value),
    codiceFresa: codFresa.value.trim(),
    codiceInserto: codInserto.value.trim(),
    materiale: materiale.value,
    refrigerante: refrigerante.value,
    dettagli: dettagli.value.trim()
  };

  await saveFresa(item);
  renderArchivio();
  showToast("Fresa salvata ✔");
  resetCampiNuovo();
});

function renderArchivio() {
  lista.innerHTML = "";

  let arr = [...archivio];
  const key = sortSelect.value;
  const ord = orderSelect.value;

  arr.sort((a, b) => {
    if (ord === "asc") return a[key] > b[key] ? 1 : -1;
    return a[key] < b[key] ? 1 : -1;
  });

  arr.forEach((item, idx) => {
    const div = document.createElement("div");
    div.className = "arch-item";

    div.innerHTML = `
      <div class="arch-item-title">${item.denominazione}</div>
      <div class="arch-item-meta">Ø ${item.diametro} — ${item.materiale}</div>
    `;

    const btnMod = document.createElement("button");
    btnMod.textContent = "Modifica";
    btnMod.className = "btn-primary";
    btnMod.style.marginTop = "6px";
    btnMod.addEventListener("click", () => apriPopup(idx));

    const btnDel = document.createElement("button");
    btnDel.textContent = "Elimina";
    btnDel.className = "btn-secondary";
    btnDel.style.marginTop = "6px";
    btnDel.addEventListener("click", async () => {
      const id = archivio[idx].id;
      await db.collection("archivio_frese").doc(id).delete();
      archivio.splice(idx, 1);
      renderArchivio();
      showToast("Fresa eliminata ✔");
    });

    div.appendChild(btnMod);
    div.appendChild(btnDel);
    lista.appendChild(div);
  });
}

// =========================
// MODAL FRESE
// =========================
const modalEdit = document.getElementById("modalEdit");
const btnCloseModal = document.getElementById("btnCloseModal");
let editIndex = null;

function apriPopup(idx) {
  edit
