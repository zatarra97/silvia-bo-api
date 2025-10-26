# Configurazione Bot Telegram

Questa guida ti aiuterà a creare un bot Telegram e configurare l'invio di messaggi alle offerte Ikea.

## Passo 1: Creare il Bot Telegram

1. Apri Telegram e cerca `@BotFather`
2. Invia il comando `/newbot`
3. Inserisci un nome per il bot (es: "Ikea Offer Alert Bot")
4. Inserisci un username per il bot (deve terminare con `bot`, es: "ikea_offer_alert_bot")
5. BotFather ti fornirà un **API Token** simile a: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`
6. **Salva questo token**: ti servirà per la variabile `TELEGRAM_BOT_TOKEN`

## Passo 2: Creare il Canale Telegram

1. Apri Telegram e tocca il menu (≡)
2. Seleziona "Nuovo canale"
3. Inserisci un nome (es: "Ikea Offer Alert")
4. Aggiungi una descrizione (opzionale)
5. Scegli la privacy (pubblico o privato)
6. Aggiungi i membri (opzionale)

## Passo 3: Aggiungere il Bot al Canale

1. Apri il canale appena creato
2. Tocca il nome del canale in alto
3. Seleziona "Amministratori"
4. Tocca "Aggiungi amministratore"
5. Cerca il tuo bot (usando l'username che hai creato)
6. Seleziona il bot e concedi i permessi:
   - ✅ Invia messaggi
   - ✅ Modifica messaggi
7. Salva

## Passo 4: Ottenere l'ID del Canale

### Metodo 1: Tramite un bot (più semplice)

1. Aggiungi il bot `@userinfobot` al tuo canale
2. Invia qualsiasi messaggio nel canale
3. Il bot ti risponderà con l'ID del canale (un numero negativo, es: `-1001234567890`)

### Metodo 2: Manuale

1. Apri il canale su desktop (telegram.org)
2. Guarda l'URL nella barra degli indirizzi
3. L'ID del canale è il numero dopo `/c/` o `/m/`

⚠️ **Importante**: Se il canale è **pubblico**, l'ID sarà positivo
Se il canale è **privato**, l'ID sarà negativo (es: `-1001234567890`)

## Passo 5: Configurare le Variabili d'Ambiente

Aggiungi al tuo file `.env`:

```env
TELEGRAM_BOT_TOKEN=il_tuo_token_qui
TELEGRAM_CHAT_ID=l_id_del_canale_qui
```

**Esempio:**

```env
TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz
TELEGRAM_CHAT_ID=-1001234567890
```

## Passo 6: Test del Bot

Puoi testare il bot in due modi:

1. **Dall'applicazione**: Avvia l'app e verifica i log
2. **Tramite curl**:
   ```bash
   curl -X POST "https://api.telegram.org/bot<TOKEN>/sendMessage" \
     -d "chat_id=<CHAT_ID>&text=Test messaggio"
   ```

## Troubleshooting

### Il bot non invia messaggi

- Verifica che il bot sia amministratore del canale
- Controlla che il bot abbia il permesso "Invia messaggi"
- Verifica che `TELEGRAM_CHAT_ID` sia corretto (per canali privati deve iniziare con `-`)

### Errore "Forbidden"

- Il bot non è amministratore del canale
- I permessi del bot non sono corretti

### Errore "Bad Request"

- Il token del bot è errato
- Il chat_id è errato

## Comandi Utili

```bash
# Ottenere informazioni sul bot
https://api.telegram.org/bot<TOKEN>/getMe

# Ottenere informazioni sul canale (metodo alternativo)
https://api.telegram.org/bot<TOKEN>/getUpdates
```

## Sicurezza

⚠️ **NON COMMITTARE mai il file `.env` con i token!**

Il file `.env` è già nel `.gitignore` per sicurezza.
