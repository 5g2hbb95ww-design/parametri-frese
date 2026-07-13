/* ============================
   NAVIGAZIONE PAGINE
============================ */

const paginaNuovo = document.getElementById("pagina-nuovo");
const paginaArchivio = document.getElementById("pagina-archivio");

document.getElementById("btn-nuovo").addEventListener("click", () => {
  paginaNuovo.classList.add("active");
  paginaArchivio.classList.remove("active");
});

document.getElementById("btn-archivio").addEventListener("click", () => {
  paginaArchivio.classList.add("active");
  paginaNuovo.classList.remove("active");
  caricaArchivio();
});

/* ============================
   CALCOLI AUTOMATICI
============================ */

function calcolaS() {
  const D = parseFloat(diametro.value);
  const M = parseFloat(mmin.value);

  if (!D || !M) {
    s_calc.value = "";
    return;
  }

  const S = (M * 1000) / (Math.PI * D);
  s_calc.value = S.toFixed(2);
}

function calcolaF() {
  const Z = parseFloat(ntaglientiinserti.value);
  const S = parseFloat(s_calc.value);
  const AvAd = parseFloat(av_ad.value);

  if (!Z || !S || !AvAd) {
    f_calc.value = "";
    return;
  }

  const F = Z * S * AvAd;
  f_calc.value = F.toFixed(2);
}

diametro.addEventListener("input", calcolaS);
mmin.addEventListener("input", calcolaS);

ntaglientiinserti.addEventListener("input", calcolaF);
av_ad.addEventListener("input", calcolaF);
s_calc.addEventListener("input", calcolaF);

/* ============================
   SALVATAGGIO NUOVA FRESA
============================ */

salva.addEventListener("click", () => {
  const fresa = {
    denominazione: denominazione_fresa.value,
    diametro: diametro.value,
    taglienti: ntaglientiinserti.value,
    s: s.value,
    mmin: mmin.value,
    s_calc: s_calc.value,
    f: f.value,
    av_ad: av_ad.value,
    f_calc: f_calc.value,
    zap: zap.value,
    materiale: materiale.value,
    refrigerante: refrigerante.value,
    codice_fresa: codice_fresa.value,
    codice_inserto: codice_inserto.value,
    dettagli: dettagli.value
  };

  let archivio = JSON.parse(localStorage.getItem("freselist")) || [];
  archivio.push(fresa);
  localStorage.setItem("freselist", JSON.stringify(archivio));

  alert("Fresa salvata!");
});

/* ============================
   ARCHIVIO
============================ */

function caricaArchivio() {
  lista.innerHTML = "";
  const archivio = JSON.parse(localStorage.getItem("freselist")) || [];

  archivio.forEach((fresa, index) => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <h3>${fresa.denominazione}</h3>
      <p>Diametro: ${fresa.diametro}</p>
      <p>Taglienti: ${fresa.taglienti}</p>
      <button onclick="modifica(${index})">✏️ Modifica</button>
      <button onclick="elimina(${index})">🗑️ Elimina</button>
    `;
    lista.appendChild(div);
  });
}

function elimina(i) {
  let archivio = JSON.parse(localStorage.getItem("freselist")) || [];
  archivio.splice(i, 1);
  localStorage.setItem("freselist", JSON.stringify(archivio));
  caricaArchivio();
}

/* ============================
   MODAL DI MODIFICA
============================ */

const modalOverlay = document.getElementById("modal-overlay");
const modalCloseBtn = document.getElementById("modal-close-btn");
const modalSalva = document.getElementById("modal-salva");
const modalAnnulla = document.getElementById("modal-annulla");

let indexInModifica = null;

function modifica(i) {
  const archivio = JSON.parse(localStorage.getItem("freselist")) || [];
  const fresa = archivio[i];
  indexInModifica = i;

  // Carica dati nel modal
  document.getElementById("denominazione").value = fresa.denominazione;
  document.getElementById("diametro").value = fresa.diametro;
  document.getElementById("taglienti").value = fresa.taglienti;
  document.getElementById("s").value = fresa.s;
  document.getElementById("mminuto").value = fresa.mmin;
  document.getElementById("s_calcolata").value = fresa.s_calc;
  document.getElementById("f").value = fresa.f;
  document.getElementById("avad").value = fresa.av_ad;
  document.getElementById("f_calcolata").value = fresa.f_calc;
  document.getElementById("zap").value = fresa.zap;
  document.getElementById("materiale").value = fresa.materiale;
  document.getElementById("refrigerante").value = fresa.refrigerante;

  modalOverlay.style.display = "flex";
}

modalCloseBtn.addEventListener("click", () => {
  modalOverlay.style.display = "none";
});

modalAnnulla.addEventListener("click", () => {
  modalOverlay.style.display = "none";
});

/* ============================
   SALVA MODIFICHE
============================ */

modalSalva.addEventListener("click", () => {
  let archivio = JSON.parse(localStorage.getItem("freselist")) || [];

  archivio[indexInModifica] = {
    denominazione: document.getElementById("denominazione").value,
    diametro: document.getElementById("diametro").value,
    taglienti: document.getElementById("taglienti").value,
    s: document.getElementById("s").value,
    mmin: document.getElementById("mminuto").value,
    s_calc: document.getElementById("s_calcolata").value,
    f: document.getElementById("f").value,
    av_ad: document.getElementById("avad").value,
    f_calc: document.getElementById("f_calcolata").value,
    zap: document.getElementById("zap").value,
    materiale: document.getElementById("materiale").value,
    refrigerante: document.getElementById("refrigerante").value
  };

  localStorage.setItem("freselist", JSON.stringify(archivio));

  modalOverlay.style.display = "none";
  caricaArchivio();
});
