# Database

Questa directory contiene gli script SQL per la gestione del database.

## Script disponibili

### create_works_table.sql

Crea la tabella `works` per memorizzare i lavori della piattaforma di vetrina.

**Campi:**

- `id`: ID univoco del lavoro (AUTO_INCREMENT PRIMARY KEY)
- `titolo`: Titolo del lavoro (VARCHAR 200, nullable)
- `tipo`: Tipo di lavoro (VARCHAR 200, nullable)
- `cast_membri`: Cast del lavoro in formato JSON (nullable)
- `gallery`: Gallery del lavoro in formato JSON (nullable)
- `status`: Status del lavoro, può essere 'draft' o 'published' (default: 'draft')
- `created_at` / `updated_at`: Timestamp automatici

**Indici:**

- `idx_status`: Per filtrare per status
- `idx_created_at`: Per ordinare per data di creazione

## Come eseguire lo script

```bash
# Connessione MySQL
mysql -u root -p nome_database < database/create_works_table.sql

# Oppure usando il client MySQL
mysql -u root -p
USE nome_database;
source database/create_works_table.sql;
```

## Note

- La tabella utilizza engine InnoDB
- Charset: utf8mb4 (supporta emoji e caratteri speciali)
- Timestamp automatici per created_at e updated_at
- Tutti i campi sono nullable per permettere salvataggi parziali (bozza)
