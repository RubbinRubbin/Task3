# Sentiment Analysis App

Applicazione full-stack che analizza il sentimento di recensioni testuali utilizzando le API di OpenAI con **Structured Output**. Il frontend simula una pagina prodotto e-commerce con recensioni analizzabili in tempo reale.

## Demo

L'applicazione mostra una pagina prodotto (cuffie wireless "SoundPro X1") con ~30 recensioni pre-caricate. L'utente può:

- **Analizzare** tutte le recensioni con un click, ottenendo un **sentiment aggregato** complessivo con motivazione e punteggio di confidenza
- **Generare nuove recensioni** casuali tramite OpenAI per dimostrare che l'analisi funziona su qualsiasi input

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
| `src/routes/analyze.ts` | `POST /api/analyze` — analisi sentimento batch |
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
| `ReviewSection` | Orchestratore: lista recensioni, bottoni, stato e risultato aggregato |

## Scelte Tecniche

### Structured Output con Zod

L'integrazione con OpenAI utilizza `zodResponseFormat` per garantire che il modello restituisca **sempre** output nel formato atteso. Lo schema Zod funge da contratto tra il modello AI e l'applicazione:

```typescript
const response = await client.beta.chat.completions.parse({
  model: "gpt-4o-mini",
  response_format: zodResponseFormat(AggregateAnalysisSchema, "sentiment_analysis"),
  // ...
});
```

Questo approccio:
- Elimina il parsing manuale di JSON
- Garantisce type-safety a compile-time e a runtime
- Gestisce automaticamente i casi di refusal del modello

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
  | { status: "success"; result: AggregateResult; meta: {...} }
  | { status: "error"; message: string };
```

Questo pattern impedisce stati impossibili (es. loading + error contemporaneamente).

## Quick Start

> Servono due terminali aperti: uno per il backend, uno per il frontend.

### Prerequisiti

- **Node.js** 18+ ([download](https://nodejs.org/))
- **API key OpenAI** ([crea qui](https://platform.openai.com/api-keys))

### 1. Clona e configura

```bash
git clone <repo-url>
cd Task3
```

### 2. Avvia il Backend

```bash
cd backend
npm install
cp .env.example .env
```

Apri il file `backend/.env` e inserisci la tua API key:

```
OPENAI_API_KEY=sk-proj-la-tua-chiave-qui
PORT=3001
```

Poi avvia il server:

```bash
npm run dev
```

Il backend parte su **http://localhost:3001**. Dovresti vedere:
```
🚀 Server running on http://localhost:3001
```

### 3. Avvia il Frontend

In un **secondo terminale**:

```bash
cd frontend
npm install
npm run dev
```

Il frontend parte su **http://localhost:5173**. Le chiamate API vengono proxate automaticamente al backend tramite Vite.

### 4. Usa l'app

1. Apri **http://localhost:5173** nel browser
2. Vedrai la pagina prodotto con 30 recensioni pre-caricate
3. Clicca **"Analizza tutte"** per ottenere il sentiment aggregato complessivo
4. Clicca **"+ Genera nuove"** per far generare a OpenAI nuove recensioni casuali e ri-analizzare

## API Endpoints

### `POST /api/analyze`

Analizza un array di recensioni.

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
  "data": {
    "sentiment": "positivo",
    "motivation": "La maggior parte dei clienti esprime soddisfazione per la qualità audio e il comfort. I punti di forza più citati sono la cancellazione del rumore e la durata della batteria.",
    "confidence": 0.87
  },
  "meta": {
    "model": "gpt-4o-mini-2024-07-18",
    "processingTimeMs": 2340,
    "reviewCount": 30
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
