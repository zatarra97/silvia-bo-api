# IkeaMimir - Monitor Prodotti Ikea Circolarità

## 📋 Cos'è questo progetto?

IkeaMimir è un sistema di monitoraggio automatico che monitora i prodotti Ikea della sezione **Angolo della circolarità** per rimanere sempre aggiornati sugli ultimi arrivi.

Il sistema controlla periodicamente l'inventario di prodotti usati Ikea, trova le offerte più convenienti e ti avvisa tramite Telegram quando arrivano nuovi prodotti.

## ✨ Funzionalità

- 🔄 **Monitoraggio automatico**: Controlla ogni 5 minuti i nuovi prodotti in arrivo
- 💾 **Database MySQL**: Salva tutte le offerte trovate
- 🎯 **Migliori offerte**: Seleziona automaticamente l'offerta con il prezzo più basso per ogni prodotto
- 📱 **Notifiche Telegram**: Ricevi messaggi su Telegram quando arrivano nuovi prodotti
- 🖼️ **Immagini e dettagli**: Ogni notifica include foto, prezzo e link diretto

## 🚀 Installazione

```bash
# Installa le dipendenze
npm install

# Copia il file .env di esempio e configura le variabili
cp .env.example .env
```

## ⚙️ Configurazione

Crea un file `.env` nella root del progetto:

```env
# Server
PORT=3005  # Su Render usa 10000 (default). In locale puoi usare 3005
HOST=127.0.0.1  # Per sviluppo locale. Su Render usa 0.0.0.0 o lascia vuoto (default)

# Database MySQL
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=tua_password
MYSQL_DATABASE=aspeat

# Configurazione Ikea API
IKEA_ENDPOINT_URL=https://web-api.ikea.com/circular/circular-asis/offers/grouped/search
IKEA_LANGUAGE_CODE=it
IKEA_PAGE_SIZE=32
IKEA_STORE_IDS=356
IKEA_SEARCH_INTERVAL_MINUTES=5

# Telegram Bot (opzionale)
TELEGRAM_BOT_TOKEN=il_tuo_bot_token
TELEGRAM_CHAT_ID=il_tuo_chat_id
```

## 🗄️ Database

Crea il database:

```bash
mysql -u root -p < database/create_aseat_database.sql
```

Oppure da MySQL Workbench: esegui `database/create_aseat_database.sql`

## 🚀 Deployment su Render

### Configurazione Environment Variables su Render:

```env
NODE_ENV=production
HOST=0.0.0.0
PORT=10000

MYSQL_HOST=your_host
MYSQL_PORT=3306
MYSQL_USER=your_user
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=aspeat

TELEGRAM_BOT_TOKEN=your_token
TELEGRAM_CHAT_ID=your_chat_id

IKEA_ENDPOINT_URL=https://web-api.ikea.com/circular/circular-asis/offers/grouped/search
IKEA_LANGUAGE_CODE=it
IKEA_PAGE_SIZE=32
IKEA_STORE_IDS=356
IKEA_SEARCH_INTERVAL_MINUTES=5
```

**Importante**: Non impostare `HOST=127.0.0.1` su Render. Usa `0.0.0.0` o lascia vuoto (il default è già corretto).

## ▶️ Avvio

```bash
# Avvia il server
npm start
```

## 📱 Configurazione Telegram (Opzionale)

1. Crea un bot Telegram tramite `@BotFather`
2. Crea un canale/gruppo Telegram
3. Aggiungi il bot al canale come amministratore
4. Ottieni il chat ID (vedi `docs/TELEGRAM_BOT_SETUP.md`)
5. Aggiungi `TELEGRAM_BOT_TOKEN` e `TELEGRAM_CHAT_ID` nel file `.env`
6. Testa: `GET http://localhost:3005/ikea/test-telegram`

## 🔄 Come funziona

1. **All'avvio** il sistema esegue immediatamente una ricerca
2. **Ogni 5 minuti** controlla automaticamente i nuovi arrivi
3. **Salva nel database** tutte le offerte trovate
4. **Invia notifiche Telegram** solo per i prodotti nuovi (non al primo avvio)

## 📊 Endpoint API

- `GET /ping` - Verifica che il server sia online
- `GET /ikea/start-search` - Esegue manualmente una ricerca
- `GET /ikea/test-telegram` - Test del bot Telegram

## 🛠️ Comandi Utili

```bash
npm run build      # Compila il progetto
npm run lint       # Controlla il codice
npm test           # Esegue i test
```

## 📚 Documentazione

- [Setup Telegram Bot](docs/TELEGRAM_BOT_SETUP.md)
- [Database](database/README.md)

## 🤝 Contribuire

Questo progetto è sviluppato per uso personale. Sentiti libero di fare fork e miglioramenti!
