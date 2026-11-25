# Specimen Reading Room

*[English → README.md](README.md)*

Specimen Reading Room è uno strumento per la lettura assistita degli specimen tipografici. Legge le fotografie di uno specimen con un modello di intelligenza artificiale (Google Gemini) e compila una griglia di osservazione a vocabolario chiuso: struttura della copertina, ruolo dell'immagine, palette, sezioni interne, esempi applicativi. La scheda resta verificabile e correggibile, anche confrontandola con una codifica fatta a mano "alla cieca".

## Contesto di ricerca

Specimen Reading Room è stato sviluppato da Ludovica Polo nell'ambito della sua ricerca di dottorato:

> Ludovica Polo, *La mediazione della tipografia in Europa e Italia: specimen ed ephemera promozionali per una storiografia tra type e graphic design (1952–1978)*, tesi di dottorato in corso, Dottorato in Culture del progetto (XXXIX ciclo), Università Iuav di Venezia. Supervisore: Maddalena Dalla Mura; co-supervisori: Fiorella Bulegato, Alessandro Colizzi. Borsa di dottorato PNRR in collaborazione con Tipoteca Italiana Fondazione.

Gli aspetti metodologici alla base della griglia di osservazione (come sono stati individuati i parametri, la definizione di ciascun valore e i criteri per applicarli) sono trattati nella tesi. Lo strumento mette in pratica quella griglia, non ne sostituisce la discussione.

## Scaricare

