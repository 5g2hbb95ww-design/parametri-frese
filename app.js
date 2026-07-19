// CAMBIO PAGINA
const viewSelect = document.getElementById("viewSelect");
const pages = {
  nuovo: document.getElementById("page-nuovo"),
  archivio: document.getElementById("page-archivio"),
  programmazione: document.getElementById("page-programmazione")
};

viewSelect.addEventListener("change", () => {
  const v = viewSelect.value;
  Object.keys(pages).forEach(key => {
    pages[key].classList.toggle("active", key === v);
  });
});

// CAMPI PRINCIPALI
const denominazioneFresa = document.getElementById("denominazione_fresa");
const diametro = document.getElementById("diametro");
const taglienti = document.getElementById("taglienti");

const s = document.getElementById("s");
const f = document.getElementById("f");
const mmin = document.getElementById("mmin");
const sCalc = document.getElementById("s_calc");
const avanzamento = document.getElementById("avanzamento");
const fCalc = document.getElementById("f_calc");

const zap = document.getElementById("zap");
const xyae = document.getElementById("xyae");

const codiceFresa = document.getElementById("codice_fresa");
const codiceInserto = document.getElementById("codice_inserto");

const materiale = document.getElementById("materiale");
const refrigerante = document.getElementById("refrigerante");
const dettagli = document.getElementById("dettagli");

const btnSalva = document.getElementById("btnSalva");
const lista = document.getElementById("lista");
const btnExport = document.getElementById("btnExport");

// ORDINAMENTO
const sortSelect = document.getElementById("sortSelect");
const orderSelect = document.getElementById("orderSelect");

// MODAL EDIT
const modalEdit = document.getElementById("modalEdit");
const edit_denominazione = document.getElementById("edit_denominazione");
const edit_diametro = document.getElementById("edit_diametro");
const edit_taglienti = document.getElementById("edit_taglienti");
const edit_s = document.getElementById("edit_s");
const edit_avanzamento = document.getElementById("edit_avanzamento");
const edit_materiale = document.getElementById("edit_materiale");
const edit_refrigerante = document.getElementById("edit_refrigerante");
const edit_dettagli = document.getElementById("edit_dettagli");
const btnUpdate = document.getElementById("btnUpdate");
const btnCloseModal = document.getElementById("btnCloseModal");

// SUPPORTO NUMERICO
function num(v) {
  const n = parseFloat(v);
  return isNaN(n) ? 0 : n;
}

// CALCOLO M/min DA S
function aggiornaMminDaS() {
  const D = num(diametro.value);
  const N = num(s.value);
  if (D > 0 && N > 0) {
    const vc = Math.PI * D * N / 1000;
    mmin.value = vc.toFixed(1);
  } else {
    mmin.value = "";
  }
}

// CALCOLO S CALCOLATA DA M/min
function aggiornaSCalcDaMmin() {
  const D = num(diametro.value);
  const vc = num(mmin.value);
  if (D > 0 && vc > 0) {
    const N = vc * 1000 / (Math.PI * D);
    sCalc.value = Math.round(N);
  } else {
    sCalc.value = "";
  }
}

// CALCOLO F CALCOLATA (VERSIONE CORRETTA)
function aggiornaFCalc() {
  const fz = num(avanzamento.value);      // mm/dente
  const z = num(taglienti.value);         // numero taglienti
  const N = num(sCalc.value);             // S calcolata

  if (fz > 0 && z > 0 && N > 0) {
    fCalc.value = (fz * z * N).toFixed(1);
  } else {
    fCalc.value = "";
  }
}

// EVENTI CALCOLI
diametro.addEventListener("input", () => {
  aggiornaMminDaS();
  aggiornaSCalcDaMmin();
  aggiornaFCalc();
});

mmin.addEventListener("input", () => {
  aggiornaSCalcDaMmin();
  aggiornaFCalc();
});

avanzamento.addEventListener("input", aggiornaFCalc);
taglienti.addEventListener("input", aggiornaFCalc);
sCalc.addEventListener("input", aggiornaFCalc);

// MATERIALI + REFRIGERANTI DINAMICI (OGGETTI)
let MATERIALI = [];
let REFRIGERANTI = [];

fetch("materials.json")
  .then(r => r.json())
  .then(data => {
    MATERIALI = data.materiali || [];
    REFRIGERANTI = data.refrigeranti || [];

    riempiSelect(materiale, MATERIALI);
    riempiSelect(refrigerante, REFRIGERANTI);
    riempiSelect(edit_materiale, MATERIALI);
    riempiSelect(edit_refrigerante, REFRIGERANTI);
  })
  .catch(err => {
    console.error("Errore nel caricamento di materials.json:", err);
  });

// VERSIONE COMPATIBILE CON OGGETTI
function riempiSelect(select, array) {
  select.innerHTML = "<option value=''>—</option>";

  array.forEach(v => {
    const opt = document.createElement("option");

    if (typeof v === "object") {
      opt.value = v.nome;
      opt.textContent = v.nome;
    } else {
      opt.value = v;
      opt.textContent = v;
    }

    select.appendChild(opt);
  });
}

