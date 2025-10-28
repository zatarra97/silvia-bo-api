# Backend - Casa di Produzione Video

Backend LoopBack 4 per la piattaforma di vetrina di una casa di produzione video.

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
PORT=3000
HOST=127.0.0.1

# Database MySQL
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=tua_password
MYSQL_DATABASE=nome_database

# CORS
CORS_FRONTEND=http://localhost:3001
```

## 🗄️ Database

Crea il database seguendo gli script SQL in `database/`.

## ▶️ Avvio

```bash
# Avvia il server
npm start
```

Il server sarà disponibile su `http://localhost:3000`

## 📊 Endpoint API

- `GET /ping` - Verifica che il server sia online
- `GET /explorer` - API Explorer per testare gli endpoint

## 🛠️ Comandi Utili

```bash
npm run build      # Compila il progetto
npm run lint       # Controlla il codice
npm test           # Esegue i test
npm run rebuild    # Ricompila il progetto
```

## 📚 Documentazione

- [Database](database/README.md)
