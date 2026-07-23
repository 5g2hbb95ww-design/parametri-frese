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
  document.body.classList.toggle("dark", !isLight);
  themeIcon.innerHTML = isLight ? iconSun : iconMoon;
  localStorage.setItem("theme", isLight ? "light" : "dark");
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
// PAGINE
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
  showPage(page);
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
  editIndex = idx;
  const item = archivio[idx];

  edit_denominazione.value = item.denominazione;
  edit_diametro.value = item.diametro;
  edit_taglienti.value = item.taglienti;
  edit_s.value = item.s;
  edit_avanzamento.value = item.avanzamento;
  edit_materiale.value = item.materiale;
  edit_refrigerante.value = item.refrigerante;
  edit_dettagli.value = item.dettagli;

  modalEdit.classList.remove("hidden");
  modalEdit.style.display = "flex";
}

btnCloseModal.addEventListener("click", () => {
  modalEdit.classList.add("hidden");
  modalEdit.style.display = "none";
});

document.getElementById("btnUpdate").addEventListener("click", async () => {
  const item = archivio[editIndex];

  const updated = {
    denominazione: edit_denominazione.value.trim(),
    diametro: num(edit_diametro.value),
    taglienti: num(edit_taglienti.value),
    s: num(edit_s.value),
    avanzamento: num(edit_avanzamento.value),
    materiale: edit_materiale.value,
    refrigerante: edit_refrigerante.value,
    dettagli: edit_dettagli.value.trim()
  };

  await db.collection("archivio_frese").doc(item.id).update(updated);
  archivio[editIndex] = { id: item.id, ...updated };

  renderArchivio();
  modalEdit.classList.add("hidden");
  modalEdit.style.display = "none";
  showToast("Fresa aggiornata ✔");
});

// =========================
// PROGRAMMAZIONE
// =========================
let progEditIndex = null;

const prog_lista = document.getElementById("prog_lista");
const prog_progress = document.getElementById("prog_progress");
const prog_filter = document.getElementById("prog_filter");

function resetCampiProgrammazione() {
  prog_macchina.value = "";
  prog_commessa.value = "";
  prog_disegno.value = "";
  prog_rev.value = "";
  prog_data.value = "";
  prog_tempo.value = "";
  prog_operatore.value = "";
  prog_stato.value = "in_programmazione";
  prog_note.value = "";
}

document.getElementById("btnSalvaProgrammazione").addEventListener("click", async () => {
  const item = {
    macchina: prog_macchina.value,
    commessa: prog_commessa.value.trim(),
    disegno: prog_disegno.value.trim(),
    revisione: prog_rev.value.trim(),
    dataProgramma: prog_data.value,
    tempo: num(prog_tempo.value),
    operatore: prog_operatore.value,
    stato: prog_stato.value,
    note: prog_note.value.trim(),
    history: [
      {
        stato: prog_stato.value,
        timestamp: new Date().toLocaleString()
      }
    ]
  };

  await saveScheda(item);

  await saveTimelineEntry({
    commessa: item.commessa,
    stato: item.stato,
    timestamp: new Date().toLocaleString()
  });

  renderProgArchivio();
  renderProgTimeline();
  showToast("Scheda salvata ✔");
  resetCampiProgrammazione();
});