// ARCHIVIO
const archivio = [];
let editIndex = null;

function ordinaArchivio(criterio, ordine) {
  archivio.sort((a, b) => {
    let valA = a[criterio] || "";
    let valB = b[criterio] || "";

    if (typeof valA === "string") {
      return ordine === "asc"
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    }

    return ordine === "asc"
      ? valA - valB
      : valB - valA;
  });
}

sortSelect.addEventListener("change", () => {
  ordinaArchivio(sortSelect.value, orderSelect.value);
  renderArchivio();
});

orderSelect.addEventListener("change", () => {
  ordinaArchivio(sortSelect.value, orderSelect.value);
  renderArchivio();
});

function renderArchivio() {
  lista.innerHTML = "";
  if (archivio.length === 0) {
    lista.innerHTML = "<p>Nessuna fresa salvata.</p>";
    return;
  }

  archivio.forEach((item, idx) => {
    const div = document.createElement("div");
    div.className = "arch-item";

    const title = document.createElement("div");
    title.className = "arch-item-title";
    title.textContent = `${item.denominazione || "Senza nome"} (${item.codiceFresa || "N/A"})`;

    const meta = document.createElement("div");
    meta.className = "arch-item-meta";
    meta.textContent =
      `D=${item.diametro}mm, z=${item.taglienti}, S=${item.sCalc}, vc=${item.mmin}, F=${item.fCalc}`;

    const note = document.createElement("div");
    note.className = "arch-item-meta";
    note.textContent = `Materiale: ${item.materiale || "-"}, Refrigerante: ${item.refrigerante || "-"}`;

    const btnMod = document.createElement("button");
    btnMod.textContent = "Modifica";
    btnMod.className = "btn-primary";
    btnMod.style.marginTop = "6px";
    btnMod.addEventListener("click", () => apriPopup(idx));

    div.appendChild(title);
    div.appendChild(meta);
    div.appendChild(note);
    div.appendChild(btnMod);

    lista.appendChild(div);
  });
}

// SALVATAGGIO
btnSalva.addEventListener("click", () => {
  const item = {
    denominazione: denominazioneFresa.value.trim(),
    diametro: num(diametro.value),
    taglienti: num(taglienti.value),
    s: num(s.value),
    f: num(f.value),
    mmin: num(mmin.value),
    sCalc: num(sCalc.value),
    avanzamento: num(avanzamento.value),
    fCalc: num(fCalc.value),
    zap: num(zap.value),
    xyae: num(xyae.value),
    codiceFresa: codiceFresa.value.trim(),
    codiceInserto: codiceInserto.value.trim(),
    materiale: materiale.value,
    refrigerante: refrigerante.value,
    dettagli: dettagli.value.trim()
  };

  archivio.push(item);

  ordinaArchivio(sortSelect.value, orderSelect.value);
  renderArchivio();

  viewSelect.value = "archivio";
  Object.keys(pages).forEach(key => {
    pages[key].classList.toggle("active", key === "archivio");
  });
});

// POPUP MODIFICA
function apriPopup(index) {
  editIndex = index;
  const item = archivio[index];

  edit_denominazione.value = item.denominazione || "";
  edit_diametro.value = item.diametro || "";
  edit_taglienti.value = item.taglienti || "";
  edit_s.value = item.s || "";
  edit_avanzamento.value = item.avanzamento || "";
  edit_materiale.value = item.materiale || "";
  edit_refrigerante.value = item.refrigerante || "";
  edit_dettagli.value = item.dettagli || "";

  modalEdit.classList.remove("hidden");
}

btnCloseModal.addEventListener("click", () => {
  modalEdit.classList.add("hidden");
});

btnUpdate.addEventListener("click", () => {
  if (editIndex === null) return;
  const item = archivio[editIndex];

  item.denominazione = edit_denominazione.value.trim();
  item.diametro = num(edit_diametro.value);
  item.taglienti = num(edit_taglienti.value);
  item.s = num(edit_s.value);
  item.avanzamento = num(edit_avanzamento.value);
  item.materiale = edit_materiale.value;
  item.refrigerante = edit_refrigerante.value;
  item.dettagli = edit_dettagli.value.trim();

  // RICALCOLO F CALCOLATA CORRETTO
  const fz = item.avanzamento;
  const z = item.taglienti;
  const N = item.sCalc;

  if (fz > 0 && z > 0 && N > 0) {
    item.fCalc = (fz * z * N).toFixed(1);
  } else {
    item.fCalc = "";
  }

  ordinaArchivio(sortSelect.value, orderSelect.value);
  renderArchivio();
  modalEdit.classList.add("hidden");
});

// ESPORTA CSV
btnExport.addEventListener("click", () => {
  if (archivio.length === 0) return;

  let csv = "Denominazione;Diametro;Taglienti;S;M/min;S_calcolata;F_calcolata;Materiale;Refrigerante;Dettagli\n";

  archivio.forEach(item => {
    csv += `${item.denominazione};${item.diametro};${item.taglienti};${item.s};${item.mmin};${item.sCalc};${item.fCalc};${item.materiale};${item.refrigerante};${item.dettagli}\n`;
  });

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "parametri-frese.csv";
  a.click();
});

