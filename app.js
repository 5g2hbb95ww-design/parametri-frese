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
   CALCOLI AUTOMATICI (pagina nuovo)
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

  mod_denom.value = fresa.denominazione;
  mod_diametro.value = fresa.diametro;
  mod_taglienti.value = fresa.taglienti;
  mod_s.value = fresa.s;
  mod_mmin.value = fresa.mmin;
  mod_s_calc.value = fresa.s_calc;
  mod_f.value = fresa.f;
  mod_av_ad.value = fresa.av_ad;
  mod_f_calc.value = fresa.f_calc;
  mod_zap.value = fresa.zap;
  mod_materiale.value = fresa.materiale;
  mod_refrigerante.value = fresa.refrigerante;

  modalOverlay.style.display = "flex";
}

modalCloseBtn.addEventListener("click", () => {
  modalOverlay.style.display = "none";
});

modalAnnulla.addEventListener("click", () => {
  modalOverlay.style.display = "none";
});

/* ============================
   CALCOLI AUTOMATICI NEL MODAL
============================ */

function modCalcolaS() {
  const D = parseFloat(mod_diametro.value);
  const M = parseFloat(mod_mmin.value);

  if (!D || !M) {
    mod_s_calc.value = "";
    return;
  }

  const S = (M * 1000) / (Math.PI * D);
  mod_s_calc.value = S.toFixed(2);
}

function modCalcolaF() {
  const Z = parseFloat(mod_taglienti.value);
  const S = parseFloat(mod_s_calc.value);
  const AvAd = parseFloat(mod_av_ad.value);

  if (!Z || !S || !AvAd) {
    mod_f_calc.value = "";
    return;
  }

  const F = Z * S * AvAd;
  mod_f_calc.value = F.toFixed(2);
}

mod_diametro.addEventListener("input", modCalcolaS);
mod_mmin.addEventListener("input", modCalcolaS);

mod_taglienti.addEventListener("input", modCalcolaF);
mod_av_ad.addEventListener("input", modCalcolaF);
mod_s_calc.addEventListener("input", modCalcolaF);

/* ============================
   SALVA MODIFICHE
============================ */

modalSalva.addEventListener("click", () => {
  let archivio = JSON.parse(localStorage.getItem("freselist")) || [];

  archivio[indexInModifica] = {
    denominazione: mod_denom.value,
    diametro: mod_diametro.value,
    taglienti: mod_taglienti.value,
    s: mod_s.value,
    mmin: mod_mmin.value,
    s_calc: mod_s_calc.value,
    f: mod_f.value,
    av_ad: mod_av_ad.value,
    f_calc: mod_f_calc.value,
    zap: mod_zap.value,
    materiale: mod_materiale.value,
    refrigerante: mod_refrigerante.value
  };

  localStorage.setItem("freselist", JSON.stringify(archivio));

  modalOverlay.style.display = "none";
  caricaArchivio();
});
