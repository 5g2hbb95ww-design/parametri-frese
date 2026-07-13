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
   SALVATAGGIO
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
