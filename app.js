document.addEventListener('DOMContentLoaded', function() {
    console.log("App inizializzata");

    // ================= TEMA CHIARO/SCURO =================
    function applySavedTheme() {
        const savedTheme = localStorage.getItem("app-theme");
        if (savedTheme) {
            document.documentElement.setAttribute("data-theme", savedTheme);
            return;
        }
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        document.documentElement.setAttribute("data-theme", prefersDark ? "dark" : "light");
    }

    function setTheme(theme) {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("app-theme", theme);
    }

    applySavedTheme();
    window.setTheme = setTheme;

    // ================= ARCHIVIO =================
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

    const xyaeEl = document.getElementById("xyae");
    const xyaeUnitEl = document.getElementById("xyae_unit");

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
    const btnStile = document.getElementById("btn-stile");
    const paginaNuovo = document.getElementById("pagina-nuovo");
    const paginaArchivio = document.getElementById("pagina-archivio");
    const paginaStile = document.getElementById("pagina-stile");

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

    const modXYAeValEl = document.getElementById("mod-xyae_val");
    const modXYAeUnitEl = document.getElementById("mod-xyae_unit");

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
        paginaStile.classList.remove("active");
        btnNuovo.classList.remove("active");
        btnArchivio.classList.remove("active");
        btnStile.classList.remove("active");

        if (pagina === "nuovo") {
            paginaNuovo.classList.add("active");
            btnNuovo.classList.add("active");
        } else if (pagina === "archivio") {
            paginaArchivio.classList.add("active");
            btnArchivio.classList.add("active");
            renderArchivio();
        } else if (pagina === "stile") {
            paginaStile.classList.add("active");
            btnStile.classList.add("active");
        }
    }

    btnNuovo.addEventListener("click", () => mostraPagina("nuovo"));
    btnArchivio.addEventListener("click", () => mostraPagina("archivio"));
    btnStile.addEventListener("click", () => mostraPagina("stile"));

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
            xyae: xyaeEl.value + " " + xyaeUnitEl.value,
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
        xyaeEl.value = "";
        xyaeUnitEl.value = "mm";
        materialeEl.value = "Acciaio";
        refrigeranteEl.value = "Acqua";
        codicefresaEl.value = "";
        codiceinsertoEl.value = "";
        dettagliEl.value = "";
    }

    // ---------------- ARCHIVIO ----------------
    function renderArchivio() {
        listaEl.innerHTML = "";
        const filtro = (ricercaEl.value || "").toLowerCase();

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
                    XY-Ae: ${item.xyae}<br>
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

        const parts = (item.xyae || "").split(" ");
        modXYAeValEl.value = parts[0] || "";
        modXYAeUnitEl.value = parts[1] || "mm";

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

        item.xyae = modXYAeValEl.value + " " + modXYAeUnitEl.value;

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

    // ================= PANNELLO STILE =================
    const styleControls = {
        "--colore-sfondo": "ctrl-colore-sfondo",
        "--colore-testo": "ctrl-colore-testo",
        "--cella-bg": "ctrl-cella-bg",
        "--campo-bg": "ctrl-campo-bg",
        "--card-bg": "ctrl-card-bg",
        "--riga-bg": "ctrl-riga-bg",
        "--nav-bg": "ctrl-nav-bg",
        "--nav-active": "ctrl-nav-active",
        "--btn-salva": "ctrl-btn-salva",
        "--btn-modifica": "ctrl-btn-modifica",
        "--btn-elimina": "ctrl-btn-elimina",
        "--btn-annulla": "ctrl-btn-annulla",
        "--cella-radius": "ctrl-cella-radius",
        "--campo-radius": "ctrl-campo-radius",
        "--card-radius": "ctrl-card-radius",
        "--btn-radius": "ctrl-btn-radius",
        "--campo-padding": "ctrl-campo-padding",
        "--campo-font": "ctrl-campo-font",
        "--card-shadow": "ctrl-card-shadow",
        "--cella-shadow": "ctrl-cella-shadow",
        "--riga-shadow": "ctrl-riga-shadow",
        "--edit-outline": "ctrl-edit-outline",
        "--edit-handle-bg": "ctrl-edit-handle-bg",
        "--edit-handle-size": "ctrl-edit-handle-size",
        "--edit-move-bg": "ctrl-edit-move-bg"
    };

    function setCssVar(name, value) {
        document.documentElement.style.setProperty(name, value);
    }

    function loadSavedStyle() {
        const saved = localStorage.getItem("app-style-vars");
        if (!saved) return;

        const vars = JSON.parse(saved);
        Object.entries(vars).forEach(([name, value]) => {
            setCssVar(name, value);
            const id = styleControls[name];
            if (!id) return;
            const input = document.getElementById(id);
            if (input) input.value = value;
        });
    }

    function saveStyle() {
        const vars = {};
        Object.entries(styleControls).forEach(([name, id]) => {
            const input = document.getElementById(id);
            if (!input) return;
            vars[name] = input.value;
        });
        localStorage.setItem("app-style-vars", JSON.stringify(vars));
    }

    function initStylePanel() {
        loadSavedStyle();
        Object.entries(styleControls).forEach(([name, id]) => {
            const input = document.getElementById(id);
            if (!input) return;
            input.addEventListener("input", () => {
                setCssVar(name, input.value);
                saveStyle();
            });
        });
    }

    initStylePanel();

    function resetStyle() {
        localStorage.removeItem("app-style-vars");
        location.reload();
    }

    window.resetStyle = resetStyle;

    // ================= CSV IMPORT/EXPORT =================
    function exportCsv() {
        if (!archivio.length) {
            alert("Nessuna fresa da esportare.");
            return;
        }

        const header = ["denominazionefresa","diametro","ntaglientiinserti","s","mmin","s_calc","f","av_ad","f_calc","zap","xyae","materiale","refrigerante","codicefresa","codiceinserto","dettagli"];
        const rows = archivio.map(item =>
            header.map(key => `"${String(item[key] ?? "").replace(/"/g, '""')}"`).join(",")
        );

        const csvContent = [header.join(","), ...rows].join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "parametri_frese.csv";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function importCsv(file) {
        const reader = new FileReader();
        reader.onload = e => {
            const text = e.target.result;
            const lines = text.split("\n").filter(l => l.trim().length);
            const header = lines.shift().split(",");

            lines.forEach(line => {
                const cols = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
                if (!cols) return;
                const data = {};
                header.forEach((h, i) => {
                    const key = h.trim();
                    let val = cols[i] || "";
                    val = val.replace(/^"|"$/g, "").replace(/""/g, '"');
                    data[key] = val;
                });

                const existing = archivio.find(f => f.denominazionefresa === data.denominazionefresa && f.diametro === data.diametro);
                if (existing) {
                    Object.assign(existing, data);
                } else {
                    archivio.push(data);
                }
            });

            localStorage.setItem("parametri_frese", JSON.stringify(archivio));
            renderArchivio();
        };
        reader.readAsText(file);
    }

    const btnExportCsv = document.getElementById("btn-export-csv");
    const btnImportCsv = document.getElementById("btn-import-csv");
    const inputImportCsv = document.getElementById("input-import-csv");

    if (btnExportCsv) btnExportCsv.addEventListener("click", exportCsv);
    if (btnImportCsv && inputImportCsv) {
        btnImportCsv.addEventListener("click", () => inputImportCsv.click());
        inputImportCsv.addEventListener("change", e => {
            if (e.target.files[0]) importCsv(e.target.files[0]);
        });
    }

    // ================= CELLE EDITABILI =================
    const editableCells = [
        document.getElementById("zap"),
        document.getElementById("mod-zap"),
        document.getElementById("xyae"),
        document.getElementById("mod-xyae_val")
    ].filter(Boolean);

    editableCells.forEach(cell => {
        const saved = localStorage.getItem("cell-" + cell.id);
        if (saved) {
            const data = JSON.parse(saved);
            cell.style.width = data.width;
            cell.style.height = data.height;
            cell.style.left = data.left;
            cell.style.top = data.top;
            cell.style.position = "absolute";
        }
    });

    function snapToGrid(cell) {
        const snap = 10;
        const rect = cell.getBoundingClientRect();

        if (Math.abs(rect.left) < snap) cell.style.left = "0px";
        if (Math.abs(rect.top) < snap) cell.style.top = "0px";

        const right = window.innerWidth - rect.right;
        if (Math.abs(right) < snap) cell.style.left = (window.innerWidth - rect.width) + "px";

        const bottom = window.innerHeight - rect.bottom;
        if (Math.abs(bottom) < snap) cell.style.top = (window.innerHeight - rect.height) + "px";
    }

    function saveCell(cell) {
        const data = {
            width: cell.style.width,
            height: cell.style.height,
            left: cell.style.left,
            top: cell.style.top
        };
        localStorage.setItem("cell-" + cell.id, JSON.stringify(data));
    }

    function activateEditMode(cell) {
        if (cell.classList.contains("cell-editing")) return;

        cell.classList.add("cell-editing");

        ["right", "left", "top", "bottom"].forEach(side => {
            const handle = document.createElement("div");
            handle.classList.add("resize-handle", side);
            cell.appendChild(handle);

            handle.addEventListener("mousedown", e => {
                e.preventDefault();
                const startX = e.clientX;
                const startY = e.clientY;
                const startWidth = parseInt(window.getComputedStyle(cell).width);
                const startHeight = parseInt(window.getComputedStyle(cell).height);

                function onMove(ev) {
                    if (side === "right") cell.style.width = startWidth + (ev.clientX - startX) + "px";
                    if (side === "left") cell.style.width = startWidth - (ev.clientX - startX) + "px";
                    if (side === "bottom") cell.style.height = startHeight + (ev.clientY - startY) + "px";
                    if (side === "top") cell.style.height = startHeight - (ev.clientY - startY) + "px";
                }

                function onUp() {
                    snapToGrid(cell);
                    saveCell(cell);
                    document.removeEventListener("mousemove", onMove);
                    document.removeEventListener("mouseup", onUp);
                }

                document.addEventListener("mousemove", onMove);
                document.addEventListener("mouseup", onUp);
            });
        });

        const moveHandle = document.createElement("div");
        moveHandle.classList.add("move-handle");
        moveHandle.textContent = "Muovi";
        cell.appendChild(moveHandle);

        moveHandle.addEventListener("mousedown", e => {
            e.preventDefault();
            const startX = e.clientX;
            const startY = e.clientY;
            const rect = cell.getBoundingClientRect();

            cell.style.position = "absolute";

            function onMove(ev) {
                cell.style.left = rect.left + (ev.clientX - startX) + "px";
                cell.style.top = rect.top + (ev.clientY - startY) + "px";
            }

            function onUp() {
                snapToGrid(cell);
                saveCell(cell);
                document.removeEventListener("mousemove", onMove);
                document.removeEventListener("mouseup", onUp);
            }

            document.addEventListener("mousemove", onMove);
            document.addEventListener("mouseup", onUp);
        });
    }

    editableCells.forEach(cell => {
        let pressTimer;
        cell.addEventListener("mousedown", () => {
            pressTimer = setTimeout(() => activateEditMode(cell), 1000);
        });
        cell.addEventListener("mouseup", () => clearTimeout(pressTimer));
        cell.addEventListener("mouseleave", () => clearTimeout(pressTimer));
    });

    function resetLayout() {
        editableCells.forEach(cell => {
            localStorage.removeItem("cell-" + cell.id);
            cell.style.width = "";
            cell.style.height = "";
            cell.style.left = "";
            cell.style.top = "";
            cell.classList.remove("cell-editing");
        });
        location.reload();
    }

    window.resetLayout = resetLayout;

    renderArchivio();
});
