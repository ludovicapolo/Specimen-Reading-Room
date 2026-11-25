// Ponte locale per collegare Specimen Reading Room a Notion.
// Local bridge connecting Specimen Reading Room to Notion.
//
// L'API di Notion non accetta chiamate dirette dal browser: questo piccolo
// server mostra la pagina e inoltra le richieste per conto suo.
// Non contiene credenziali: token e ID del database li inserisci nella pagina,
// e vengono inoltrati solo a api.notion.com.
//
//   node proxy-notion.mjs
//   poi apri / then open  http://localhost:8000
//
// Richiede Node.js 18 o successivo. Metti questo file nella stessa cartella
// di specimen-reading-room.html.

import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { isIP } from 'node:net';

const PORT = Number(process.env.PORT) || 8000;
const HOST = '127.0.0.1';                       // raggiungibile solo da questo computer
const CARTELLA = dirname(fileURLToPath(import.meta.url));
const PAGINA = 'specimen-reading-room.html';

// Indirizzi privati o locali: il ponte non scarica mai da qui
function indirizzoInterno(host) {
  const h = host.replace(/^\[|\]$/g, '').toLowerCase();
  if (h === 'localhost' || h.endsWith('.localhost') || h.endsWith('.local')) return true;
  if (isIP(h) === 4) {
    const [a, b] = h.split('.').map(Number);
    return a === 10 || a === 127 || a === 0 || (a === 169 && b === 254) ||
           (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168) || a >= 224;
  }
  if (isIP(h) === 6) return h === '::1' || h.startsWith('fc') || h.startsWith('fd') || h.startsWith('fe80');
  return false;
}

function leggiCorpo(req) {
  return new Promise((ok, ko) => {
    let b = ''; req.on('data', c => { b += c; if (b.length > 1e6) ko(new Error('Richiesta troppo grande')); });
    req.on('end', () => ok(b)); req.on('error', ko);
  });
}

createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost');

    // 1. Richieste all'API di Notion: solo verso api.notion.com
    if (url.pathname.startsWith('/notion/')) {
      const corpo = await leggiCorpo(req);
      const r = await fetch('https://api.notion.com/v1/' + url.pathname.slice(8) + url.search, {
        method: req.method,
        headers: {
          'Authorization': req.headers['authorization'] || '',
          'Notion-Version': req.headers['notion-version'] || '2022-06-28',
          'Content-Type': 'application/json'
        },
        body: ['GET', 'HEAD'].includes(req.method) ? undefined : (corpo || '{}')
      });
      res.writeHead(r.status, { 'Content-Type': 'application/json' });
      return res.end(await r.text());
    }

    // 2. Scaricamento delle immagini: gli indirizzi firmati di Notion scadono
    //    dopo un'ora e non sono raggiungibili direttamente dalla pagina.
    //    Solo indirizzi https pubblici.
    if (url.pathname === '/file') {
      const indirizzo = url.searchParams.get('url');
      let dest;
      try { dest = new URL(indirizzo); } catch { return res.writeHead(400).end('Indirizzo non valido'); }
      if (dest.protocol !== 'https:' || indirizzoInterno(dest.hostname))
        return res.writeHead(403).end('Indirizzo non consentito');
      const r = await fetch(dest, { redirect: 'follow' });
      const buf = Buffer.from(await r.arrayBuffer());
      res.writeHead(r.status, { 'Content-Type': r.headers.get('content-type') || 'image/jpeg' });
      return res.end(buf);
    }

    // 3. La pagina del programma, e nient'altro dal computer
    if (url.pathname === '/' || url.pathname === '/' + PAGINA) {
      const dati = await readFile(join(CARTELLA, PAGINA));
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      return res.end(dati);
    }
    res.writeHead(404).end('Non trovato');
  } catch (e) {
    if (!res.headersSent) res.writeHead(502, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Errore del ponte: ' + e.message);
  }
}).listen(PORT, HOST, () => {
  console.log('Specimen Reading Room: http://localhost:' + PORT);
  console.log('Lascia aperta questa finestra finché usi il programma. / Keep this window open while you use the program.');
});
