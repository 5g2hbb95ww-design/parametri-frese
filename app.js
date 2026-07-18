// =========================
// CAMBIO PAGINA
// =========================
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

// =========================
// FUNZIONI NUMERICHE
// =========================
function num(v) {
  const n = parseFloat(v);
  return isNaN(n) ? 0 : n;
}

// =========================
// CALCOLI PARAMETRI FRESE
// =========================
function aggiornaMminDaS() {
  const D = num(diametro.value);
  const N = num(s.value);
  mmin.value = D > 0 && N > 0 ? (Math.PI * D * N / 1000).toFixed(1) : "";
}

function aggiornaSCalcDaMmin() {
  const D = num(diametro.value);
  const vc = num(mmin.value);
  sCalc.value = D > 0 && vc > 0 ? Math.round(vc * 1000 / (Math.PI * D)) : "";
}

function aggiornaFCalc() {
  const fz = num(avanzamento.value);
  const z = num(taglienti.value);
  const N = num(sCalc.value);
  fCalc.value = fz > 0 && z > 0 && N > 0 ? (fz * z * N).toFixed(1) : "";
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

// =========================
// RIEMPIMENTO SELECT (OGGETTI TIPO A)
// =========================
function riempiSelect(select, array) {
  select.innerHTML = "";

  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = "—";
  select.appendChild(placeholder);

  array.forEach(v => {
    const opt = document.createElement("option");
    opt.value = v.nome;
    opt.textContent = v.nome;
    select.appendChild(opt);
  });
}

// =========================
// FETCH MATERIALI / MACCHINE / OPERATORI
// =========================
fetch("materials.json")
  .then(r => {
    console.log("FETCH STATUS:", r.status);
    return r.json();
  })
  .then(data => {
    console.log("JSON LETTO:", data);

    riempiSelect(materiale, data.materiali);
    riempiSelect(refrigerante, data.refrigeranti);
    riempiSelect(edit_materiale, data.materiali);
    riempiSelect(edit_refrigerante, data.refrigeranti);

    riempiSelect(prog_macchina, data.macchine);
    riempiSelect(prog_operatore, data.operatori);
    riempiSelect(edit_prog_macchina, data.macchine);
    riempiSelect(edit_prog_operatore, data.operatori);
  })
  .catch(err => console.error("ERRORE FETCH:", err));

// =========================
// ARCHIVIO FRESE
// =========================
const archivio = [];
let editIndex = null;

function ordinaArchivio(criterio, ordine) {
  archivio.sort((a, b) => {
    const valA = a[criterio] || "";
    const valB = b[criterio] || "";
    return typeof valA === "string"
      ? (ordine === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA))
      : (ordine === "asc" ? valA - valB : valB - valA);
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

// =========================
// SALVA FRESE
// =========================
btnSalva.addEventListener("click", () => {
  const item = {
    denominazione: denominazioneFresa.value.trim(),
    diametro: num(diametro.value),
    taglienti: num(taglienti.value),
    s: num(s.value),
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
  pages.nuovo.classList.remove("active");
  pages.archivio.classList.add("active");
});

// =========================
// RENDER ARCHIVIO FRESE
// =========================
function renderArchivio() {
  lista.innerHTML = "";

  if (archivio.length === 0) {
    lista.innerHTML = "Nessuna fresa salvata.";
    return;
  }

  archivio.forEach((item, idx) => {
    const div = document.createElement("div");
    div.className = "arch-item";

    div.innerHTML = `
      <div class="arch-item-title">${item.denominazione} (${item.codiceFresa})</div>
      <div class="arch-item-meta">D=${item.diametro}mm, z=${item.taglienti}, S=${item.sCalc}, vc=${item.mmin}, F=${item.fCalc}</div>
      <div class="arch-item-meta">Materiale: ${item.materiale}, Refrigerante: ${item.refrigerante}</div>
    `;

    const btnMod = document.createElement("button");
    btnMod.textContent = "Modifica";
    btnMod.className = "btn-primary";
    btnMod.addEventListener("click", () => apriPopup(idx));

    div.appendChild(btnMod);
    lista.appendChild(div);
  });
}

// =========================
// POPUP MODIFICA FRESE
// =========================
function apriPopup(index) {
  editIndex = index;
  const item = archivio[index];

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

  const fz = item.avanzamento;
  const z = item.taglienti;
  const N = item.sCalc;
  item.fCalc = fz > 0 && z > 0 && N > 0 ? (fz * z * N).toFixed(1) : "";

  ordinaArchivio(sortSelect.value, orderSelect.value);
  renderArchivio();
  modalEdit.classList.add("hidden");
});

// =========================
// ESPORTA CSV
// =========================
btnExport.addEventListener("click", () => {
  if (archivio.length === 0) return;

  let csv = "Denominazione;Diametro;Taglienti;S;Vc;S_calc;F_calc;Materiale;Refrigerante;Dettagli\n";

  archivio.forEach(item => {
    csv += `${item.denominazione};${item.diametro};${item.taglienti};${item.s};${item.mmin};${item.sCalc};${item.fCalc};${item.materiale};${item.refrigerante};${item.dettagli}\n`;
  });

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "parametri_frese.csv";
  a.click();
});

// =========================
// PROGRAMMAZIONE
// =========================
const programmazioneArchivio = [];
let editProgIndex = null;

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
    timestamp: new Date().toLocaleString(),
    timeline: [
      { stato: prog_stato.value, data: new Date().toLocaleString() }
    ]
  };

  programmazioneArchivio.push(scheda);
  renderProgrammazione();
  renderTimeline(programmazioneArchivio.length - 1);
});

