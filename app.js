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

// CALCOLO F CALCOLATA
function aggiornaFCalc() {
  const fz = num(avanzamento.value);
  const z = num(taglienti.value);
  const N = num(sCalc.value);

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

// MATERIALI + REFRIGERANTI DINAMICI
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

// ARCHIVIO FRESE
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

// SALVATAGGIO FRESE
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

// POPUP MODIFICA FRESE
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

// ESPORTA CSV FRESE
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


// ===============================
//   PROGRAMMAZIONE / SCHEDA LAVORO
// ===============================

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

const programmazioneArchivio = [];
let editProgIndex = null;

// SALVA SCHEDA LAVORO
btnSalvaProgrammazione.addEventListener("click", () => {
  const scheda = {
    macchina: prog_macchina.value.trim(),
    commessa: prog_commessa.value.trim(),
    disegno: prog_disegno.value.trim(),
    revisione: prog_rev.value.trim(),
    tempo: num(prog_tempo.value),
    operatore: prog_operatore.value.trim(),
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

// RENDER LISTA PROGRAMMAZIONE
function renderProgrammazione() {
  prog_lista.innerHTML = "";

  if (programmazioneArchivio.length === 0) {
    prog_lista.innerHTML = "<p>Nessuna scheda lavoro salvata.</p>";
    return;
  }

  programmazioneArchivio.forEach((item, idx) => {
    const div = document.createElement("div");
    div.className = "arch-item";

    const title = document.createElement("div");
    title.className = "arch-item-title";
    title.textContent = `${item.commessa} — ${item.macchina}`;

    const meta = document.createElement("div");
    meta.className = "arch-item-meta";
    meta.textContent = `Disegno: ${item.disegno} (${item.revisione})`;

    const badge = document.createElement("div");
    badge.className = "badge-stato";

    const progressContainer = document.createElement("div");
    progressContainer.className = "progress-container";

    const progressBar = document.createElement("div");
    progressBar.className = "progress-bar";

    let percent = 0;

    switch (item.stato) {
      case "in_programmazione": percent = 20; badge.classList.add("badge-programmazione"); badge.textContent = "In programmazione"; progressBar.classList.add("progress-programmazione"); break;
      case "in_produzione": percent = 80; badge.classList.add("badge-produzione"); badge.textContent = "In produzione"; progressBar.classList.add("progress-produzione"); break;
      case "sospeso": percent = 0; badge.classList.add("badge-sospeso"); badge.textContent = "Sospeso"; progressBar.classList.add("progress-sospeso"); break;
      case "programmato": percent = 50; badge.classList.add("badge-programmato"); badge.textContent = "Programmato"; progressBar.classList.add("progress-programmato"); break;
      case "finito": percent = 100; badge.classList.add("badge-finito"); badge.textContent = "Programmato e prodotto"; progressBar.classList.add("progress-finito"); break;
    }

    progressBar.style.width = percent + "%";
    progressContainer.appendChild(progressBar);

    const operatore = document.createElement("div");
    operatore.className = "arch-item-meta";
    operatore.textContent = `Operatore CNC: ${item.operatore}`;

    const tempo = document.createElement("div");
    tempo.className = "arch-item-meta";
    tempo.textContent = `Tempo programmazione: ${item.tempo} min`;

    const note = document.createElement("div");
    note.className = "arch-item-meta";
    note.textContent = `Note: ${item.note}`;

    const data = document.createElement("div");
    data.className = "arch-item-meta";
    data.textContent = `Creato il: ${item.timestamp}`;

    const btnMod = document.createElement("button");
    btnMod.textContent = "Modifica";
    btnMod.className = "btn-primary";
    btnMod.style.marginTop = "6px";
    btnMod.addEventListener("click", () => apriPopupProgrammazione(idx));

    div.appendChild(title);
    div.appendChild(meta);
    div.appendChild(badge);
    div.appendChild(progressContainer);
    div.appendChild(operatore);
    div.appendChild(tempo);
    div.appendChild(note);
    div.appendChild(data);
    div.appendChild(btnMod);

    div.addEventListener("click", () => {
      renderTimeline(idx);
      editProgIndex = idx;
});
         prog_lista.appendChild(div);
  });
}

// TIMELINE
function registraTimeline(idx, nuovoStato) {
  programmazioneArchivio[idx].timeline.push({
    stato: nuovoStato,
    data: new Date().toLocaleString()
  });
  renderTimeline(idx);
}

function renderTimeline(idx) {
  const item = programmazioneArchivio[idx];
  prog_timeline.innerHTML = "";

  item.timeline.forEach(entry => {
    const row = document.createElement("div");
    row.className = "timeline-row";

    const badge = document.createElement("span");
    badge.className = "badge-stato";

    switch (entry.stato) {
      case "in_programmazione":
        badge.classList.add("badge-programmazione");
        badge.textContent = "In programmazione";
        break;

      case "in_produzione":
        badge.classList.add("badge-produzione");
        badge.textContent = "In produzione";
        break;

      case "sospeso":
        badge.classList.add("badge-sospeso");
        badge.textContent = "Sospeso";
        break;

      case "programmato":
        badge.classList.add("badge-programmato");
        badge.textContent = "Programmato";
        break;

      case "finito":
        badge.classList.add("badge-finito");
        badge.textContent = "Programmato e prodotto";
        break;
    }

    const text = document.createElement("span");
    text.className = "timeline-text";
    text.textContent = entry.data;

    row.appendChild(badge);
    row.appendChild(text);
    prog_timeline.appendChild(row);
  });
}

// MODAL PROGRAMMAZIONE
const modalEditProg = document.getElementById("modalEditProg");
const edit_prog_macchina = document.getElementById("edit_prog_macchina");
const edit_prog_commessa = document.getElementById("edit_prog_commessa");
const edit_prog_disegno = document.getElementById("edit_prog_disegno");
const edit_prog_rev = document.getElementById("edit_prog_rev");
const edit_prog_tempo = document.getElementById("edit_prog_tempo");
const edit_prog_operatore = document.getElementById("edit_prog_operatore");
const edit_prog_stato = document.getElementById("edit_prog_stato");
const edit_prog_note = document.getElementById("edit_prog_note");
const btnUpdateProg = document.getElementById("btnUpdateProg");
const btnCloseModalProg = document.getElementById("btnCloseModalProg");

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

btnUpdateProg.addEventListener("click", () => {
  if (editProgIndex === null) return;

  const item = programmazioneArchivio[editProgIndex];

  item.macchina = edit_prog_macchina.value.trim();
  item.commessa = edit_prog_commessa.value.trim();
  item.disegno = edit_prog_disegno.value.trim();
  item.revisione = edit_prog_rev.value.trim();
  item.tempo = num(edit_prog_tempo.value);
  item.operatore = edit_prog_operatore.value.trim();
  item.stato = edit_prog_stato.value;
  item.note = edit_prog_note.value.trim();

  registraTimeline(editProgIndex, item.stato);

  renderProgrammazione();
  renderTimeline(editProgIndex);

  modalEditProg.classList.add("hidden");
});

// ESPORTA PDF
btnExportPDF.addEventListener("click", () => {
  const idx = editProgIndex;
  if (idx === null) return;

  const item = programmazioneArchivio[idx];

  let text = "";
  text += `Macchina: ${item.macchina}\n`;
  text += `Commessa: ${item.commessa}\n`;
  text += `Disegno: ${item.disegno}\n`;
  text += `Revisione: ${item.revisione}\n`;
  text += `Tempo programmazione: ${item.tempo} min\n`;
  text += `Operatore: ${item.operatore}\n`;
  text += `Stato: ${item.stato}\n`;
  text += `Note: ${item.note}\n\n`;
  text += `Timeline:\n`;

  item.timeline.forEach(t => {
    text += `- ${t.stato} (${t.data})\n`;
  });

  const blob = new Blob([text], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `scheda_${item.commessa}.txt`;
  a.click();
});
                    