/* ============================================================
   PAGINA PROGRAMMAZIONE — LOGICA COMPLETA
   ============================================================ */

// CAMPI PROGRAMMAZIONE
const prog_macchina = document.getElementById("prog_macchina");
const prog_commessa = document.getElementById("prog_commessa");
const prog_disegno = document.getElementById("prog_disegno");
const prog_rev = document.getElementById("prog_rev");
const prog_tempo = document.getElementById("prog_tempo");
const prog_operatore = document.getElementById("prog_operatore");
const prog_stato = document.getElementById("prog_stato");
const prog_note = document.getElementById("prog_note");

const btnSalvaProgrammazione = document.getElementById("btnSalvaProgrammazione");
const prog_lista = document.getElementById("prog_lista");
const prog_timeline = document.getElementById("prog_timeline");
const btnExportPDF = document.getElementById("btnExportPDF");

// ARCHIVIO PROGRAMMAZIONE
const progArchivio = [];

// SALVA SCHEDA
btnSalvaProgrammazione.addEventListener("click", () => {

  const scheda = {
    macchina: prog_macchina.value,
    commessa: prog_commessa.value.trim(),
    disegno: prog_disegno.value.trim(),
    revisione: prog_rev.value.trim(),
    tempo: num(prog_tempo.value),
    operatore: prog_operatore.value,
    stato: prog_stato.value,
    note: prog_note.value.trim(),
    data: new Date().toLocaleString()
  };

  progArchivio.push(scheda);

  renderProgArchivio();
  renderProgTimeline();

  // torna all’archivio programmazione
  viewSelect.value = "programmazione";
  Object.keys(pages).forEach(key => {
    pages[key].classList.toggle("active", key === "programmazione");
  });
});

// RENDER ARCHIVIO
function renderProgArchivio() {
  prog_lista.innerHTML = "";

  if (progArchivio.length === 0) {
    prog_lista.innerHTML = "<p>Nessuna scheda salvata.</p>";
    return;
  }

  progArchivio.forEach((item, idx) => {
    const div = document.createElement("div");
    div.className = "arch-item";

    const title = document.createElement("div");
    title.className = "arch-item-title";
    title.textContent = `${item.macchina} — ${item.commessa}`;

    const meta = document.createElement("div");
    meta.className = "arch-item-meta";
    meta.textContent =
      `Disegno: ${item.disegno} | Rev: ${item.revisione} | Tempo: ${item.tempo} min | Operatore: ${item.operatore}`;

    const stato = document.createElement("div");
    stato.className = "arch-item-meta";
    stato.textContent = `Stato: ${item.stato}`;

    const note = document.createElement("div");
    note.className = "arch-item-meta";
    note.textContent = `Note: ${item.note || "-"}`;

    div.appendChild(title);
    div.appendChild(meta);
    div.appendChild(stato);
    div.appendChild(note);

    prog_lista.appendChild(div);
  });
}

// RENDER TIMELINE
function renderProgTimeline() {
  prog_timeline.innerHTML = "";

  if (progArchivio.length === 0) {
    prog_timeline.innerHTML = "<p>Nessuna attività registrata.</p>";
    return;
  }

  progArchivio.forEach(item => {
    const div = document.createElement("div");
    div.className = "arch-item";

    const title = document.createElement("div");
    title.className = "arch-item-title";
    title.textContent = `${item.macchina} — ${item.stato}`;

    const meta = document.createElement("div");
    meta.className = "arch-item-meta";
    meta.textContent = `${item.data}`;

    div.appendChild(title);
    div.appendChild(meta);

    prog_timeline.appendChild(div);
  });
}

// ESPORTA TXT
btnExportPDF.addEventListener("click", () => {
  if (progArchivio.length === 0) return;

  let txt = "ARCHIVIO PROGRAMMAZIONE\n\n";

  progArchivio.forEach(item => {
    txt +=
      `Macchina: ${item.macchina}\n` +
      `Commessa: ${item.commessa}\n` +
      `Disegno: ${item.disegno}\n` +
      `Revisione: ${item.revisione}\n` +
      `Tempo: ${item.tempo} min\n` +
      `Operatore: ${item.operatore}\n` +
      `Stato: ${item.stato}\n` +
      `Note: ${item.note}\n` +
      `Data: ${item.data}\n\n`;
  });

  const blob = new Blob([txt], { type: "text/plain;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "programmazione.txt";
  a.click();
});

// TEMA CHIARO/SCURO
const btnTheme = document.getElementById("btnTheme");

btnTheme.addEventListener("click", () => {
  document.body.classList.toggle("light");

  // Cambia icona
  if (document.body.classList.contains("light")) {
    btnTheme.textContent = "☀️";
  } else {
    btnTheme.textContent = "🌙";
  }
});
