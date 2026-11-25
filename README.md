# Specimen Reading Room

*[Italiano → LEGGIMI.md](LEGGIMI.md)*

Specimen Reading Room is a tool for the assisted reading of type specimens. It reads photographs of a specimen with an AI model (Google Gemini) and fills in a closed-vocabulary observation grid: cover structure, role of the image, palette, interior sections, application examples. The record stays open to verification and correction, including comparison with a manual "blind" coding.

## Research context

Specimen Reading Room was developed by Ludovica Polo within her doctoral research:

> Ludovica Polo, *La mediazione della tipografia in Europa e Italia: specimen ed ephemera promozionali per una storiografia tra type e graphic design (1952–1978)*, PhD thesis in progress, Dottorato in Culture del progetto (XXXIX cycle), Università Iuav di Venezia. Supervisor: Maddalena Dalla Mura; co-supervisors: Fiorella Bulegato, Alessandro Colizzi. PNRR doctoral scholarship in collaboration with Tipoteca Italiana Fondazione.

The methodological framework behind the observation grid (how its parameters were identified, the definition of each value, and the criteria for applying them) is set out in the thesis. The tool puts that grid into practice; it does not replace its discussion.

## Download

**[Download the latest version (.zip)](../../releases/latest/download/specimen-reading-room.zip)**

The program is a single file, `specimen-reading-room.html`. Nothing to install: it opens in your browser (Chrome, Firefox, Safari, Edge). The interface is in Italian and English: click **EN** at the top right to switch.

## 1. Before you start: the key

The model needs a Google API key.

1. Go to <https://aistudio.google.com> and sign in with a Google account.
2. Click **Get API key** and create a key. Copy it (it starts with `AIza…`).
3. In the program, click **Settings** at the top right, paste the key into the first field, choose a model (if unsure, keep the one proposed) and click **Save**.

The key stays in your browser and is sent only to Google. The menu offers both free and paid models, subject to availability and changes by Google.

## 2. Loading the specimens

There are two ways. If this is your first time, start with **2a**: all you need is a folder of photos. **2b** is only for specimens already catalogued in a Notion database.

### 2a. From your computer (recommended)

Arrange your folders like this:

```
my-specimens/               ← main folder
    Mistral_Olive_1955/     ← one specimen = one folder
        01.jpg              ← the first image is the cover
        02.jpg
        03.jpg
    Eurostile_Nebiolo/
        01.jpg
        02.jpg
```

- The folder name becomes the name of the specimen.
- Images are sorted by file name: number them (01, 02, 03…).
- Formats: jpg, png, webp and other common ones. iPhone heic photos work, but their previews only show in Safari.

In the program, on the **Upload** tab, click **Load folders** and select the **main** folder, not a single specimen folder.

**Try it with the examples.** The downloaded package includes an `examples` folder with three specimens (Armonia, Caprice, Pascal). Load the `examples` folder itself to see how the tool works before using your own material.

*Optional: metadata from a table.* Click **Metadata** and choose a CSV file. The first column must contain the folder name of each specimen; the other columns (year, foundry, country…) are attached to the record. A CSV exported from a Notion database works too.

### 2b. From Notion (alternative)

If your specimens are catalogued in a Notion database, the program can read them directly, photos included. It takes a few extra steps, to be done only once.

**A. Install Node.js** from <https://nodejs.org> ("LTS" version).

**B. Create a Notion integration**
1. Go to <https://www.notion.so/profile/integrations>, create a new internal integration and copy its token (it starts with `ntn_…`).
2. Open your database in Notion, click **•••** at the top right, then **Connections**, and add the integration.
3. Copy the database ID: the 32-character string in the page address, before `?v=`.

**C. How the database should be set up**
- The **title** of each page becomes the name of the specimen.
- Photos must be in a "Files & media" property (for example `Foto`). The first photo is the cover.
- The other properties become metadata. The program recognises these names (in Italian, as in the original database): `anno`, `nazione`, `Fonderia`, `Distributore`, `Progetto grafico`, `Archivio`, `Tipologia`, `Rilegatura`, `Tecnologia`, `lingue`, `colori`, `Dimensioni da chiuso`, `Esempi applicativi`, `Descrizione carattere`. Properties with other names are imported anyway.

**D. Start the program with the Notion bridge.** The browser cannot talk to Notion on its own: it needs the small program `proxy-notion.mjs`, included in the package.
1. Open Terminal (Mac) or Command Prompt (Windows) in the program's folder.
2. Type `node proxy-notion.mjs` and press Enter.
3. Open your browser at <http://localhost:8000>. Keep the Terminal open while you use the program.

**E. Sync.** In the left column choose the **Notion** tab, open **Credentials**, paste the token and the database ID, and click **Sync**. *Import only where* lets you import only part of the database (for example `Tipologia` = `specimen`). Notion photo links expire after one hour, so images are downloaded again at every session.

## 3. Analysing

**Record** (one specimen)
1. Choose a specimen from the list on the left.
2. Check the cover: it is the image with the coloured border. To change it, hover over another image and click **cover**.
3. Click **Analyse**. After a few seconds the grid appears, with a description, keywords and the model's uncertainties.
4. If a value is wrong, correct it from the menu in the grid. The correction is recorded next to the model's value.

**Blind coding** (recommended to test the model). Fill in the grid yourself *before* clicking **Analyse**. After the analysis the program highlights where you and the model disagree.

**Metadata tab.** Shows the archival data of the specimen. **Extract evidence** asks the model to transcribe what is printed on the artefact (foundry, addresses, dates, codes). These are suggestions: they become metadata only if you click **Accept**.

**Corpus** (all specimens)
- **List**: all specimens in a table, with filters. **Analyse the unanalysed** processes them in a batch.
- **Frequencies**: counts how often a value occurs, or crosses two features in a table.
- **Discrepancies**: agreement between your blind coding and the model, corrections made, and uncertainties declared.

Texts written by the model (description, theme, reasons for uncertainties) are in Italian, the language in which the grid was defined and validated.

## 4. Saving your work

- Analyses and corrections stay in the browser you are using, but they can be lost (browser cleanup, another computer, storage full).
- Images are **not** saved: at every session load the folders again (or sync Notion again). Results reattach automatically, because they are linked to the name of the specimen.

To keep your work: **Settings → Export JSON** (everything) or **Export CSV** (a table to open in a spreadsheet). Do it often.

## 5. Troubleshooting

| Message | What to do |
| --- | --- |
| *API key missing* | Enter it in Settings and click Save. |
| *Request limit reached*, error 429, *quota* | The free plan has a per-minute limit: wait and try again. If it always appears with the same model, that model is paid and your key is free: choose another one. |
| *Response cut off (MAX_TOKENS)* | Raise *Output token limit* in Settings (e.g. 16384). |
| *No images found*, or one specimen instead of many | You selected a specimen folder instead of the main folder. |
| *Notion not reachable* | The bridge is not running, or you opened the file with a double click instead of from <http://localhost:8000>. See 2b, step D. |
| Not sure which models you can use | Settings → **Check with my key**: models your key cannot use are flagged in the menu. |

## How to cite

Use the **Cite this repository** button on this page, or the data in [`CITATION.cff`](CITATION.cff).

## License

Code released under the [MIT License](LICENSE). Documentation released under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