// =========================
// RENDER PROGRAMMAZIONE
// =========================
function renderProgrammazione() {
  prog_lista.innerHTML = "";

  if (programmazioneArchivio.length === 0) {
    prog_lista.innerHTML = "Nessuna scheda lavoro salvata.";
    return;
  }

  programmazioneArchivio.forEach((item, idx) => {
    const div = document.createElement("div");
    div.className = "arch-item";

    div.innerHTML = `
      <div class="arch-item-title">${item.commessa} — ${item.macchina}</div>
      <div class="arch-item-meta">Disegno: ${item.disegno} (${item.revisione})</div>
      <div class="arch-item-meta">Operatore: ${item.operatore}</div>
      <div class="arch-item-meta">Tempo: ${item.tempo} min</div>
      <div class="arch-item-meta">Stato: ${item.stato}</div>
      <div class="arch-item-meta">Note: ${item.note}</div>
      <div class="arch-item-meta">Creato il: ${item.timestamp}</div>
    `;

    const btnMod = document.createElement("button");
    btnMod.textContent = "Modifica";
    btnMod.className = "btn-primary";
    btnMod.addEventListener("click", () => apriPopupProgrammazione(idx));

    div.appendChild(btnMod);

    div.addEventListener("click", () => {
      renderTimeline(idx);
      editProgIndex = idx;
    });

    prog_lista.appendChild(div);
  });
}

// =========================
// TIMELINE
// =========================
function renderTimeline(idx) {
  const item = programmazioneArchivio[idx];
  prog_timeline.innerHTML = "";

  item.timeline.forEach(entry => {
    const row = document.createElement("div");
    row.className = "timeline-row";

    const badge = document.createElement("span");
    badge.className = "badge-stato";
    badge.textContent = entry.stato;

    const text = document.createElement("span");
    text.className = "timeline-text";
    text.textContent = entry.data;

    row.appendChild(badge);
    row.appendChild(text);
    prog_timeline.appendChild(row);
  });
}

// =========================
// POPUP MODIFICA PROGRAMMAZIONE
// =========================
function apriPopupProgrammazione(index) {
  editProgIndex = index;
  const item = programmazioneArchivio[index];

  edit_prog_macchina.value = item.macchina;
  edit_prog_commessa.value = item.commessa;
  edit_prog_disegno.value = item.disegno;
  edit_prog_rev.value = item.revisione;
  edit_prog_tempo.value = item.tempo;
  edit_prog_operatore.value = item.operatore;
  edit_prog_stato.value = item.stato;
  edit_prog_note.value = item.note;

  modalEditProg.classList.remove("hidden");
}

btnCloseModalProg.addEventListener("click", () => {
  modalEditProg.classList.add("hidden");
});

// =========================
// SALVA MODIFICHE PROGRAMMAZIONE
// =========================
btnUpdateProg.addEventListener("click", () => {
  if (editProgIndex === null) return;

  const item = programmazioneArchivio[editProgIndex];

  item.macchina = edit_prog_macchina.value;
  item.commessa = edit_prog_commessa.value.trim();
  item.disegno = edit_prog_disegno.value.trim();
  item.revisione = edit_prog_rev.value.trim();
  item.tempo = num(edit_prog_tempo.value);
  item.operatore = edit_prog_operatore.value;
  item.stato = edit_prog_stato.value;
  item.note = edit_prog_note.value.trim();

  item.timeline.push({
    stato: item.stato,
    data: new Date().toLocaleString()
  });

  renderProgrammazione();
  renderTimeline(editProgIndex);

  modalEditProg.classList.add("hidden");
});

// =========================
// ESPORTA PDF
// =========================
btnExportPDF.addEventListener("click", () => {
  const idx = editProgIndex;
  if (idx === null) return;

  const item = programmazioneArchivio[idx];

  const content = `
Macchina: ${item.macchina}
Commessa: ${item.commessa}
Disegno: ${item.disegno}
Revisione: ${item.revisione}
Tempo programmazione: ${item.tempo} min
Operatore: ${item.operatore}
Stato: ${item.stato}
Note: ${item.note}

Timeline:
${item.timeline.map(t => `- ${t.stato} (${t.data})`).join("\n")}
`;

  const blob = new Blob([content], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `scheda_${item.commessa}.pdf`;
  a.click();
});

// =========================
// SERVICE WORKER
// =========================
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js");
  });
}
