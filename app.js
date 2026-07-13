// ============================================================
// PARAMETRI FRESE - APP COMPLETO
// ============================================================

document.addEventListener("DOMContentLoaded", () => {

    // ==========================
    // RIFERIMENTI ELEMENTI
    // ==========================

    let archivio = JSON.parse(localStorage.getItem("parametri_frese") || "[]");

    // --- Pagina nuovo ---
    const denominazionefresaEl = document.getElementById("denominazione_fresa");
    const diametroEl = document.getElementById("diametro");
    const ntaglientiinsertiEl = document.getElementById("ntaglientiinserti");

    const sEl = document.getElementById("s");
    const mminEl = document.getElementById("mmin");
    const sCalcEl = document.getElementById("s_calc");

    const fEl = document.getElementById("f");
    const avAdEl = document.getElementById("av_ad");
    const fCalcEl = document.getElementById("f_calc");

    const zapEl = document.getElementById("zap");
    const materialeEl = document.getElementById("materiale");
    const refrigeranteEl = document.getElementById("refrigerante");
    const codicefresaEl = document.getElementById("codice_fresa");
    const codiceinsertoEl = document.getElementById("codice_inserto");
    const dettagliEl = document.getElementById("dettagli");

    const salvaBtn = document.getElementById("salva");

    // --- Archivio ---
    const listaEl = document.getElementById("lista");
    const ricercaEl = document.getElementById("ricerca");
    const csvBtn = document.getElementById("csv");

    // --- Navigazione ---
    const btnNuovo = document.getElementById("btn-nuovo");
    const btnArchivio = document.getElementById("btn-archivio");
    const paginaNuovo = document.getElementById("pagina-nuovo");
    const paginaArchivio = document.getElementById("pagina-archivio");

    // --- Popup Modifica ---
    const modalOverlay = document.getElementById("modal-overlay");
    const modalCloseBtn = document.getElementById("modal-close-btn");
    const modalSalvaBtn = document.getElementById("modal-salva");
    const modalAnnullaBtn = document.getElementById("modal-annulla");

    const mod_denominazionefresaEl = document.getElementById("mod-denominazione_fresa");
    const mod_diametroEl = document.getElementById("mod-diametro");
    const mod_ntaglientiinsertiEl = document.getElementById("mod-ntaglientiinserti");

    const mod_sEl = document.getElementById("mod-s");
    const mod_mminEl = document.getElementById("mod-mmin");
    const mod_sCalcEl = document.getElementById("mod-s_calc");

    const mod_fEl = document.getElementById("mod-f");
    const mod_avAdEl = document.getElementById("mod-av_ad");
    const mod_fCalcEl = document.getElementById("mod-f_calc");

    const mod_zapEl = document.getElementById("mod-zap");
    const mod_materialeEl = document.getElementById("mod-materiale");
    const mod_refrigeranteEl = document.getElementById("mod-refrigerante");
    const mod_codicefresaEl = document.getElementById("mod-codice_fresa");
    const mod_codiceinsertoEl = document.getElementById("mod-codice_inserto");
    const mod_dettagliEl = document.getElementById("mod-dettagli");

    let indexInModifica = null;


    // ==========================
    // NAVIGAZIONE
    // ==========================

    function mostraPagina(pagina) {
        paginaNuovo.classList.remove("active");
        paginaArchivio.classList.remove("active");
        btnNuovo.classList.remove("active");
        btnArchivio.classList.remove("active");

        if (pagina === "nuovo") {
            paginaNuovo.classList.add("active");
            btnNuovo.classList.add("active");
        } else {
            paginaArchivio.classList.add("active");
            btnArchivio.classList.add("active");
            renderArchivio();
        }
    }

    btnNuovo.addEventListener("click", () => mostraPagina("nuovo"));
    btnArchivio.addEventListener("click", () => mostraPagina("archivio"));


    // ==========================
    // CALCOLI S E F (pagina nuovo)
    // ==========================

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

        calcolaF();
    }

    function calcolaF() {
        const avAd = parseFloat(avAdEl.value) || 0;
        const ntaglienti = parseFloat(ntaglientiinsertiEl.value) || 0;
        const sCalc = parseFloat(sCalcEl.value) || 0;

        const fCalc = avAd * ntaglienti * sCalc;
        fCalcEl.value = fCalc.toFixed(2);
    }

    mminEl.addEventListener("input", calcolaS);
    diametroEl.addEventListener("input", calcolaS);
    avAdEl.addEventListener("input", calcolaF);
    ntaglientiinsertiEl.addEventListener("input", calcolaF);


    // ==========================
    // CALCOLI S E F (popup modifica)
    // ==========================

    function mod_calcolaS() {
        const mmin = parseFloat(mod_mminEl.value) || 0;
        const diametro = parseFloat(mod_diametroEl.value) || 0;

        if (!diametro) {
            mod_sCalcEl.value = "";
            mod_calcolaF();
            return;
        }

        const sCalc = (1000 * mmin) / (3.14 * diametro);
        mod_sCalcEl.value = sCalc.toFixed(2);

        mod_calcolaF();
    }

    function mod_calcolaF() {
        const avAd = parseFloat(mod_avAdEl.value) || 0;
        const ntaglienti = parseFloat(mod_ntaglientiinsertiEl.value) || 0;
        const sCalc = parseFloat(mod_sCalcEl.value) || 0;

        const fCalc = avAd * ntaglienti * sCalc;
        mod_fCalcEl.value = fCalc.toFixed(2);
    }

    mod_mminEl.addEventListener("input", mod_calcolaS);
    mod_diametroEl.addEventListener("input", mod_calcolaS);
    mod_avAdEl.addEventListener("input", mod_calcolaF);
    mod_ntaglientiinsertiEl.addEventListener("input", mod_calcolaF);


    // ==========================
    // SALVATAGGIO NUOVA FRESA
    // ==========================

    salvaBtn.addEventListener("click", () => {

        const dati = {
            denominazionefresa: denominazionefresaEl.value,
            diametro: diametroEl.value,
            ntaglientiinserti: ntaglientiinsertiEl.value,
            s: sEl.value,
            mmin: mminEl.value,
            s_calc: sCalcEl.value,
            f: fEl.value,
            av_ad: avAdEl.value,
            f_calc: fCalcEl.value,
            zap: zapEl.value,
            materiale: materialeEl.value,
            refrigerante: refrigeranteEl.value,
            codicefresa: codicefresaEl.value,
            codiceinserto: codiceinsertoEl.value,
            dettagli: dettagliEl.value
        };

        archivio.push(dati);
        localStorage.setItem("parametri_frese", JSON.stringify(archivio));

        alert("✅ Fresa salvata!");
        mostraPagina("archivio");
    });


    // ==========================
    // RENDER ARCHIVIO
    // ==========================

    function renderArchivio() {
        listaEl.innerHTML = "";

        const filtro = ricercaEl.value.toLowerCase();

        archivio
            .filter(item => JSON.stringify(item).toLowerCase().includes(filtro))
            .forEach((item, index) => {

                const div = document.createElement("div");
                div.className = "riga";

                div.innerHTML = `
                    <strong style="color:#5ac8fa; font-size:17px;">📌 ${item.denominazionefresa}</strong><br><br>
                    Diametro: ${item.diametro}<br>
                    N.Taglienti/Inserti: ${item.ntaglientiinserti}<br>
                    S: ${item.s} | M/Minuto: ${item.mmin}<br>
                    S calcolata: ${item.s_calc}<br><br>
                    F: ${item.f} | Av.Ad: ${item.av_ad}<br>
                    F calcolata: ${item.f_calc}<br><br>
                    Z-Ap: ${item.zap}<br>
                    Materiale: ${item.materiale}<br>
                    Refrigerante: ${item.refrigerante}<br>
                    Codice fresa: ${item.codicefresa}<br>
                    Codice inserto: ${item.codiceinserto}<br>
                    Dettagli: ${item.dettagli}<br>

                    <div class="riga-actions">
                        <button class="modifica" data-index="${index}">✏️ Modifica</button>
                        <button class="elimina" data-index="${index}">🗑 Elimina</button>
                    </div>
                `;

                listaEl.appendChild(div);
            });

        // --- Elimina ---
        document.querySelectorAll(".elimina").forEach(btn => {
            btn.addEventListener("click", () => {
                const idx = btn.getAttribute("data-index");
                if (confirm("Eliminare questa fresa?")) {
                    archivio.splice(idx, 1);
                    localStorage.setItem("parametri_frese", JSON.stringify(archivio));
                    renderArchivio();
                }
            });
        });

        // --- Modifica ---
        document.querySelectorAll(".modifica").forEach(btn => {
            btn.addEventListener("click", () => {
                indexInModifica = btn.getAttribute("data-index");
                apriPopup(indexInModifica);
            });
        });
    }

    ricercaEl.addEventListener("input", renderArchivio);


    // ==========================
    // POPUP MODIFICA
    // ==========================

    function apriPopup(index) {
        const item = archivio[index];

        mod_denominazionefresaEl.value = item.denominazionefresa;
        mod_diametroEl.value = item.diametro;
        mod_ntaglientiinsertiEl.value = item.ntaglientiinserti;

        mod_sEl.value = item.s;
        mod_mminEl.value = item.mmin;
        mod_sCalcEl.value = item.s_calc;

        mod_fEl.value = item.f;
        mod_avAdEl.value = item.av_ad;
        mod_fCalcEl.value = item.f_calc;

        mod_zapEl.value = item.zap;
        mod_materialeEl.value = item.materiale;
        mod_refrigeranteEl.value = item.refrigerante;
        mod_codicefresaEl.value = item.codicefresa;
        mod_codiceinsertoEl.value = item.codiceinserto;
        mod_dettagliEl.value = item.dettagli;

        modalOverlay.classList.add("active");
    }

    modalCloseBtn.addEventListener("click", () => modalOverlay.classList.remove("active"));
    modalAnnullaBtn.addEventListener("click", () => modalOverlay.classList.remove("active"));

    modalSalvaBtn.addEventListener("click", () => {

        const dati = {
            denominazionefresa: mod_denominazionefresaEl.value,
            diametro: mod_diametroEl.value,
            ntaglientiinserti: mod_ntaglientiinsertiEl.value,
            s: mod_sEl.value,
            mmin: mod_mminEl.value,
            s_calc: mod_sCalcEl.value,
            f: mod_fEl.value,
            av_ad: mod_avAdEl.value,
            f_calc: mod_fCalcEl.value,
            zap: mod_zapEl.value,
            materiale: mod_materialeEl.value,
            refrigerante: mod_refrigeranteEl.value,
            codicefresa: mod_codicefresaEl.value,
            codiceinserto: mod_codiceinsertoEl.value,
            dettagli: mod_dettagliEl.value
        };

        archivio[indexInModifica] = dati;
        localStorage.setItem("parametri_frese", JSON.stringify(archivio));

        modalOverlay.classList.remove("active");
        renderArchivio();
        alert("✅ Modifica salvata!");
    });


    // ==========================
    // CSV EXPORT
    // ==========================

    csvBtn.addEventListener("click", () => {

        if (!archivio.length) {
            alert("❌ Nessun dato da esportare!");
            return;
        }

        const header =
            "Denominazione Fresa;Diametro;N.Taglienti/Inserti;S;M/Minuto;S calcolata;F;Av.Ad;F calcolata;Z-Ap;Materiale;Refrigerante;Codice fresa;Codice inserto;Dettagli\n";

        const righe = archivio.map(item =>
            `${item.denominazionefresa};${item.diametro};${item.ntaglientiinserti};${item.s};${item.mmin};${item.s_calc};${item.f};${item.av_ad};${item.f_calc};${item.zap};${item.materiale};${item.refrigerante};${item.codicefresa};${item.codiceinserto};${item.dettagli}`
        ).join("\n");

        const csvContent = header + righe;

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "parametri_frese.csv";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        alert("📄 CSV scaricato!");
    });


    // ==========================
    // SERVICE WORKER
    // ==========================

    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("service-worker.js");
    }

    // Render iniziale
    renderArchivio();
});
