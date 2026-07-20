// =============================
// APP PRINCIPALE
// =============================

// Ripristina tema salvato
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "light") {
  document.body.classList.add("light");
}

// =========================
// REGISTRAZIONE SERVICE WORKER
// =========================
if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("service-worker.js");
}

// =========================
// ICONE TEMA (SOLE / LUNA)
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

// =============================
// TEMA CHIARO/SCURO
// =============================
btnTheme.addEventListener("click", () => {
  document.body.classList.toggle("light");

  const isLight = document.body.classList.contains("light");
  localStorage.setItem("theme", isLight ? "light" : "dark");

  themeIcon.innerHTML = isLight ? iconSun : iconMoon;
});

// Utility
const num = (v) => Number(v) || 0;

// =============================
// PAGINA NUOVO
// =============================
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

// =============================
// DASHBOARD
// =============================
const dash_tot_schede = document.getElementById("dash_tot_schede");
const dash_in_prog = document.getElementById("dash_in_prog");
const dash_programmato = document.getElementById("dash_programmato");
const dash_produzione = document.getElementById("dash_produzione");
const dash_sospeso = document.getElementById("dash_sospeso");
const dash_finito = document.getElementById("dash_finito");

const dash_recent_schede = document.getElementById("dash_recent_schede");
const dash_recent_frese = document.getElementById("dash_recent_frese");

function renderDashboard() {

  dash_tot_schede.textContent = progArchivio.length;

  dash_in_prog.textContent = progArchivio.filter(x => x.stato === "in_programmazione").length;
  dash_programmato.textContent = progArchivio.filter(x => x.stato === "programmato").length;
  dash_produzione.textContent = progArchivio.filter(x => x.stato === "in_produzione").length;
  dash_sospeso.textContent = progArchivio.filter(x => x.stato === "sospeso").length;
  dash_finito.textContent = progArchivio.filter(x => x.stato === "finito").length;

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

// =============================
// POPOLA LISTE
// =============================
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

// =============================
// TOAST
// =============================
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

// =============================
// CALCOLI PAGINA NUOVO
// =============================
diam.addEventListener("input", calcolaS);
mmin.addEventListener("input", calcolaS);

function calcolaS() {
  const D = num(diam.value);
  const M = num(mmin.value);
  if (D > 0 && M > 0) {
    s_calc.value = Math.round((1000 * M) / (Math.PI * D));
  } else {
    s_calc.value = "";
  }
}

tagl.addEventListener("input", calcolaF);
avanzamento.addEventListener("input", calcolaF);
s_calc.addEventListener("input", calcolaF);
f.addEventListener("input", calcolaF);

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

// =============================
// CAMBIO PAGINA
// =============================
const pages = {
  dashboard: document.getElementById("page-dashboard"),
  nuovo: document.getElementById("page-nuovo"),
  archivio: document.getElementById("page-archivio"),
  programmazione: document.getElementById("page-programmazione"),
  timeline: document.getElementById("page-timeline")
};

document.getElementById("viewSelect").addEventListener("change", (e) => {
  Object.values(pages).forEach(p => p.classList.remove("active"));
  pages[e.target.value].classList.add("active");

  if (e.target.value === "dashboard") {
    renderDashboard();
  }
});

// =============================
// ARCHIVIO FRESE
// =============================
let archivio = [];

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

document.getElementById("btnSalva").addEventListener("click", () => {
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

  archivio.push(item);
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
      <div class="arch-item-meta">Ø ${item.diametro} — ${item.materialale}</div>
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
    btnDel.addEventListener("click", () => {
      archivio.splice(idx, 1);
      renderArchivio();
      showToast("Fresa eliminata ✔");
    });

    div.appendChild(btnMod);
    div.appendChild(btnDel);
    lista.appendChild(div);
  });
}

// =============================
// MODAL FRESE
// =============================
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
}

btnCloseModal.addEventListener("click", () => {
  modalEdit.classList.add("hidden");
});

document.getElementById("btnUpdate").addEventListener("click", () => {
  const item = archivio[editIndex];

  item.denominazione = edit_denominazione.value.trim();
  item.diametro = num(edit_diametro.value);
  item.taglienti = num(edit_taglienti.value);
  item.s = num(edit_s.value);
  item.avanzamento = num(edit_avanzamento.value);
  item.materiale = edit_materiale.value;
  item.refrigerante = edit_refrigerante.value;
  item.dettagli = edit_dettagli.value.trim();

  renderArchivio();
  modalEdit.classList.add("hidden");
  showToast("Fresa aggiornata ✔");
});

// =============================
// PROGRAMMAZIONE
// =============================
let progArchivio = [];

const prog_lista = document.getElementById("prog_lista");
const prog_progress = document.getElementById("prog_progress");
const prog_timeline = document.getElementById("prog_timeline");
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

