# backend

This application is generated using [LoopBack 4 CLI](https://loopback.io/doc/en/lb4/Command-line-interface.html) with the
[initial project layout](https://loopback.io/doc/en/lb4/Loopback-application-layout.html).

## Install dependencies

By default, dependencies were installed when this application was generated.
Whenever dependencies in `package.json` are changed, run the following command:

```sh
npm install
```

To only install resolved dependencies in `package-lock.json`:

```sh
npm ci
```

## Run the application

```sh
npm start
```

You can also run `node .` to skip the build step.

Open http://127.0.0.1:3000 in your browser.

## Rebuild the project

To incrementally build the project:

```sh
npm run build
```

To force a full build by cleaning up cached artifacts:

```sh
npm run rebuild
```

## Fix code style and formatting issues

```sh
npm run lint
```

To automatically fix such issues:

```sh
npm run lint:fix
```

## Other useful commands

- `npm run migrate`: Migrate database schemas for models
- `npm run openapi-spec`: Generate OpenAPI spec into a file
- `npm run docker:build`: Build a Docker image for this application
- `npm run docker:run`: Run this application inside a Docker container

## Tests

```sh
npm test
```

## Configurazione Variabili d'Ambiente

Crea un file `.env` nella root del progetto con le seguenti variabili:

```env
# Porta del server
PORT=3005
HOST=127.0.0.1

# CORS Frontend URL
CORS_FRONTEND=http://localhost:3000

# Database MySQL
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=
MYSQL_DATABASE=ikea_db

# Cognito (se necessario)
COGNITO_REGION=
COGNITO_USER_POOL_ID=
COGNITO_APP_CLIENT_ID=

# IKEA API Configuration
IKEA_ENDPOINT_URL=https://web-api.ikea.com/circular/circular-asis/offers/grouped/search
IKEA_LANGUAGE_CODE=it
IKEA_PAGE_SIZE=32
IKEA_STORE_IDS=356
IKEA_SEARCH_INTERVAL_MINUTES=5
IKEA_PRODUCT_DETAIL_BASE_URL=https://www.ikea.com/it/it/circular/second-hand/#/bari/

# Telegram Bot Configuration (opzionale)
TELEGRAM_BOT_TOKEN=il_tuo_bot_token
TELEGRAM_CHAT_ID=l_id_del_canale
```

## Funzionalità Ikea API

Il backend include integrazione con l'API Ikea per recuperare prodotti in offerta.

### Comportamento automatico:

**All'avvio del backend**, il sistema avvia automaticamente un cron job che:

- Esegue immediatamente una ricerca completa dei prodotti
- Ripete la ricerca automaticamente ogni 5 minuti (configurabile tramite `IKEA_SEARCH_INTERVAL_MINUTES`)
- Logga le informazioni delle migliori offerte per ogni prodotto

### Endpoint disponibili (opzionali):

- `GET /ikea/start-search` - Forza l'esecuzione immediata della ricerca manuale
- `GET /ikea/test-single-page` - Test per ottenere la prima pagina di risultati
- `GET /ikea/test-telegram` - Test del bot Telegram e invio di un messaggio di prova

### Come funziona:

1. Il sistema recupera automaticamente tutte le pagine di prodotti disponibili
2. Per ogni prodotto, seleziona l'offerta con il prezzo più basso
3. Logga le informazioni dell'offerta selezionata:
   - **ID**: Identificativo dell'offerta
   - **Descrizione**: Descrizione del prodotto
   - **Prezzo**: Prezzo dell'offerta con valuta
   - **URL**: Link diretto al prodotto (base URL + ID)
   - **Immagine**: URL dell'immagine principale del prodotto (heroImage)

### Configurazione:

L'intervallo tra le ricerche automatiche può essere configurato tramite la variabile d'ambiente `IKEA_SEARCH_INTERVAL_MINUTES` (valore di default: 5 minuti).

### Notifiche Telegram:

Il sistema può inviare automaticamente i nuovi prodotti trovati a un canale Telegram.

**Per configurare Telegram:**

1. Segui la guida in `docs/TELEGRAM_BOT_SETUP.md` per creare il bot e il canale
2. Aggiungi le variabili `TELEGRAM_BOT_TOKEN` e `TELEGRAM_CHAT_ID` nel file `.env`
3. Testa la configurazione chiamando `GET /ikea/test-telegram`

Quando vengono trovati nuovi prodotti, verranno inviati automaticamente al canale Telegram configurato.

**Nota importante sul primo avvio:**

Al primo avvio dell'applicazione (quando il database è vuoto), tutte le offerte disponibili verranno caricate nel database ma **non verranno inviate notifiche Telegram** per evitare di inondare il canale con centinaia di messaggi. Le notifiche verranno inviate solo per le nuove offerte rilevate nelle esecuzioni successive del cron job.

## What's next

Please check out [LoopBack 4 documentation](https://loopback.io/doc/en/lb4/) to
understand how you can continue to add features to this application.

[![LoopBack](<https://github.com/loopbackio/loopback-next/raw/master/docs/site/imgs/branding/Powered-by-LoopBack-Badge-(blue)-@2x.png>)](http://loopback.io/)
