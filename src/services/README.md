# Servizi

Questa directory contiene i servizi dell'applicazione.

## IkeaApiService

Il servizio `IkeaApiService` gestisce le chiamate all'API Ikea per recuperare prodotti in offerta.

### Funzionalità

- `fetchIkeaOffers(page)`: Recupera una pagina specifica di prodotti
- `selectBestOffer(offers)`: Seleziona l'offerta con il prezzo più basso
- `fetchAllIkeaOffers()`: Recupera tutte le pagine di prodotti
- `processAllOffers()`: Processa tutti i prodotti e logga le offerte migliori

### Utilizzo

Il servizio è utilizzato dal controller `IkeaController` tramite gli endpoint:

- `GET /ikea/start-search` - Avvia il processamento completo
- `GET /ikea/test-single-page` - Test con la prima pagina

### Variabili d'ambiente

- `IKEA_ENDPOINT_URL`: URL base dell'API (default: https://web-api.ikea.com/circular/circular-asis/offers/grouped/search)
- `IKEA_LANGUAGE_CODE`: Codice lingua (default: it)
- `IKEA_PAGE_SIZE`: Numero di elementi per pagina (default: 32)
- `IKEA_STORE_IDS`: ID dello store (default: 356)
- `IKEA_SEARCH_INTERVAL_MINUTES`: Intervallo tra le ricerche automatiche in minuti (default: 5)
- `IKEA_PRODUCT_DETAIL_BASE_URL`: URL base per i dettagli del prodotto (default: https://www.ikea.com/it/it/circular/second-hand/#/bari/)
