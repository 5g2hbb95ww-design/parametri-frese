// Caricamento iniziale dati da LocalStorage
let archivio = JSON.parse(localStorage.getItem("parametri_frese") || "[]");

// Riferimenti elementi
const denominazionefresaEl = document.getElementById("denominazione_fresa");
const diametroEl = document.getElementById("diametro");
const ntaglientiinsertiEl = document.getElementById("ntaglientiinserti");
const mminEl = document.getElementById("mmin");
const sCalcEl = document.getElementById("s_calc");

const fEl = document.getElementById("f");
const avAdEl = document.getElementById("av_ad");
const fCalcEl = document.getElementById("f_calc");

const zapEl = document.getElementById("zap");
const materialeEl = document.getElementById("materiale");
const refrigeranteEl = document.getElementById("refrigerante");
const dettagliEl = document.getElementById("dettagli");

const salvaBtn = document.getElementById("salva");
const listaEl = document.getElementById("lista");
const ricercaEl = document.getElementById("ricerca");
const csvBtn = document.getElementById("csv");

// --- CALCOLI ---

// S calcolata = (1000 * M/Minuto) / (3.14 * Diametro)
function calcolaS() {
    const mmin = parseFloat(mminEl.value) || 0;
    const diametro = parseFloat(diametroEl.value) || 0;

    if (!diametro) {
        sCalcEl.value = "";
        calcolaF();
        return;
    }

    const sCalc = (1000 * mmin) / (3.14 * diametro);
    sCalcEl.value = sCalc.toFixed(2);

    calcolaF(); // aggiorna F calcolata
}

// F calcolata = Av.Ad * N.Taglienti/Inserti * S calcolata
function calcolaF() {
    const avAd = parseFloat(avAdEl.value) || 0;
    const ntaglientiinserti = parseFloat(ntaglientiinsertiEl.value) || 0;
    const sCalc = parseFloat(sCalcEl.value) || 0;

    const fCalc = avAd * ntaglientiinserti * sCalc;
    fCalcEl.value = fCalc.toFixed(2);
}

// Eventi per calcolo automatico
mminEl.addEventListener("input", calcolaS);
diametroEl.addEventListener("input", calcolaS);

fEl.addEventListener("input", calcolaF);
avAdEl.addEventListener("input", calcolaF);
ntaglientiinsertiEl.addEventListener("input", calcolaF);

// --- SALVATAGGIO ---

salvaBtn.addEventListener("click", () => {
    const dati = {
        denominazionegresa: denominazionefresaEl.value,
        diametro: diametroEl.value,
        mmin: mminEl.value,
        s_calc: sCalcEl.value,

        f: fEl.value,
        av_ad: avAdEl.value,
        f_calc: fCalcEl.value,

        ntaglientiinserti: ntaglientiinsertiEl.value,
        zap: zapEl.value,
        materiale: materialeEl.value,
        refrigerante: refrigeranteEl.value,
        dettagli: dettagliEl.value
    };

    archivio.push(dati);
    localStorage.setItem("parametri_frese", JSON.stringify(archivio));
    pulisciCampi();
    renderArchivio();
});

// Pulizia campi
function pulisciCampi() {
    denominazionefresaEl.value = "";
    diametroEl.value = "";
    ntaglientiinsertiEl.value = "";
    mminEl.value = "";
    sCalcEl.value = "";

    fEl.value = "";
    avAdEl.value = "";
    fCalcEl.value = "";

    zapEl.value = "";
    materialeEl.value = "Acciaio";
    refrigeranteEl.value = "Acqua";
    dettagliEl.value = "";
}

// --- ARCHIVIO ---

function renderArchivio() {
    listaEl.innerHTML = "";
    const filtro = (ricercaEl.value || "").toLowerCase();

    archivio
        .filter(item => {
            const testo = JSON.stringify(item).toLowerCase();
            return testo.includes(filtro);
        })
        .forEach((item, index) => {
            const div = document.createElement("div");
            div.className = "riga";

            div.innerHTML = `
                <strong>Diametro:</strong> ${item.diametro}<br>
                M/Minuto: ${item.mmin}<br>
                S calcolata: ${item.s_calc}<br><br>

                F: ${item.f}<br>
                Av. Ad: ${item.av_ad}<br>
                F calcolata: ${item.f_calc}<br><br>

                N.Taglienti/inserti: ${item.pastiglie}<br>
                Z-Ap: ${item.zap}<br>
                Materiale: ${item.materiale}<br>
                Refrigerante: ${item.refrigerante}<br>
                Dettagli: ${item.dettagli}<br><br>

                <button data-index="${index}" class="elimina">🗑 Elimina</button>
            `;

            listaEl.appendChild(div);
        });

    // Pulsanti elimina
    document.querySelectorAll(".elimina").forEach(btn => {
        btn.addEventListener("click", () => {
            const idx = parseInt(btn.getAttribute("data-index"), 10);
            archivio.splice(idx, 1);
            localStorage.setItem("parametri_frese", JSON.stringify(archivio));
            renderArchivio();
        });
    });
}

ricercaEl.addEventListener("input", renderArchivio);

// --- CSV ---

csvBtn.addEventListener("click", () => {
    if (!archivio.length) return;

    const header = "Denominazione Fresa;Diametro;N.Taglienti/Inserti;M/Minuto;S calcolata;F;Av. Ad;F calcolata;Z-Ap;Materiale;Refrigerante;Dettagli\n";

    const righe = archivio.map(item =>
        `${item.denominazionefresa};${item.diametro};${item.ntaglientiinserti};${item.mmin};${item.s_calc};${item.f};${item.av_ad};${item.f_calc};${item.zap};${item.materiale};${item.refrigerante};${item.dettagli}`
    ).join("\n");

    const blob = new Blob([header + righe], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "parametri_frese.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
});

// --- SERVICE WORKER ---

if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker
            .register("service-worker.js")
            .then(() => console.log("Service Worker registrato"))
            .catch(err => console.error(err));
    });
}

// Render iniziale
renderArchivio();
