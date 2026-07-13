// Chiave LocalStorage
const STORAGE_KEY = 'parametri_frese';

// Elementi DOM
const nomeEl = document.getElementById('nome');
const materialeEl = document.getElementById('materiale');
const diametroEl = document.getElementById('diametro');
const zEl = document.getElementById('z');
const vcEl = document.getElementById('vc');
const fzEl = document.getElementById('fz');

const outNEl = document.getElementById('out-n');
const outVfEl = document.getElementById('out-vf');

const btnCalcola = document.getElementById('btn-calcola');
const btnArchive = document.getElementById('btn-archive');
const archiveCard = document.getElementById('archive-card');
const archiveList = document.getElementById('archive-list');
const btnCloseArchive = document.getElementById('btn-close-archive');

// Calcolo parametri
function calcolaParametri() {
    const nome = nomeEl.value.trim();
    const materiale = materialeEl.value.trim();
    const diametro = parseFloat(diametroEl.value);
    const z = parseInt(zEl.value, 10);
    const vc = parseFloat(vcEl.value);
    const fz = parseFloat(fzEl.value);

    if (!nome || isNaN(diametro) || isNaN(z) || isNaN(vc) || isNaN(fz)) {
        alert('Compila almeno nome, diametro, Z, Vc e fz.');
        return null;
    }

    // n = (1000 * Vc) / (π * D)
    const n = Math.round((1000 * vc) / (Math.PI * diametro));

    // Vf = n * Z * fz
    const vf = Math.round(n * z * fz);

    outNEl.textContent = n;
    outVfEl.textContent = vf;

    return {
        id: Date.now(),
        nome,
        materiale,
        diametro,
        z,
        vc,
        fz,
        n,
        vf,
        createdAt: new Date().toISOString()
    };
}

// Gestione LocalStorage
function loadArchivio() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    try {
        return JSON.parse(raw);
    } catch {
        return [];
    }
}

function saveArchivio(items) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function aggiungiParametro(item) {
    const items = loadArchivio();
    items.push(item);
    saveArchivio(items);
}

function eliminaParametro(id) {
    const items = loadArchivio().filter(i => i.id !== id);
    saveArchivio(items);
    renderArchivio();
}

// Render archivio
function renderArchivio() {
    const items = loadArchivio();
    archiveList.innerHTML = '';

    if (items.length === 0) {
        archiveList.textContent = 'Nessun parametro salvato.';
        return;
    }

    items.slice().reverse().forEach(item => {
        const div = document.createElement('div');
        div.className = 'item';

        const title = document.createElement('div');
        title.className = 'item-title';
        title.textContent = item.nome;

        const meta = document.createElement('div');
        meta.className = 'item-meta';
        meta.textContent =
            `Mat: ${item.materiale || '-'} | D: ${item.diametro} mm | Z: ${item.z} | Vc: ${item.vc} | fz: ${item.fz}`;

        const results = document.createElement('div');
        results.className = 'item-meta';
        results.textContent = `n: ${item.n} rpm | Vf: ${item.vf} mm/min`;

        const actions = document.createElement('div');
        actions.className = 'item-actions';

        const btnDelete = document.createElement('button');
        btnDelete.className = 'btn-secondary';
        btnDelete.textContent = 'Elimina';
        btnDelete.onclick = () => eliminaParametro(item.id);

        actions.appendChild(btnDelete);

        div.appendChild(title);
        div.appendChild(meta);
        div.appendChild(results);
        div.appendChild(actions);

        archiveList.appendChild(div);
    });
}

// Eventi
btnCalcola.addEventListener('click', () => {
    const item = calcolaParametri();
    if (item) {
        aggiungiParametro(item);
    }
});

btnArchive.addEventListener('click', () => {
    archiveCard.style.display = 'block';
    renderArchivio();
});

btnCloseArchive.addEventListener('click', () => {
    archiveCard.style.display = 'none';
});

// Registrazione Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker
            .register('service-worker.js')
            .catch(err => console.error('SW registration failed', err));
    });
}
