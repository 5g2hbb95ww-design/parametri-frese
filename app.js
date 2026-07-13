// Attendere che il DOM sia completamente caricato
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOMContentLoaded - Inizio inizializzazione app");
    
    // Caricamento iniziale dati da LocalStorage
    let archivio = JSON.parse(localStorage.getItem("parametri_frese") || "[]");

    // Riferimenti elementi FORM
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
    const dettagliEl = document.getElementById("dettagli");

    // Riferimenti elementi BUTTONS
    const salvaBtn = document.getElementById("salva");
    const csvBtn = document.getElementById("csv");

    // Riferimenti elementi ARCHIVIO
    const listaEl = document.getElementById("lista");
    const ricercaEl = document.getElementById("ricerca");

    // Riferimenti NAVIGAZIONE
    const btnNuovo = document.getElementById("btn-nuovo");
    const btnArchivio = document.getElementById("btn-archivio");
    const paginaNuovo = document.getElementById("pagina-nuovo");
    const paginaArchivio = document.getElementById("pagina-archivio");

    // Debug: verifica elementi
    console.log("DEBUG - Elementi trovati:");
    console.log("denominazionefresaEl:", denominazionefresaEl);
    console.log("salvaBtn:", salvaBtn);
    console.log("csvBtn:", csvBtn);
    console.log("btnNuovo:", btnNuovo);
    console.log("btnArchivio:", btnArchivio);

    // --- NAVIGAZIONE PAGINE ---
    
    function mostraPagina(pagina) {
        console.log("Mostrando pagina:", pagina);
        
        // Nascondi tutte le pagine
        paginaNuovo.classList.remove("active");
        paginaArchivio.classList.remove("active");
        
        // Rimuovi active da tutti i bottoni
        btnNuovo.classList.remove("active");
        btnArchivio.classList.remove("active");
        
        // Mostra pagina selezionata
        if (pagina === "nuovo") {
            paginaNuovo.classList.add("active");
            btnNuovo.classList.add("active");
        } else if (pagina === "archivio") {
            paginaArchivio.classList.add("active");
            btnArchivio.classList.add("active");
            renderArchivio(); // Aggiorna archivio quando si apre
        }
    }
    
    // Event listeners navigazione
    if (btnNuovo) {
        btnNuovo.addEventListener("click", () => mostraPagina("nuovo"));
    }
    if (btnArchivio) {
        btnArchivio.addEventListener("click", () => mostraPagina("archivio"));
    }

    // --- CALCOLI ---

    // S calcolata = (1000 * M/Minuto) / (3.14 * Diametro)
    function calcolaS() {
        if (!mminEl || !diametroEl || !sCalcEl) return;
        
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
        if (!avAdEl || !ntaglientiinsertiEl || !sCalcEl || !fCalcEl) return;
        
        const avAd = parseFloat(avAdEl.value) || 0;
        const ntaglientiinserti = parseFloat(ntaglientiinsertiEl.value) || 0;
        const sCalc = parseFloat(sCalcEl.value) || 0;

        const fCalc = avAd * ntaglientiinserti * sCalc;
        fCalcEl.value = fCalc.toFixed(2);
    }

    // Eventi per calcolo automatico
    if (mminEl) mminEl.addEventListener("input", calcolaS);
    if (diametroEl) diametroEl.addEventListener("input", calcolaS);

    if (fEl) fEl.addEventListener("input", calcolaF);
    if (avAdEl) avAdEl.addEventListener("input", calcolaF);
    if (ntaglientiinsertiEl) ntaglientiinsertiEl.addEventListener("input", calcolaF);

    // --- SALVATAGGIO ---

    if (salvaBtn) {
        console.log("Aggiungendo event listener a salvaBtn");
        salvaBtn.addEventListener("click", function(e) {
            e.preventDefault();
            console.log("DEBUG - Click su Salva");
            
            const dati = {
                denominazionefresa: denominazionefresaEl ? denominazionefresaEl.value : "",
                diametro: diametroEl ? diametroEl.value : "",
                ntaglientiinserti: ntaglientiinsertiEl ? ntaglientiinsertiEl.value : "",
                s: sEl ? sEl.value : "",
                mmin: mminEl ? mminEl.value : "",
                s_calc: sCalcEl ? sCalcEl.value : "",

                f: fEl ? fEl.value : "",
                av_ad: avAdEl ? avAdEl.value : "",
                f_calc: fCalcEl ? fCalcEl.value : "",

                zap: zapEl ? zapEl.value : "",
                materiale: materialeEl ? materialeEl.value : "",
                refrigerante: refrigeranteEl ? refrigeranteEl.value : "",
                codicefresa: codicefresaEl ? codicefresaEl.value : "",
                dettagli: dettagliEl ? dettagliEl.value : ""
            };

            console.log("DEBUG - Dati da salvare:", dati);
            
            archivio.push(dati);
            localStorage.setItem("parametri_frese", JSON.stringify(archivio));
            console.log("DEBUG - Archivio salvato, lunghezza:", archivio.length);
            
            alert("✅ Fresa salvata!");
            pulisciCampi();
            
            // Vai automaticamente all'archivio
            mostraPagina("archivio");
        });
    } else {
        console.error("DEBUG - salvaBtn NON trovato!");
    }

    // Pulizia campi
    function pulisciCampi() {
        if (denominazionefresaEl) denominazionefresaEl.value = "";
        if (diametroEl) diametroEl.value = "";
        if (ntaglientiinsertiEl) ntaglientiinsertiEl.value = "";
        if (sEl) sEl.value = "";
        if (mminEl) mminEl.value = "";
        if (sCalcEl) sCalcEl.value = "";

        if (fEl) fEl.value = "";
        if (avAdEl) avAdEl.value = "";
        if (fCalcEl) fCalcEl.value = "";

        if (zapEl) zapEl.value = "";
        if (materialeEl) materialeEl.value = "Acciaio";
        if (refrigeranteEl) refrigeranteEl.value = "Acqua";
        if (codicefresaEl) codicefresaEl.value = "";
        if (dettagliEl) dettagliEl.value = "";
    }

    // --- ARCHIVIO ---

    function renderArchivio() {
        if (!listaEl) {
            console.error("DEBUG - listaEl non trovato");
            return;
        }
        
        console.log("Rendering archivio, elementi:", archivio.length);
        listaEl.innerHTML = "";
        const filtro = (ricercaEl && ricercaEl.value) ? ricercaEl.value.toLowerCase() : "";

        if (archivio.length === 0) {
            listaEl.innerHTML = "<p style='text-align:center; color:#999;'>Nessuna fresa salvata ancora</p>";
            return;
        }

        archivio
            .filter(item => {
                const testo = JSON.stringify(item).toLowerCase();
                return testo.includes(filtro);
            })
            .forEach((item, index) => {
                const div = document.createElement("div");
                div.className = "riga";

                div.innerHTML = `
                    <strong style="color:#5ac8fa; font-size:17px;">📌 ${item.denominazionefresa || "Senza nome"}</strong><br>
                    <br>
                    <strong>Diametro:</strong> ${item.diametro}<br>
                    N.Taglienti/inserti: ${item.ntaglientiinserti}<br>
                    S: ${item.s} | M/Minuto: ${item.mmin}<br>
                    S calcolata: ${item.s_calc}<br><br>

                    F: ${item.f} | Av. Ad: ${item.av_ad}<br>
                    F calcolata: ${item.f_calc}<br><br>

                    Z-Ap: ${item.zap}<br>
                    <strong>Materiale:</strong> ${item.materiale}<br>
                    <strong>Refrigerante:</strong> ${item.refrigerante}<br>
                    Codice fresa: ${item.codicefresa}<br>
                    Dettagli: ${item.dettagli}<br>

                    <button data-index="${index}" class="elimina" style="background:#FF3B30;">🗑 Elimina</button>
                `;

                listaEl.appendChild(div);
            });

        // Pulsanti elimina
        document.querySelectorAll(".elimina").forEach(btn => {
            btn.addEventListener("click", () => {
                const idx = parseInt(btn.getAttribute("data-index"), 10);
                const nomeFresa = archivio[idx].denominazionefresa || "Fresa";
                
                if (confirm(`Sei sicuro di voler eliminare "${nomeFresa}"?`)) {
                    archivio.splice(idx, 1);
                    localStorage.setItem("parametri_frese", JSON.stringify(archivio));
                    renderArchivio();
                }
            });
        });
    }

    if (ricercaEl) {
        ricercaEl.addEventListener("input", renderArchivio);
    }

    // --- CSV ---

    if (csvBtn) {
        console.log("Aggiungendo event listener a csvBtn");
        csvBtn.addEventListener("click", function(e) {
            e.preventDefault();
            console.log("DEBUG - Click su CSV Export");
            console.log("DEBUG - Archivio:", archivio);
            
            if (!archivio.length) {
                console.log("DEBUG - Archivio vuoto, niente da esportare");
                alert("❌ Nessun dato da esportare!");
                return;
            }

            const header = "Denominazione Fresa;Diametro;N.Taglienti/Inserti;S;M/Minuto;S calcolata;F;Av. Ad;F calcolata;Z-Ap;Materiale;Refrigerante;Codice fresa;Dettagli\n";

            const righe = archivio.map(item =>
                `${item.denominazionefresa};${item.diametro};${item.ntaglientiinserti};${item.s};${item.mmin};${item.s_calc};${item.f};${item.av_ad};${item.f_calc};${item.zap};${item.materiale};${item.refrigerante};${item.codicefresa};${item.dettagli}`
            ).join("\n");

            const csvContent = header + righe;
            console.log("DEBUG - CSV Content:", csvContent);

            const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
            const url = URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = "parametri_frese.csv";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            alert("✅ CSV scaricato!");
            console.log("DEBUG - CSV scaricato");
        });
    } else {
        console.error("DEBUG - csvBtn NON trovato!");
    }

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
    console.log("DEBUG - Render iniziale");
    renderArchivio();
    console.log("App inizializzata completamente");
});
