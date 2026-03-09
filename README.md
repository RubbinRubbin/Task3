# SentimentAI

Applicazione full-stack che analizza il sentimento di recensioni testuali utilizzando le API di OpenAI con **Structured Output**. Il frontend simula una pagina prodotto e-commerce con recensioni analizzabili in tempo reale.

## Demo

L'applicazione mostra una pagina prodotto (cuffie wireless "SoundPro X1") con ~30 recensioni pre-caricate. L'utente può:

- **Analizzare** tutte le recensioni con un click, ottenendo il **sentiment individuale** per ogni singola recensione con motivazione e punteggio di confidenza
- **Generare nuove recensioni** casuali tramite OpenAI per dimostrare che l'analisi funziona su qualsiasi input

Ogni recensione analizzata mostra:
- **Sentiment**: positivo, negativo o neutro
- **Motivazione**: breve spiegazione del perché è stato assegnato quel sentiment
- **Confidenza**: quanto il modello è certo della classificazione (0-100%)

## Architettura

```
┌─────────────┐     HTTP/JSON     ┌──────────────┐     Structured     ┌──────────┐
│   Frontend   │ ───────────────> │   Backend    │ ──── Output ─────> │  OpenAI  │
│  React+Vite  │ <─────────────── │   Express    │ <───────────────── │  GPT-4o  │
│  Tailwind    │                  │  TypeScript  │   Zod Validation   │   mini   │
└─────────────┘                   └──────────────┘                    └──────────┘
```

### Backend (`/backend`)

| Modulo | Descrizione |
|---|---|
| `src/index.ts` | Entry point Express con CORS |
| `src/routes/analyze.ts` | `POST /api/analyze` — analisi sentimento per-recensione |
| `src/routes/generate.ts` | `POST /api/generate` — generazione recensioni casuali |
| `src/services/openai.ts` | Integrazione OpenAI con Structured Output e retry |
| `src/schemas.ts` | Schema Zod per validazione input/output |
| `src/lib/retry.ts` | Retry con exponential backoff per errori transitori |
| `src/lib/errors.ts` | Classi di errore personalizzate |
| `src/lib/config.ts` | Validazione variabili d'ambiente (fail-fast) |

### Frontend (`/frontend`)

| Componente | Descrizione |
|---|---|
| `ProductHero` | Card prodotto con immagine, prezzo, features |
| `ReviewSection` | Orchestratore: lista recensioni, bottoni, stato e risultati individuali |
| `SentimentCard` | Card singola recensione con sentiment, motivazione e barra confidenza |

## Scelte Tecniche

### Structured Output con Zod

L'integrazione con OpenAI utilizza `zodResponseFormat` per garantire che il modello restituisca **sempre** output nel formato atteso. Lo schema Zod funge da contratto tra il modello AI e l'applicazione:

```typescript
const response = await client.beta.chat.completions.parse({
  model: "gpt-4o-mini",
  response_format: zodResponseFormat(ReviewAnalysisArraySchema, "sentiment_analysis"),
  // ...
});
```

Questo approccio:
- Elimina il parsing manuale di JSON
- Garantisce type-safety a compile-time e a runtime
- Gestisce automaticamente i casi di refusal del modello

### Analisi Per-Recensione

L'API analizza ogni recensione individualmente in una singola chiamata OpenAI, restituendo un array di risultati. Ogni risultato contiene:
- `sentiment`: "positivo", "negativo" o "neutro"
- `motivation`: spiegazione breve in italiano
- `confidence`: punteggio 0.0-1.0 che indica quanto il modello è certo della classificazione

### Gestione Errori

- **Fail-fast**: il server non si avvia se `OPENAI_API_KEY` non è configurata
- **Retry con backoff**: errori transitori (429, 5xx) vengono ritentati automaticamente
- **Validazione doppia**: input validato con Zod, output verificato a runtime tramite schema strutturato
- **Error boundary**: ogni errore viene catturato e restituito in formato strutturato

### Stato Frontend

Il componente `ReviewSection` usa un **discriminated union** per gestire lo stato:

```typescript
type AnalysisState =
  | { status: "idle" }
  | { status: "analyzing" }
  | { status: "generating" }
  | { status: "success"; results: SentimentResult[]; meta: {...} }
  | { status: "error"; message: string };
```

Questo pattern impedisce stati impossibili (es. loading + error contemporaneamente).

## Quick Start

### Prerequisiti

- **Node.js** 18+ ([download](https://nodejs.org/))
- **API key OpenAI** ([crea qui](https://platform.openai.com/api-keys))

### 1. Clona e configura

```bash
git clone <repo-url>
cd Task3
```

### 2. Configura l'API key

```bash
cp backend/.env.example backend/.env
```

Apri `backend/.env` e inserisci la tua API key:

```
OPENAI_API_KEY=sk-proj-la-tua-chiave-qui
```

### 3. Installa e avvia

```bash
npm install
npm run install:all
npm run dev
```

Backend (porta 3001) e frontend (porta 5173) si avviano insieme in un unico terminale.

Apri **http://localhost:5173** nel browser.

## API Endpoints

### `POST /api/analyze`

Analizza un array di recensioni individualmente.

**Request:**
```json
{
  "reviews": [
    "Prodotto ottimo, consegna rapida.",
    "Servizio clienti lento e poco utile."
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "sentiment": "positivo",
      "motivation": "Il cliente esprime soddisfazione per la qualità del prodotto e la velocità di consegna.",
      "confidence": 0.95
    },
    {
      "sentiment": "negativo",
      "motivation": "Il cliente lamenta un servizio clienti inefficiente.",
      "confidence": 0.91
    }
  ],
  "meta": {
    "model": "gpt-4o-mini-2024-07-18",
    "processingTimeMs": 2340,
    "reviewCount": 2
  }
}
```

### `POST /api/generate`

Genera nuove recensioni casuali.

**Request:**
```json
{ "count": 5 }
```

### `GET /api/health`

Health check del server.

## Tech Stack

- **Backend**: Node.js, Express, TypeScript, OpenAI SDK, Zod
- **Frontend**: React 19, Vite, TypeScript, Tailwind CSS v4
- **AI**: OpenAI GPT-4o-mini con Structured Output