function renderProgArchivio() {
  prog_lista.innerHTML = "";
  prog_progress.innerHTML = "";

  let arr = [...progArchivio];

  if (prog_filter.value) {
    arr = arr.filter(x => x.stato === prog_filter.value);
  }

  arr.forEach((item, idx) => {
    const div = document.createElement("div");
    div.className = "arch-item";

    div.innerHTML = `
      <div class="arch-item-title">${item.commessa}</div>
      <div class="arch-item-meta">${item.macchina} — ${item.operatore}</div>
      <span class="badge ${item.stato}">${item.stato.replace("_", " ")}</span>
      <div class="arch-item-meta">${item.dataProgramma}</div>
    `;

    const btnMod = document.createElement("button");
    btnMod.textContent = "Modifica";
    btnMod.className = "btn-primary";
    btnMod.style.marginTop = "6px";
    btnMod.addEventListener("click", () => apriProgPopup(idx));

    const btnDel = document.createElement("button");
    btnDel.textContent = "Elimina";
    btnDel.className = "btn-secondary";
    btnDel.style.marginTop = "6px";
    btnDel.addEventListener("click", async () => {
      const id = progArchivio[idx].id;
      await db.collection("programmazione_schede").doc(id).delete();
      progArchivio.splice(idx, 1);
      renderProgArchivio();
      renderProgTimeline();
      showToast("Scheda eliminata ✔");
    });

    div.appendChild(btnMod);
    div.appendChild(btnDel);
    prog_lista.appendChild(div);

    const pb = document.createElement("div");
    pb.className = "progress-bar";

    const pf = document.createElement("div");
    pf.className = "progress-fill programmazione";
    pf.style.width =
      item.stato === "finito" ? "100%" :
      item.stato === "in_produzione" ? "70%" :
      item.stato === "programmato" ? "40%" :
      "10%";

    pb.appendChild(pf);
    prog_progress.appendChild(pb);
  });
}

// =========================
// MODAL PROGRAMMAZIONE
// =========================
const modalProgEdit = document.getElementById("modalProgEdit");
const btnProgClose = document.getElementById("btnProgClose");
const btnProgUpdate = document.getElementById("btnProgUpdate");

btnProgClose.addEventListener("click", () => {
  modalProgEdit.classList.add("hidden");
  modalProgEdit.style.display = "none";
});

function apriProgPopup(idx) {
  progEditIndex = idx;
  const item = progArchivio[idx];

  edit_prog_macchina.value = item.macchina;
  edit_prog_commessa.value = item.commessa;
  edit_prog_disegno.value = item.disegno;
  edit_prog_rev.value = item.revisione;
  edit_prog_data.value = item.dataProgramma;
  edit_prog_tempo.value = item.tempo;
  edit_prog_operatore.value = item.operatore;
  edit_prog_stato.value = item.stato;
  edit_prog_note.value = item.note || "";

  modalProgEdit.classList.remove("hidden");
  modalProgEdit.style.display = "flex";
}

btnProgUpdate.addEventListener("click", async () => {
  const item = progArchivio[progEditIndex];
  
  const nuovoStato = edit_prog_stato.value;
  const timestamp = new Date().toLocaleString();

  const updated = {
    macchina: edit_prog_macchina.value,
    commessa: edit_prog_commessa.value.trim(),
    disegno: edit_prog_disegno.value.trim(),
    revisione: edit_prog_rev.value.trim(),
    dataProgramma: edit_prog_data.value,
    tempo: num(edit_prog_tempo.value),
    operatore: edit_prog_operatore.value,
    stato: nuovoStato,
    note: edit_prog_note.value.trim(),
    history: [...item.history]
  };

  if (item.stato !== nuovoStato) {
    updated.history.push({
      stato: nuovoStato,
      timestamp
    });

    await saveTimelineEntry({
      commessa: updated.commessa,
      stato: nuovoStato,
      timestamp
    });
  }

  await db.collection("programmazione_schede").doc(item.id).update(updated);
  progArchivio[progEditIndex] = { id: item.id, ...updated };

  renderProgArchivio();
  renderProgTimeline();

  modalProgEdit.classList.add("hidden");
  modalProgEdit.style.display = "none";
  showToast("Scheda aggiornata ✔");
});

