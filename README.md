# Parametri Frese  
Gestione avanzata dei parametri di taglio per frese, con archivio locale, calcoli automatici, ordinamento intelligente e supporto PWA.

---

## ✨ Funzionalità principali

### 🧮 Calcoli automatici
- **M/min** calcolato da S e Diametro  
- **S calcolata** da M/min  
- **F calcolata (mm/min)** da avanzamento, taglienti e giri/min  
- Aggiornamento dinamico in tempo reale

---

## 📝 Inserimento parametri
- Denominazione fresa  
- Diametro  
- Numero taglienti  
- S, M/min e S calcolata  
- F, Avanzamento e F calcolata  
- Z-Ap  
- XY-Ae  
- Materiale (menu dinamico da JSON)  
- Refrigerante (menu dinamico da JSON)  
- Codice fresa  
- Codice inserto  
- Note e dettagli  

---

## 📚 Archivio locale avanzato
- Salvataggio automatico in memoria locale  
- Lista utensili con dettagli completi  
- **Popup di modifica** stile VisionOS  
- Aggiornamento immediato dei calcoli dopo modifica  
- Nessuna dipendenza esterna

---

## 🔎 Ordinamento archivio (nuovo)
Menu a tendina con scelta del criterio:

- Diametro  
- Materiale  
- Codice fresa  
- Refrigerante  
- Velocità di taglio (M/min)  
- Avanzamento (F calcolata)

E selezione dell’ordine:

- **Crescente**  
- **Decrescente**

L’archivio si aggiorna automaticamente.

---

## 🧩 Materiali e refrigeranti dinamici (materials.json)
Il file `materials.json` permette di gestire:

- categorie  
- materiali più usati in fresatura  
- refrigeranti CNC (interno/esterno)  
- compatibilità con strategie  
- colori e icone (testuali)

Esempio:

```json
{
  "materiali": [
    "Acciaio C45",
    "Acciaio Inox",
    "Acciaio Temprato",
    "Alluminio",
    "Titanio",
    "Ghisa",
    "Bronzo",
    "Ottone",
    "Plastica Tecnica"
  ],
  "refrigeranti": [
    "Emulsione interna",
    "Emulsione esterna",
    "Olio intero",
    "Nebbia d’olio",
    "Aria interna",
    "Aria esterna",
    "Secco"
  ]
}
