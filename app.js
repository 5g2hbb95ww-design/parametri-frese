/* ============================================================
   PARAMETRI FRESE – APP.JS COMPLETO
   Versione con:
   - S calcolata
   - F calcolata
   - Calcolo automatico
   - Archivio + CSV aggiornati
   ============================================================ */

/* -----------------------------
   ELEMENTI DOM
----------------------------- */
const diametro = document.getElementById("diametro");
const mMin = document.getElementById("mMin");        // S-M/Minuto
const avAd = document.getElementById("avAd");        // F-Ad
const pastiglie = document.getElementById("pastiglie");

const sCalcolata = document.getElementById("sCalcolata");
const fCalcolata = document.getElementById("fCalcolata");

const btnSalva = document.getElementById("salva");
const btnCSV = document.getElementById("exportCSV");
const archivioDiv = document.getElementById("archivio");

/* -----------------------------
   CALCOLI AUTOMATICI
----------------------------- */
function aggiornaCalcoli() {
    const D = parseFloat(diametro.value);
    const M = parseFloat(mMin.value);
    const AV = parseFloat(avAd.value);
    const P = parseFloat(pastiglie.value);

    if (!isNaN(D) && !isNaN(M)) {
        const S = (1000 * M) / (3.14 * D);
        sCalcolata.value = S.toFixed(0);

        if (!isNaN(AV) && !isNaN(P)) {
            const F = AV * P * S;
            fCalcolata.value = F.toFixed(0);
        }
    }
}

/* -----------------------------
   ARCHIVIO LOCALE
----------------------------- */
function caricaArchivio() {
    const dati = JSON.parse(localStorage.getItem("archivio_frese")) || [];
    archivioDiv.innerHTML = "";

    dati.forEach((riga, i) => {
        const item = document.createElement("div");
        item.className = "rigaArchivio";
        item.innerHTML = `
            <strong>${riga.nome}</strong><br>
            D=${riga.D} | M/min=${riga.M} | Av.Ad=${riga.AV} | Pastiglie=${riga.P}<br>
            S calcolata=${riga.S} | F calcolata=${riga.F}
            <button onclick="elimina(${i})">Elimina</button>
        `;
        archivioDiv.appendChild(item);
    });
}

function salvaArchivio() {
    const nome = prompt("Nome utensile / lavorazione:");
    if (!nome) return;

    const D = parseFloat(diametro.value);
    const M = parseFloat(mMin.value);
    const AV = parseFloat(avAd.value);
    const P = parseFloat(pastiglie.value);
    const S = parseFloat(sCalcolata.value);
    const F = parseFloat(fCalcolata.value);

    const dati = JSON.parse(localStorage.getItem("archivio_frese")) || [];

    dati.push({
        nome,
        D,
        M,
        AV,
        P,
        S,
        F
    });

    localStorage.setItem("archivio_frese", JSON.stringify(dati));
    caricaArchivio();
}

function elimina(index) {
    const dati = JSON.parse(localStorage.getItem("archivio_frese")) || [];
    dati.splice(index, 1);
    localStorage.setItem("archivio_frese", JSON.stringify(dati));
    caricaArchivio();
}

/* -----------------------------
   ESPORTAZIONE CSV
----------------------------- */
function esportaCSV() {
    const dati = JSON.parse(localStorage.getItem("archivio_frese")) || [];
    if (dati.length === 0) {
        alert("Archivio vuoto");
        return;
    }

    let csv = "Nome;Diametro;M/min;Av.Ad;Pastiglie;S calcolata;F calcolata\n";

    dati.forEach(r => {
        csv += `${r.nome};${r.D};${r.M};${r.AV};${r.P};${r.S};${r.F}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "parametri_frese.csv";
    a.click();

    URL.revokeObjectURL(url);
}

/* -----------------------------
   EVENTI
----------------------------- */
diametro.addEventListener("input", aggiornaCalcoli);
mMin.addEventListener("input", aggiornaCalcoli);
avAd.addEventListener("input", aggiornaCalcoli);
pastiglie.addEventListener("input", aggiornaCalcoli);

btnSalva.addEventListener("click", salvaArchivio);
btnCSV.addEventListener("click", esportaCSV);

/* -----------------------------
   AVVIO
----------------------------- */
caricaArchivio();