**[Scarica l'ultima versione (.zip)](../../releases/latest/download/specimen-reading-room.zip)**

Il programma è un solo file, `specimen-reading-room.html`. Non si installa niente: si apre nel browser (Chrome, Firefox, Safari, Edge). L'interfaccia è in italiano e in inglese: il pulsante **EN** in alto a destra cambia lingua.

## 1. Prima di cominciare: la chiave

Per far lavorare il modello serve una chiave di Google.

1. Vai su <https://aistudio.google.com> e accedi con un account Google.
2. Clicca **Get API key** e crea una chiave. Copiala (inizia con `AIza…`).
3. Nel programma clicca **Impostazioni** in alto a destra, incolla la chiave nel primo campo, scegli il modello (se non sai quale, lascia quello proposto) e clicca **Salva**.

La chiave resta nel tuo browser e viene inviata solo a Google. Il menu propone sia modelli gratuiti sia modelli a pagamento, soggetti a disponibilità e modifiche da parte di Google.

## 2. Caricare gli specimen

Ci sono due modi. Se è la prima volta, comincia dal **2a**: basta una cartella di foto e funziona subito. Il **2b** serve solo se i tuoi specimen sono già schedati in un database Notion.

### 2a. Dal computer (consigliato)

Prepara le cartelle così:

```
i-miei-specimen/            ← cartella principale
    Mistral_Olive_1955/     ← uno specimen = una cartella
        01.jpg              ← la prima immagine è la copertina
        02.jpg
        03.jpg
    Eurostile_Nebiolo/
        01.jpg
        02.jpg
```

- Il nome della cartella diventa il nome dello specimen.
- Le immagini vengono ordinate per nome: conviene numerarle (01, 02, 03…).
- Formati: jpg, png, webp e altri comuni. Le foto heic dell'iPhone funzionano, ma l'anteprima si vede solo in Safari.

Nel programma, nella scheda **Caricamento**, clicca **Carica cartelle** e seleziona la cartella **principale**, non una singola cartella di specimen.

**Prova con gli esempi.** Il pacchetto scaricato contiene una cartella `examples` con tre specimen (Armonia, Caprice, Pascal). Carica la cartella `examples` per vedere come funziona lo strumento prima di usare il tuo materiale.

*Facoltativo: metadati da una tabella.* Clicca **Metadati** e scegli un file CSV. La prima colonna deve contenere il nome della cartella di ogni specimen; le altre colonne (anno, fonderia, nazione…) vengono agganciate alla scheda. Va bene anche il CSV esportato da un database Notion.

### 2b. Da Notion (in alternativa)

Se i tuoi specimen sono schedati in un database Notion, il programma può leggerli direttamente, foto comprese. Serve qualche passaggio in più, da fare una volta sola.

**A. Installa Node.js** da <https://nodejs.org> (versione "LTS").

**B. Crea un'integrazione Notion**
1. Vai su <https://www.notion.so/profile/integrations>, crea una nuova integrazione interna e copia il token (inizia con `ntn_…`).
2. Apri il tuo database in Notion, clicca **•••** in alto a destra, poi **Connessioni**, e aggiungi l'integrazione.
3. Copia l'ID del database: è la sequenza di 32 caratteri nell'indirizzo della pagina, prima di `?v=`.

**C. Come deve essere fatto il database**
- Il **titolo** di ogni pagina diventa il nome dello specimen.
- Le foto devono stare in una proprietà di tipo "File e media" (per esempio `Foto`). La prima foto è la copertina.
- Le altre proprietà diventano metadati. Il programma riconosce questi nomi: `anno`, `nazione`, `Fonderia`, `Distributore`, `Progetto grafico`, `Archivio`, `Tipologia`, `Rilegatura`, `Tecnologia`, `lingue`, `colori`, `Dimensioni da chiuso`, `Esempi applicativi`, `Descrizione carattere`. Le proprietà con altri nomi vengono importate lo stesso.

**D. Avvia il programma con il ponte per Notion.** Il browser da solo non può parlare con Notion: serve il piccolo programma `proxy-notion.mjs`, incluso nel pacchetto.
1. Apri il Terminale (Mac) o il Prompt dei comandi (Windows) nella cartella del programma.
2. Scrivi `node proxy-notion.mjs` e premi Invio.
3. Apri il browser all'indirizzo <http://localhost:8000>. Lascia il Terminale aperto finché usi il programma.

**E. Sincronizza.** Nella colonna a sinistra scegli la scheda **Notion**, apri **Credenziali**, incolla token e ID del database e clicca **Sincronizza**. *Importa solo dove* serve a importare solo una parte del database (per esempio `Tipologia` = `specimen`). I link alle foto di Notion scadono dopo un'ora: a ogni sessione le immagini vengono scaricate di nuovo.

## 3. Analizzare

**Scheda** (un solo specimen)
1. Scegli uno specimen dall'elenco a sinistra.
2. Controlla la copertina: è l'immagine con il bordo colorato. Per cambiarla passa sopra un'altra immagine e clicca **copertina**.
3. Clicca **Analizza**. Dopo qualche secondo compaiono la griglia, una descrizione, le parole chiave e le incertezze del modello.
4. Se un valore è sbagliato, correggilo dal menu nella griglia. La correzione viene registrata accanto al valore del modello.

**Codifica alla cieca** (consigliata per verificare il modello). Compila tu la griglia *prima* di cliccare **Analizza**. Dopo l'analisi il programma evidenzia i punti in cui tu e il modello non siete d'accordo.

**Scheda Metadati.** Mostra i dati d'archivio dello specimen. **Estrai evidenze** chiede al modello di trascrivere ciò che è stampato sull'artefatto (fonderia, indirizzi, date, sigle). Sono proposte: diventano metadati solo se clicchi **Accetta**.

**Corpus** (tutti gli specimen)
- **Elenco**: tutti gli specimen in tabella, con filtri. **Analizza i non analizzati** li analizza in serie.
- **Ricorrenze**: conta quante volte ricorre un valore, o incrocia due caratteristiche in una tabella.
- **Discrepanze**: accordo tra la tua codifica alla cieca e il modello, correzioni fatte e incertezze dichiarate.

## 4. Salvare il lavoro

- Analisi e correzioni restano nel browser che stai usando, ma possono andare perse (pulizia del browser, altro computer, spazio esaurito).
- Le immagini **non** vengono salvate: a ogni sessione ricarica le cartelle (o risincronizza Notion). I risultati si riagganciano da soli, perché sono legati al nome dello specimen.

Per conservare davvero il lavoro: **Impostazioni → Esporta JSON** (tutto) oppure **Esporta CSV** (una tabella da aprire in un foglio di calcolo). Fallo spesso.

## 5. Se qualcosa non va

| Messaggio | Cosa fare |
| --- | --- |
| *Manca la chiave API* | Inseriscila in Impostazioni e clicca Salva. |
| *Limite di richieste raggiunto*, errore 429, *quota* | Sul piano gratuito c'è un limite al minuto: aspetta e riprova. Se compare sempre con lo stesso modello, quel modello è a pagamento e la tua chiave è gratuita: scegline un altro. |
| *Risposta interrotta (MAX_TOKENS)* | Alza *Limite di token in uscita* in Impostazioni (per es. 16384). |
| *Nessuna immagine trovata*, o un solo specimen invece di tanti | Hai selezionato una cartella di specimen invece della cartella principale. |
| *Notion non raggiungibile* | Il ponte non è avviato, oppure hai aperto il file con un doppio clic invece che da <http://localhost:8000>. Vedi il punto 2b, passo D. |
| Non sai quali modelli puoi usare | Impostazioni → **Verifica con la mia chiave**: i modelli che la tua chiave non può usare vengono segnalati nel menu. |

## Come citarlo

Usa il pulsante **Cite this repository** in questa pagina, oppure i dati in [`CITATION.cff`](CITATION.cff).

## Licenza

Codice rilasciato con [licenza MIT](LICENSE). Documentazione rilasciata con licenza [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
