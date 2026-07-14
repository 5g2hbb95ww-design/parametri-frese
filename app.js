// 
document.addEventListener('DOMContentLoaded', function() {
    console.log("App inizializzata");

    // Caricamento archivio
    let archivio = JSON.parse(localStorage.getItem("parametri_frese") || "[]");

    // ELEMENTI FORM PRINCIPALE
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

    // ELEMENTI ARCHIVIO
    const listaEl = document.getElementById("lista");
    const ricercaEl = document.getElementById("ricerca");

    // NAVIGAZIONE
    const btnNuovo = document.getElementById("btn-nuovo");
    const btnArchivio = document.getElementById("btn-archivio");
    const paginaNuovo = document.getElementById("pagina-nuovo");
    const paginaArchivio = document.getElementById("pagina-archivio");

    // MODAL
    const modalOverlay = document.getElementById("modal-overlay");
    const modalCloseBtn = document.getElementById("modal-close-btn");
    const modalAnnullaBtn = document.getElementById("modal-annulla");
    const modalSalvaBtn = document.getElementById("modal-salva");

    // ELEMENTI MODAL
    const modDenominazioneEl = document.getElementById("mod-denominazione_fresa");
    const modDiametroEl = document.getElementById("mod-diametro");
    const modNtaglientiEl = document.getElementById("mod-ntaglientiinserti");

    const modSEl = document.getElementById("mod-s");
    const modMminEl = document.getElementById("mod-mmin");
    const modSCalcEl = document.getElementById("mod-s_calc");

    const modFEl = document.getElementById("mod-f");
    const modAvAdEl = document.getElementById("mod-av_ad");
    const modFCalcEl = document.getElementById("mod-f_calc");

    const modZapEl = document.getElementById("mod-zap");
    const modMaterialeEl = document.getElementById("mod-materiale");
    const modRefrigeranteEl = document.getElementById("mod-refrigerante");

    const modCodiceFresaEl = document.getElementById("mod-codice_fresa");
    const modCodiceInsertoEl = document.getElementById("mod-codice_inserto");
    const modDettagliEl = document.getElementById("mod-dettagli");

    let indexInModifica = null;

    // ---------------- NAVIGAZIONE ----------------

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

    // ---------------- CALCOLI ----------------

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

    // ---------------- SALVATAGGIO ----------------

    document.getElementById("salva").addEventListener("click", function(e) {
        e.preventDefault();

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
        pulisciCampi();
        mostraPagina("archivio");
    });

    function pulisciCampi() {
        denominazionefresaEl.value = "";
        diametroEl.value = "";
        ntaglientiinsertiEl.value = "";
        sEl.value = "";
        mminEl.value = "";
        sCalcEl.value = "";
        fEl.value = "";
        avAdEl.value = "";
        fCalcEl.value = "";
        zapEl.value = "";
        materialeEl.value = "Acciaio";
        refrigeranteEl.value = "Acqua";
        codicefresaEl.value = "";
        codiceinsertoEl.value = "";
        dettagliEl.value = "";
    }

    // ---------------- ARCHIVIO ----------------

    function renderArchivio() {
        listaEl.innerHTML = "";
        const filtro = ricercaEl.value.toLowerCase();

        if (archivio.length === 0) {
            listaEl.innerHTML = "<p style='text-align:center; color:#999;'>Nessuna fresa salvata ancora</p>";
            return;
        }

        archivio
            .filter(item => JSON.stringify(item).toLowerCase().includes(filtro))
            .forEach((item, index) => {

                const div = document.createElement("div");
                div.className = "riga";

                div.innerHTML = `
                    <strong style="color:#5ac8fa; font-size:17px;">📌 ${item.denominazionefresa || "Senza nome"}</strong><br><br>

                    <strong>Diametro:</strong> ${item.diametro}<br>
                    N.Taglienti/inserti: ${item.ntaglientiinserti}<br>
                    S: ${item.s} | M/Minuto: ${item.mmin}<br>
                    S calcolata: ${item.s_calc}<br>
                    F: ${item.f} | Avanzamento Ad: ${item.av_ad}<br>
                    F calcolata: ${item.f_calc}<br>
                    Z-Ap: ${item.zap}<br>
                    <strong>Materiale:</strong> ${item.materiale}<br>
                    <strong>Refrigerante:</strong> ${item.refrigerante}<br>
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

        // ELIMINA
        document.querySelectorAll(".elimina").forEach(btn => {
            btn.addEventListener("click", () => {
                const idx = parseInt(btn.getAttribute("data-index"), 10);
                if (confirm(`Eliminare "${archivio[idx].denominazionefresa}"?`)) {
                    archivio.splice(idx, 1);
                    localStorage.setItem("parametri_frese", JSON.stringify(archivio));
                    renderArchivio();
                }
            });
        });

        // MODIFICA
        document.querySelectorAll(".modifica").forEach(btn => {
            btn.addEventListener("click", () => {
                const idx = parseInt(btn.getAttribute("data-index"), 10);
                apriModalModifica(idx);
            });
        });
    }

    ricercaEl.addEventListener("input", renderArchivio);

    // ---------------- MODAL ----------------

    function apriModalModifica(index) {
        indexInModifica = index;
        const item = archivio[index];

        modDenominazioneEl.value = item.denominazionefresa;
        modDiametroEl.value = item.diametro;
        modNtaglientiEl.value = item.ntaglientiinserti;

        modSEl.value = item.s;
        modMminEl.value = item.mmin;
        modSCalcEl.value = item.s_calc;

        modFEl.value = item.f;
        modAvAdEl.value = item.av_ad;
        modFCalcEl.value = item.f_calc;

        modZapEl.value = item.zap;
        modMaterialeEl.value = item.materiale;
        modRefrigeranteEl.value = item.refrigerante;

        modCodiceFresaEl.value = item.codicefresa;
        modCodiceInsertoEl.value = item.codiceinserto;
        modDettagliEl.value = item.dettagli;

        modalOverlay.classList.add("active");
    }

    function chiudiModal() {
        modalOverlay.classList.remove("active");
    }

    modalCloseBtn.addEventListener("click", chiudiModal);
    modalAnnullaBtn.addEventListener("click", chiudiModal);

    // SALVA MODIFICHE
    modalSalvaBtn.addEventListener("click", () => {
        const item = archivio[indexInModifica];

        item.denominazionefresa = modDenominazioneEl.value;
        item.diametro = modDiametroEl.value;
        item.ntaglientiinserti = modNtaglientiEl.value;

        item.s = modSEl.value;
        item.mmin = modMminEl.value;
        item.s_calc = modSCalcEl.value;

        item.f = modFEl.value;
        item.av_ad = modAvAdEl.value;
        item.f_calc = modFCalcEl.value;

        item.zap = modZapEl.value;
        item.materiale = modMaterialeEl.value;
        item.refrigerante = modRefrigeranteEl.value;

        item.codicefresa = modCodiceFresaEl.value;
        item.codiceinserto = modCodiceInsertoEl.value;
        item.dettagli = modDettagliEl.value;

        localStorage.setItem("parametri_frese", JSON.stringify(archivio));
        renderArchivio();
        chiudiModal();
    });

    // ---------------- SERVICE WORKER ----------------

    if ("serviceWorker" in navigator) {
        window.addEventListener("load", () => {
            navigator.serviceWorker.register("service-worker.js");
        });
    }

    renderArchivio();
});
