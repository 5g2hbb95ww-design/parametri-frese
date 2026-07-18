// CAMBIO PAGINA IN BASE AL MENU A TENDINA
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

// RIFERIMENTI CAMPI
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

// SUPPORTO NUMERICO
function num(v) {
  const n = parseFloat(v);
  return isNaN(n) ? 0 : n;
}

// 1) M/min da S e Diametro: vc = π * D * n / 1000
function aggiornaMminDaS() {
  const D = num(diametro.value);
  const N = num(s.value);
  if (D > 0 && N > 0) {
    const vc = Math.PI * D * N / 1000;
    mmin.value = vc.toFixed(1);
  }
}

// 2) S calcolata da M/min e Diametro: n = vc * 1000 / (π * D)
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

// 3) F calcolata (mm/min) da avanzamento (mm/dente), S (giri/min), taglienti: F = fz * z * n
function aggiornaFCalc() {
  const fz = num(avanzamento.value);
  const z = num(taglienti.value);
  const N = num(s.value);
  if (fz > 0 && z > 0 && N > 0) {
    const feed = fz * z * N;
    fCalc.value = feed.toFixed(1);
  } else {
    fCalc.value = "";
  }
}

// EVENTI PER AGGIORNARE I CALCOLI
diametro.addEventListener("input", () => {
  aggiornaMminDaS();
  aggiornaSCalcDaMmin();
});

s.addEventListener("input", () => {
  aggiornaMminDaS();
  aggiornaFCalc();
});

mmin.addEventListener("input", () => {
  aggiornaSCalcDaMmin();
});

taglienti.addEventListener("input", () => {
  aggiornaFCalc();
});

avanzamento.addEventListener("input", () => {
  aggiornaFCalc();
});

// ARCHIVIO IN MEMORIA
const archivio = [];

function renderArchivio() {
  lista.innerHTML = "";
  if (archivio.length === 0) {
    lista.innerHTML = "<p>Nessuna fresa salvata.</p>";
    return;
  }

  archivio.forEach(item => {
    const div = document.createElement("div");
    div.className = "arch-item";

    const title = document.createElement("div");
    title.className = "arch-item-title";
    title.textContent = `${item.denominazione || "Senza nome"} (${item.codiceFresa || "N/A"})`;

    const meta = document.createElement("div");
    meta.className = "arch-item-meta";
    meta.textContent =
      `D=${item.diametro}mm, z=${item.taglienti}, S=${item.s}giri, vc=${item.mmin}m/min, F=${item.fCalc}mm/min`;

    const note = document.createElement("div");
    note.className = "arch-item-meta";
    note.textContent = `Materiale: ${item.materiale || "-"}, Refrigerante: ${item.refrigerante || "-"}`;

    div.appendChild(title);
    div.appendChild(meta);
    div.appendChild(note);

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
    materiale: materiale.value.trim(),
    refrigerante: refrigerante.value.trim(),
    dettagli: dettagli.value.trim()
  };

  archivio.push(item);
  renderArchivio();

  // passa automaticamente ad Archivio
  viewSelect.value = "archivio";
  Object.keys(pages).forEach(key => {
    pages[key].classList.toggle("active", key === "archivio");
  });
});