// =========================
// EXPORT PDF
// =========================
document.getElementById("btnExportPDF").addEventListener("click", () => {
  let html = `
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Report schede</title>
      <style>
        body {
          font-family: system-ui, -apple-system, sans-serif;
          background: #0b1020;
          color: #e9faff;
          padding: 20px;
        }
        h1 {
          font-size: 20px;
          margin-bottom: 16px;
          color: #9fe4ff;
        }
        .card {
          margin-bottom: 16px;
          padding: 14px;
          border-radius: 18px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.18);
        }
        .title {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 6px;
          color: #9fe4ff;
        }
        .row {
          margin: 2px 0;
          font-size: 14px;
        }
        .label {
          font-weight: 600;
        }
      </style>
    </head>
    <body>
      <h1>Report schede programmazione</h1>
  `;

  progArchivio.forEach(item => {
    html += `
      <div class="card">
        <div class="title">${item.commessa}</div>
        <div class="row"><span class="label">Macchina:</span> ${item.macchina}</div>
        <div class="row"><span class="label">Disegno:</span> ${item.disegno}</div>
        <div class="row"><span class="label">Revisione:</span> ${item.revisione}</div>
        <div class="row"><span class="label">Data:</span> ${item.dataProgramma}</div>
        <div class="row"><span class="label">Tempo:</span> ${item.tempo} min</div>
        <div class="row"><span class="label">Operatore:</span> ${item.operatore}</div>
        <div class="row"><span class="label">Stato attuale:</span> ${item.stato}</div>
        <div class="row"><span class="label">Storico stati:</span><br>
          ${item.history.map(h => `${h.timestamp} → ${h.stato}`).join("<br>")}
        </div>
        <div class="row"><span class="label">Note:</span> ${item.note || "-"}
        </div>
      </div>
    `;
  });

  html += `
    </body>
    </html>
  `;

  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank");
});

// listener per PDF dalla timeline
const btnExportTimeline = document.getElementById("btnExportPDFTimeline");
if (btnExportTimeline) {
  btnExportTimeline.addEventListener("click", () => {
    viewSelect.value = "programmazione";
    showPage("programmazione");
    document.getElementById("btnExportPDF").click();
  });
}

// ===============================
// BANNER UPDATE + AUTO‑RELOAD
// ===============================
if ("serviceWorker" in navigator) {
  const updateBanner = document.getElementById("updateBanner");
  const btnUpdateNow = document.getElementById("btnUpdateNow");

  navigator.serviceWorker.addEventListener("message", async (event) => {
    if (event.data && event.data.type === "NEW_VERSION") {
      updateBanner.classList.remove("hidden");
    }
  });

  if (btnUpdateNow) {
    btnUpdateNow.addEventListener("click", async () => {
      console.log("[APP] Aggiorno ora…");

      if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage("skipWaiting");
      }

      window.location.reload();
    });
  }
}

// ===============================
// BOTTONE SFERICO SINISTRO → DASHBOARD
// ===============================
const dashBtn = document.getElementById("dashboardBtn");

if (dashBtn) {
  dashBtn.addEventListener("click", () => {
    viewSelect.value = "dashboard";
    showPage("dashboard");
  });
}

// ===============================
// MENU PAGINE A BOLLE (rapido)
// ===============================
const pageMenu = document.getElementById("pageMenu");
const rightBtn = document.getElementById("openModalBtn");

if (rightBtn && pageMenu) {
  rightBtn.addEventListener("click", () => {
    pageMenu.classList.toggle("hidden");
  });

  document.querySelectorAll(".page-menu .bubble").forEach(b => {
    b.addEventListener("click", () => {
      const page = b.dataset.page;
      viewSelect.value = page;
      showPage(page);
      pageMenu.classList.add("hidden");
    });
  });
}

// bubble per tema nel menu
const bubbleTheme = document.getElementById("bubbleTheme");
if (bubbleTheme) {
  bubbleTheme.addEventListener("click", () => {
    btnTheme.click();
  });
}

// ===============================
// AVVIO APP
// ===============================
(async () => {
  Object.values(pages).forEach(p => p.classList.remove("active"));
  pages.dashboard.classList.add("active");

  const [frese, schede] = await Promise.all([
    getFrese(),
    getSchede()
  ]);

  archivio = frese;
  progArchivio = schede;

  renderArchivio();
  renderProgArchivio();
  renderProgTimeline();
  renderDashboard();
})();

// ===============================
// FIX PAGINE
// ===============================
function showPage(page) {
  Object.values(pages).forEach(p => p.classList.remove("active"));
  pages[page].classList.add("active");

  if (page === "dashboard") renderDashboard();
  if (page === "archivio") renderArchivio();
  if (page === "programmazione") {
    renderProgArchivio();
    renderProgTimeline();
  }
  if (page === "timeline") renderProgTimeline();
}

// Shortcut dashboard
document.querySelectorAll(".shortcut").forEach(btn => {
  btn.addEventListener("click", () => {
    const page = btn.dataset.page;
    viewSelect.value = page;
    showPage(page);
  });
});