document.getElementById("btnSalvaProgrammazione").addEventListener("click", () => {
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

  progArchivio.push(item);
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
    btnDel.addEventListener("click", () => {
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
    pf.style.width = item.stato === "finito" ? "100%" :
                     item.stato === "in_produzione" ? "70%" :
                     item.stato === "programmato" ? "40%" :
                     "10%";

    pb.appendChild(pf);
    prog_progress.appendChild(pb);
  });
}

// =============================
// MODAL PROGRAMMAZIONE
// =============================
const modalProgEdit = document.getElementById("modalProgEdit");
const btnProgClose = document.getElementById("btnProgClose");
const btnProgUpdate = document.getElementById("btnProgUpdate");
let progEditIndex = null;

const edit_prog_macchina = document.getElementById("edit_prog_macchina");
const edit_prog_commessa = document.getElementById("edit_prog_commessa");
const edit_prog_disegno = document.getElementById("edit_prog_disegno");
const edit_prog_rev = document.getElementById("edit_prog_rev");
const edit_prog_data = document.getElementById("edit_prog_data");
const edit_prog_tempo = document.getElementById("edit_prog_tempo");
const edit_prog_operatore = document.getElementById("edit_prog_operatore");
const edit_prog_stato = document.getElementById("edit_prog_stato");
const edit_prog_note = document.getElementById("edit_prog_note");

function popolaListeModalProgrammazione() {
  edit_prog_macchina.innerHTML = `
    <option>Duravertical 3Ax (45)</option>
    <option>Duravertical 3Ax (46)</option>
    <option>NVX 5060 (58)</option>
    <option>Okuma (59)</option>
    <option>DMF-200/7 (57)</option>
    <option>DMU 65 5Axis (89)</option>
    <option>DMU 75 5Axis (90)</option>
  `;

  edit_prog_operatore.innerHTML = `
    <option>Marco T.</option>
    <option>Nicola B.</option>
    <option>Roberto Q.</option>
    <option>Daniel D.</option>
    <option>Igor B.</option>
    <option>Altri</option>
  `;
}

popolaListeModalProgrammazione();

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
  edit_prog_note.value = item.note;

  modalProgEdit.classList.remove("hidden");
}

btnProgClose.addEventListener("click", () => {
  modalProgEdit.classList.add("hidden");
});

// =============================
// AGGIORNA SCHEDA PROGRAMMAZIONE
// =============================
btnProgUpdate.addEventListener("click", () => {
  const item = progArchivio[progEditIndex];

  item.macchina = edit_prog_macchina.value;
  item.commessa = edit_prog_commessa.value.trim();
  item.disegno = edit_prog_disegno.value.trim();
  item.revisione = edit_prog_rev.value.trim();
  item.dataProgramma = edit_prog_data.value;
  item.tempo = num(edit_prog_tempo.value);
  item.operatore = edit_prog_operatore.value;

  if (item.stato !== edit_prog_stato.value) {
    item.history.push({
      stato: edit_prog_stato.value,
      timestamp: new Date().toLocaleString()
    });
  }

  item.stato = edit_prog_stato.value;
  item.note = edit_prog_note.value.trim();

  renderProgArchivio();
  renderProgTimeline();

  modalProgEdit.classList.add("hidden");
  showToast("Scheda aggiornata ✔");
});

// =============================
// TIMELINE
// =============================
function renderProgTimeline() {
  prog_timeline.innerHTML = "";

  progArchivio.forEach(item => {

    const div = document.createElement("div");
    div.className = "timeline-item";

    const line = document.createElement("div");
    line.className = "timeline-line";

    const dot = document.createElement("div");
    dot.className = `timeline-dot dot-${item.stato}`;

    div.innerHTML = `
      <div class="timeline-title">${item.commessa}</div>
      <div class="timeline-meta"><strong>Stato attuale:</strong> ${item.stato.replace("_"," ")}</div>
      <div class="timeline-meta">
        <strong>Storico:</strong><br>
        ${item.history.map(h => `${h.timestamp} → ${h.stato.replace("_"," ")}`).join("<br>")}
      </div>
    `;

    div.appendChild(line);
    div.appendChild(dot);
    prog_timeline.appendChild(div);
  });
}

// =============================
// EXPORT PDF
// =============================
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
        <div class="row"><span class="label">Note:</span> ${item.note || "-"}</div>
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

// =============================
// MENU LATERALE VISIONOS
// =============================
const sideMenu = document.getElementById("sideMenu");
const menuButton = document.getElementById("menuButton");

menuButton.addEventListener("click", () => {
  haptic();
  sideMenu.classList.toggle("show");
});

// CLICK SU VOCI MENU
document.querySelectorAll(".side-menu-item").forEach(item => {
  item.addEventListener("click", () => {
    haptic();
    const page = item.dataset.page;
    document.getElementById("viewSelect").value = page;
    document.getElementById("viewSelect").dispatchEvent(new Event("change"));
    sideMenu.classList.remove("show");
  });
});

// =============================
// SHORTCUTS DASHBOARD
// =============================
document.querySelectorAll(".shortcut").forEach(btn => {
  btn.addEventListener("click", () => {
    haptic();
    const page = btn.dataset.page;
    document.getElementById("viewSelect").value = page;
    document.getElementById("viewSelect").dispatchEvent(new Event("change"));
  });
});

// =============================
// HAPTIC FEEDBACK iPhone
// =============================
function haptic() {
  if (navigator.vibrate) {
    navigator.vibrate(10);
  }
}


                                                  
