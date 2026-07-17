import { renderUI, updateResults } from "./ui.js";
import data from "./data.json" assert { type: "json" };

// --- Calcoli tecnici ---
function calculateRPM(diameter, cuttingSpeed) {
    return Math.round((1000 * cuttingSpeed) / (Math.PI * diameter));
}

function calculateFeedrate(rpm, teeth, feedPerTooth) {
    return Math.round(rpm * teeth * feedPerTooth);
}

// --- Storage ---
function save(data) {
    localStorage.setItem("pf-data", JSON.stringify(data));
}

function load() {
    const raw = localStorage.getItem("pf-data");
    return raw ? JSON.parse(raw) : null;
}

// --- Validazione ---
function valid(n) {
    return !isNaN(n) && n > 0;
}

// --- Inizializzazione ---
document.addEventListener("DOMContentLoaded", () => {
    renderUI();

    const btn = document.getElementById("calculateBtn");

    btn.addEventListener("click", () => {
        const diameter = Number(document.getElementById("diameter").value);
        const cuttingSpeed = Number(document.getElementById("cuttingSpeed").value);
        const teeth = Number(document.getElementById("teeth").value);
        const feedPerTooth = Number(document.getElementById("feedPerTooth").value);

        if (![diameter, cuttingSpeed, teeth, feedPerTooth].every(valid)) {
            alert("Inserisci valori validi");
            return;
        }

        const rpm = calculateRPM(diameter, cuttingSpeed);
        const feedrate = calculateFeedrate(rpm, teeth, feedPerTooth);

        save({ rpm, feedrate });
        updateResults(rpm, feedrate);
    });

    const saved = load();
    if (saved) updateResults(saved.rpm, saved.feedrate);
});
