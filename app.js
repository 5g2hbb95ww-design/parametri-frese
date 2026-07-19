// =============================
// APP PRINCIPALE
// =============================

// Utility
const num = (v) => Number(v) || 0;

// Toast (FIX: ora funziona sempre)
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
// CAMBIO PAGINA
// =============================
const pages = {
  nuovo: document.getElementById("page-nuovo"),
  archivio: document.getElementById("page-archivio"),
  programmazione: document.getElementById("page-programmazione")
};

document.getElementById("viewSelect").addEventListener("change", (e) => {
  Object.values(pages).forEach(p => p.classList.remove("active"));
  pages[e.target.value].classList.add("active");
});

// =============================
// TEMA CHIARO/SCURO
// =============================
document.getElementById("btnTheme").addEventListener("click", () => {
  document.body.classList.toggle("light");
});

// =============================
// ARCHIVIO FRESE
// =============================
let archivio = [];

const lista = document.getElementById("lista");
const sortSelect = document.getElementById("sortSelect");
const orderSelect = document.getElementById("orderSelect");

// Salvataggio fresa
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
});

// Render archivio frese
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

    // Bottone Modifica
    const btnMod = document.createElement("button");
    btnMod.textContent = "Modifica";
    btnMod.className = "btn-primary";
    btnMod.style.marginTop = "6px";
    btnMod.addEventListener("click", () => apriPopup(idx));

    // ⭐ NUOVO: Bottone Elimina
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

// Salva scheda programmazione
document.getElementById("btnSalvaProgrammazione").addEventListener("click", () => {
  const item = {
    macchina: prog_macchina.value,
    commessa: prog_commessa.value.trim(),
    disegno: prog_disegno.value.trim(),
    revisione: prog_rev.value.trim(),
    tempo: num(prog_tempo.value),
    operatore: prog_operatore.value,
    stato: prog_stato.value,
    note: prog_note.value.trim()
  };

  progArchivio.push(item);
  renderProgArchivio();
  renderProgTimeline();
  showToast("Scheda salvata ✔");
});

// Render archivio programmazione
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
    `;

    // Bottone Modifica (modal nuovo)
    const btnMod = document.createElement("button");
    btnMod.textContent = "Modifica";
    btnMod.className = "btn-primary";
    btnMod.style.marginTop = "6px";
    btnMod.addEventListener("click", () => apriProgPopup(idx));

    // ⭐ NUOVO: Bottone Elimina
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

    // Progress bar
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
// MODAL PROGRAMMAZIONE (NUOVO)
// =============================
const modalProgEdit = document.getElementById("modalProgEdit");
const btnProgClose = document.getElementById("btnProgClose");
const btnProgUpdate = document.getElementById("btnProgUpdate");

let progEditIndex = null;

function apriProgPopup(idx) {
  progEditIndex = idx;
  const item = progArchivio[idx];

  edit_prog_macchina.value = item.macchina;
  edit_prog_commessa.value = item.commessa;
  edit_prog_disegno.value = item.disegno;
  edit_prog_rev.value = item.revisione;
  edit_prog_tempo.value = item.tempo;
  edit_prog_operatore.value = item.operatore;
  edit_prog_stato.value = item.stato;
  edit_prog_note.value = item.note;

  modalProgEdit.classList.remove("hidden");
}

btnProgClose.addEventListener("click", () => {
  modalProgEdit.classList.add("hidden");
});

btnProgUpdate.addEventListener("click", () => {
  const item = progArchivio[progEditIndex];

  item.macchina = edit_prog_macchina.value;
  item.commessa = edit_prog_commessa.value.trim();
  item.disegno = edit_prog_disegno.value.trim();
  item.revisione = edit_prog_rev.value.trim();
  item.tempo = num(edit_prog_tempo.value);
  item.operatore = edit_prog_operatore.value;
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
    div.className = "arch-item";
    div.innerHTML = `
      <div class="arch-item-title">${item.commessa}</div>
      <div class="arch-item-meta">${item.stato}</div>
    `;
    prog_timeline.appendChild(div);
  });
}

// =============================
// EXPORT TXT
// =============================
document.getElementById("btnExportPDF").addEventListener("click", () => {
  let txt = "";
  progArchivio.forEach(item => {
    txt += `Commessa: ${item.commessa}\nMacchina: ${item.macchina}\nStato: ${item.stato}\n\n`;
  });

  const blob = new Blob([txt], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "schede.txt";
  a.click();

  URL.revokeObjectURL(url);
});
