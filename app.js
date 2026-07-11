// ===============================
// PARAMETRI FRESE
// Versione 1.0
// ===============================

let archivio = JSON.parse(localStorage.getItem("parametriFrese")) || [];

const fresa = document.getElementById("fresa");
const pastiglie = document.getElementById("pastiglie");
const sm = document.getElementById("sm");
const fm = document.getElementById("fm");
const zap = document.getElementById("zap");
const materiale = document.getElementById("materiale");
const refrigerante = document.getElementById("refrigerante");
const dettagli = document.getElementById("dettagli");

const lista = document.getElementById("lista");
const ricerca = document.getElementById("ricerca");

document.getElementById("salva").addEventListener("click", salva);

document.getElementById("csv").addEventListener("click", esportaCSV);

ricerca.addEventListener("input", mostraArchivio);

// =========================================
// ESPORTA CSV COMPATIBILE NUMBERS
// =========================================

function esportaCSV() {

    if (archivio.length === 0) {
        alert("Nessun dato da esportare.");
        return;
    }

    const intestazioni = [
        "Fresa",
        "Pastiglie",
        "S-M/Minuto",
        "F-Mm/Dente",
        "Z-Ap",
        "Materiale",
        "Refrigerante",
        "Dettagli"
    ];

    let csv = "\uFEFF"; // BOM UTF-8 per Numbers

    csv += intestazioni.join(";") + "\n";

    archivio.forEach(r => {

        let riga = [

            r.fresa,

            r.pastiglie,

            r.sm,

            r.fm,

            r.zap,

            r.materiale,

            r.refrigerante,

            r.dettagli

        ].map(valore => {

            if (valore == null)
                valore = "";

            valore = valore.toString();

            valore = valore.replace(/"/g,'""');

            return `"${valore}"`;

        });

        csv += riga.join(";") + "\n";

    });

    const blob = new Blob(
        [csv],
        {
            type:"text/csv;charset=utf-8;"
        }
    );

    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);

    link.download = "Parametri Frese.csv";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(link.href);

}


// ===============================
// SALVA
// ===============================

function salva(){

    if(fresa.value.trim()==""){
        alert("Inserisci il nome della fresa");
        return;
    }

    let record={

        id:Date.now(),

        fresa:fresa.value,

        pastiglie:pastiglie.value,

        sm:sm.value,

        fm:fm.value,

        zap:zap.value,

        materiale:materiale.value,

        refrigerante:refrigerante.value,

        dettagli:dettagli.value

    };

    archivio.push(record);

    salvaArchivio();

    pulisciCampi();

    mostraArchivio();

}



// ===============================
// LOCAL STORAGE
// ===============================

function salvaArchivio(){

    localStorage.setItem(

        "parametriFrese",

        JSON.stringify(archivio)

    );

}



// ===============================
// PULISCI CAMPI
// ===============================

function pulisciCampi(){

    fresa.value="";

    pastiglie.value="";

    sm.value="";

    fm.value="";

    zap.value="";

    dettagli.value="";

}



// ===============================
// MOSTRA ARCHIVIO
// ===============================

function mostraArchivio(){

    lista.innerHTML="";

    let testo=ricerca.value.toLowerCase();

    archivio

    .filter(r=>{

        return (

            r.fresa.toLowerCase().includes(testo)

            ||

            r.materiale.toLowerCase().includes(testo)

            ||

            r.pastiglie.toLowerCase().includes(testo)

        );

    })

    .forEach(r=>{

        let card=document.createElement("div");

        card.className="record";

        card.innerHTML=`

        <h3>${r.fresa}</h3>

        <p><b>Pastiglie:</b> ${r.pastiglie}</p>

        <p><b>S-M/Min:</b> ${r.sm}</p>

        <p><b>F-Mm/Dente:</b> ${r.fm}</p>

        <p><b>Z-Ap:</b> ${r.zap}</p>

        <p><b>Materiale:</b> ${r.materiale}</p>

        <p><b>Refrigerante:</b> ${r.refrigerante}</p>

        <p>${r.dettagli}</p>

        <div class="actions">

            <button class="modifica"

            onclick="modifica(${r.id})">

            Modifica

            </button>

            <button class="elimina"

            onclick="elimina(${r.id})">

            Elimina

            </button>

        </div>

        `;

        lista.appendChild(card);

    });

}



// ===============================
// ELIMINA
// ===============================

function elimina(id){

    if(!confirm("Eliminare questo record?"))

        return;

    archivio=archivio.filter(

        r=>r.id!=id

    );

    salvaArchivio();

    mostraArchivio();

}



// ===============================
// MODIFICA
// ===============================

function modifica(id){

    let r=archivio.find(

        x=>x.id==id

    );

    if(!r) return;

    fresa.value=r.fresa;

    pastiglie.value=r.pastiglie;

    sm.value=r.sm;

    fm.value=r.fm;

    zap.value=r.zap;

    materiale.value=r.materiale;

    refrigerante.value=r.refrigerante;

    dettagli.value=r.dettagli;

    elimina(id);

}



// ===============================
// AVVIO
// ===============================

mostraArchivio();

// ===================================
// REGISTRA SERVICE WORKER
// ===================================

if ("serviceWorker" in navigator) {

    window.addEventListener("load", () => {

        navigator.serviceWorker

            .register("./service-worker.js")

            .then(() => {

                console.log("Service Worker registrato");

            })

            .catch(err => {

                console.error(err);

            });

    });

}
