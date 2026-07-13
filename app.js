/* ============================
   RIFERIMENTI ELEMENTI
============================ */

const paginaNuovo = document.getElementById("pagina-nuovo");
const paginaArchivio = document.getElementById("pagina-archivio");

const btnNuovo = document.getElementById("btn-nuovo");
const btnArchivio = document.getElementById("btn-archivio");

const lista = document.getElementById("lista");
const ricerca = document.getElementById("ricerca");

/* ============================
   NAVIGAZIONE PAGINE
============================ */

btnNuovo.addEventListener("click", () => {
  paginaNuovo.classList.add("active");
  paginaArchivio.classList.remove("active");
  btnNuovo.classList.add("active");
  btnArchivio.classList.remove("active");
});

btnArchivio.addEventListener("click", () => {
  paginaArchivio.classList.add("active");
  paginaNuovo.classList.remove("active");
  btnArchivio.classList.add("active");
  btnNuovo.classList.remove("active");
  caricaArchivio();
});

/* ============================
   CALCOLI AUTOMATICI
============================ */

function calcolaS() {
  const D = parseFloat(document.getElementById("diametro").value);
  const M = parseFloat(document.getElementById("mmin").value);

  if (!D || !M) {
    document.getElementById("s_calc").value = "";
    return;
  }

  const S = (M * 1000) / (Math.PI * D);
  document.getElementById("s_calc").value = S.toFixed(2);
}

function calcolaF() {
  const F = parseFloat(document.getElementById("f").value);
  const AvAd = parseFloat(document.getElementById("av_ad").value);
  const Z = parseFloat(document.getElementById("ntaglientiinserti").value);
  const S = parseFloat(document.getElementById("s_calc").value);

  if (!F || !AvAd) {
    document.getElementById("f_calc").value = "";
    return;
  }

  if (S && Z) {
    const Fc = AvAd * Z * S;
    document.getElementById("f_calc").value = Fc.toFixed(2);
    return;
  }

  document.getElementById("f_calc").value = (F * AvAd).toFixed(2);
}

document.getElementById("diametro").addEventListener("input", calcolaS);
document.getElementById("mmin").addEventListener("input", calcolaS);

document.getElementById("f").addEventListener("input", calcolaF);
document.getElementById("av_ad").addEventListener("input", calcolaF);
document.getElementById("ntaglientiinserti").addEventListener("input", calcolaF);

/* ============================
   SALVATAGGIO
============================ */

document.getElementById("salva").addEventListener("click", () => {
  const fresa = {
    denominazione: document.getElementById("denominazione_fresa").value,
    diametro: document.getElementById("diametro").value,
    taglienti: document.getElementById("ntaglientiinserti").value,
    s: document.getElementById("s").value,
    mmin: document.getElementById("mmin").value,
    s_calc: document.getElementById("s_calc").value,
    f: document.getElementById("f").value,
    av_ad: document.getElementById("av_ad").value,
    f_calc: document.getElementById("f_calc").value,
    zap: document.getElementById("zap").value,
    materiale: document.getElementById("materiale").value,
    refrigerante: document.getElementById("refrigerante").value,
    codice_fresa: document.getElementById("codice_fresa").value,
    codice_inserto: document.getElementById("codice_inserto").value,
    dettagli: document.getElementById("dettagli").value
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
   MODIFICA
============================ */

function modifica(i) {
  const archivio = JSON.parse(localStorage.getItem("freselist")) || [];
  const fresa = archivio[i];

  // TODO: collegare i campi del modal
  alert("Funzione modifica da completare");
}
