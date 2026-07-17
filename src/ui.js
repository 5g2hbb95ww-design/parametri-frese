export function renderUI() {
    const app = document.getElementById("app");

    app.innerHTML = `
        <header class="app-header">
            <h1>Parametri Frese</h1>
        </header>

        <section class="calculator">
            <label>Diametro (mm)
                <input id="diameter" type="number" min="1" step="0.1">
            </label>

            <label>Velocità di taglio (m/min)
                <input id="cuttingSpeed" type="number" min="1">
            </label>

            <label>Denti
                <input id="teeth" type="number" min="1">
            </label>

            <label>Fz (mm)
                <input id="feedPerTooth" type="number" min="0.01" step="0.01">
            </label>

            <button id="calculateBtn" class="primary-btn">Calcola</button>
        </section>

        <section id="results" class="results"></section>
    `;
}

export function updateResults(rpm, feedrate) {
    document.getElementById("results").innerHTML = `
        <h2>Risultati</h2>
        <p><strong>RPM:</strong> ${rpm}</p>
        <p><strong>Avanzamento:</strong> ${feedrate} mm/min</p>
    `;
}
