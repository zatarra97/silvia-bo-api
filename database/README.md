# Database

Questa directory contiene gli script SQL per la gestione del database.

## Script disponibili

### create_ikea_offer_table.sql

Crea la tabella `ikea_offer` per memorizzare le offerte dei prodotti Ikea recuperate dall'API.

**Campi:**

- `ikeaId`: ID univoco dell'offerta Ikea (INDEX UNIQUE)
- `name`: Descrizione del prodotto
- `price`: Prezzo dell'offerta
- `url`: URL del prodotto
- `imageUrl`: URL dell'immagine principale
- `createdAt` / `updatedAt`: Timestamp automatici

**Indici:**

- `unique_ikeaId`: Assicura che ogni offerta sia univoca
- `idx_price`: Per ordinare/filtrare per prezzo
- `idx_createdAt`: Per ordinare per data di inserimento

## Come eseguire lo script

```bash
# Connessione MySQL
mysql -u root -p nome_database < database/create_ikea_offer_table.sql

# Oppure usando il client MySQL
source database/create_ikea_offer_table.sql;
```

## Note

- La tabella utilizza engine InnoDB
- Charset: utf8mb4 (supporta emoji e caratteri speciali)
- Timestamp automatici per createdAt e updatedAt
