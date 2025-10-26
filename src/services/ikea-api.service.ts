import axios from 'axios';
import * as cron from 'node-cron';
import {IkeaOffer as IkeaOfferModel} from '../models';
import {IkeaOfferRepository} from '../repositories';
import {TelegramService} from './telegram.service';

export interface IkeaOffer {
  id: number;
  offerNumber: string;
  description: string;
  additionalInfo: string;
  price: number;
  productConditionCode: string;
  productConditionTitle: string;
  productConditionDescription: string;
  isInBox: boolean;
  reasonDiscount: string;
}

export interface IkeaProduct {
  articleNumbers: string[];
  storeId: string;
  title: string;
  description: string;
  currency: string;
  heroImage: string;
  images: string[];
  media: Array<{
    url: string;
    type: string;
  }>;
  originalPrice: number;
  minPrice: number;
  maxPrice: number;
  offers: IkeaOffer[];
}

export interface IkeaApiResponse {
  content: IkeaProduct[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: any;
    offset: number;
    unpaged: boolean;
    paged: boolean;
  };
  totalPages: number;
  totalElements: number;
  last: boolean;
  numberOfElements: number;
  size: number;
  number: number;
  sort: any;
  first: boolean;
  empty: boolean;
}

export class IkeaApiService {
  private cronJob: cron.ScheduledTask | null = null;
  private ikeaOfferRepository: IkeaOfferRepository;
  private telegramService: TelegramService;

  constructor(ikeaOfferRepository?: IkeaOfferRepository) {
    this.ikeaOfferRepository = ikeaOfferRepository as IkeaOfferRepository;
    this.telegramService = new TelegramService();
  }

  /**
   * Esegue la chiamata API a Ikea e restituisce i prodotti
   */
  async fetchIkeaOffers(page: number = 0): Promise<IkeaApiResponse> {
    const endpoint = process.env.IKEA_ENDPOINT_URL ||
      'https://web-api.ikea.com/circular/circular-asis/offers/grouped/search';

    const languageCode = process.env.IKEA_LANGUAGE_CODE || 'it';
    const size = process.env.IKEA_PAGE_SIZE || '32';
    const storeIds = process.env.IKEA_STORE_IDS || '356';

    const url = `${endpoint}?languageCode=${languageCode}&size=${size}&storeIds=${storeIds}&page=${page}`;

    const response = await axios.get<IkeaApiResponse>(url);

    if (!response.data) {
      throw new Error(`Errore nella chiamata API: nessun dato ricevuto`);
    }

    return response.data;
  }

  /**
   * Seleziona l'offerta migliore (prezzo più basso)
   */
  selectBestOffer(offers: IkeaOffer[]): IkeaOffer | null {
    if (!offers || offers.length === 0) {
      return null;
    }

    // Se tutte le offerte hanno lo stesso prezzo, prendi la prima
    const prices = offers.map(offer => offer.price);
    const uniquePrices = [...new Set(prices)];

    if (uniquePrices.length === 1) {
      return offers[0];
    }

    // Altrimenti, prendi quella con il prezzo più basso
    return offers.reduce((best, current) => {
      return current.price < best.price ? current : best;
    }, offers[0]);
  }

  /**
   * Esegue tutte le pagine e restituisce tutti i prodotti
   */
  async fetchAllIkeaOffers(): Promise<IkeaProduct[]> {
    let allProducts: IkeaProduct[] = [];
    let currentPage = 0;
    let totalPages = 1;

    // Prima chiamata per ottenere il numero totale di pagine
    const firstResponse = await this.fetchIkeaOffers(0);
    totalPages = firstResponse.totalPages;
    allProducts = [...firstResponse.content];

    console.log(`Totale pagine: ${totalPages}`);
    console.log(`Prima pagina caricata con ${firstResponse.content.length} prodotti`);

    // Chiamate per le pagine successive
    for (let page = 1; page < totalPages; page++) {
      try {
        const response = await this.fetchIkeaOffers(page);
        allProducts.push(...response.content);
        console.log(`Pagina ${page + 1}/${totalPages} caricata con ${response.content.length} prodotti`);
      } catch (error) {
        console.error(`Errore nel caricamento della pagina ${page + 1}:`, error);
      }
    }

    return allProducts;
  }

  /**
   * Recupera tutti gli ikeaId esistenti nel database (in una singola query)
   */
  async getExistingIkeaIds(): Promise<Set<number>> {
    const existingOffers = await this.ikeaOfferRepository.find({
      fields: {ikeaId: true},
    });
    return new Set(existingOffers.map(offer => offer.ikeaId));
  }

  /**
   * Salva le offerte nel database (solo quelle nuove) e logga solo i nuovi prodotti
   */
  async saveOffersToDatabase(products: IkeaProduct[]): Promise<void> {
    // Recupera tutti gli ikeaId esistenti in una singola query
    const existingIds = await this.getExistingIkeaIds();

    // Controlla se è il primo avvio (database vuoto)
    const isFirstRun = existingIds.size === 0;

    // Leggi l'URL base dalla variabile d'ambiente
    const baseUrl = process.env.IKEA_PRODUCT_DETAIL_BASE_URL ||
      'https://www.ikea.com/it/it/circular/second-hand/#/bari/';

    const newOffers: IkeaOfferModel[] = [];
    const newProductsToLog: Array<{index: number; product: IkeaProduct; offer: any; url: string}> = [];

    for (let index = 0; index < products.length; index++) {
      const product = products[index];
      const bestOffer = this.selectBestOffer(product.offers);

      if (bestOffer && !existingIds.has(bestOffer.id)) {
        // Costruisci l'URL completo
        const productUrl = `${baseUrl}${bestOffer.id}`;

        // Crea l'oggetto da salvare
        const offerToSave: Partial<IkeaOfferModel> = {
          ikeaId: bestOffer.id,
          name: bestOffer.description,
          price: bestOffer.price,
          url: productUrl,
          imageUrl: product.heroImage || undefined,
        };

        newOffers.push(offerToSave as IkeaOfferModel);
        newProductsToLog.push({
          index: index + 1,
          product,
          offer: bestOffer,
          url: productUrl
        });
        existingIds.add(bestOffer.id); // Evita duplicati nella stessa sessione
      }
    }

    // Logga solo i nuovi prodotti
    if (newProductsToLog.length > 0) {
      if (isFirstRun) {
        console.log(`\n=== PRIMO AVVIO: CARICAMENTO INIZIALE ===`);
        console.log(`Offerte trovate: ${newProductsToLog.length}`);
        console.log(`\n💡 Le offerte verranno salvate nel database senza inviare notifiche Telegram.`);
        console.log(`Le notifiche verranno inviate solo quando saranno rilevate nuove offerte successive.\n`);
      } else {
        console.log(`\n=== NUOVE OFFERTE TROVATE: ${newProductsToLog.length} ===\n`);
      }

      // Log dei prodotti solo se non è il primo avvio (per non loggare centinaia di prodotti)
      if (!isFirstRun && newProductsToLog.length <= 50) {
        newProductsToLog.forEach(({index, offer, product, url}) => {
          console.log(`--- Nuovo Prodotto ${index} ---`);
          console.log(`ID offerta: ${offer.id}`);
          console.log(`Descrizione: ${offer.description}`);
          console.log(`Prezzo: ${offer.price} ${product.currency}`);
          console.log(`URL: ${url}`);
          console.log(`Immagine: ${product.heroImage}`);
          console.log('');
        });
      } else if (!isFirstRun) {
        console.log(`⚠️  Troppi prodotti per loggare (${newProductsToLog.length}). Visualizza i log di Telegram per i dettagli.\n`);
      }

      // Salva tutte le nuove offerte in batch (una sola operazione di INSERT multipli)
      await this.ikeaOfferRepository.createAll(newOffers);

      if (isFirstRun) {
        console.log(`💾 Caricate ${newOffers.length} offerte iniziali nel database`);
      } else {
        console.log(`💾 Salvate ${newOffers.length} nuove offerte nel database`);
      }

      // Invia i nuovi prodotti a Telegram (solo se non è il primo avvio)
      if (isFirstRun) {
        console.log('📊 Primo avvio: database vuoto rilevato. Notifiche Telegram saltate.');
      } else if (this.telegramService.isConfigured()) {
        const telegramMessages = newProductsToLog.map(({offer, product, url}) => ({
          ikeaId: offer.id,
          name: offer.description,
          price: offer.price,
          url: url,
          imageUrl: product.heroImage,
        }));
        await this.telegramService.sendNewProducts(telegramMessages);
      } else {
        console.log('⚠️  Telegram non configurato. Salta l\'invio dei messaggi.');
      }
    } else {
      console.log(`\n✅ Tutte le offerte sono già presenti nel database`);
    }

    return Promise.resolve();
  }

  /**
   * Processa tutti i prodotti e salva nel database solo quelli nuovi
   */
  async processAllOffers(): Promise<void> {
    const products = await this.fetchAllIkeaOffers();

    console.log(`\n=== PROCESSAMENTO IN CORSO ===`);
    console.log(`Totale prodotti trovati: ${products.length}`);

    // Salva nel database solo le offerte nuove (vengono loggati solo i nuovi prodotti)
    await this.saveOffersToDatabase(products);

    console.log(`\n=== PROCESSAMENTO COMPLETATO ===`);
  }

  /**
   * Avvia il cron job per eseguire la ricerca periodicamente
   * L'intervallo è configurabile tramite la variabile d'ambiente IKEA_SEARCH_INTERVAL_MINUTES (default: 5 minuti)
   */
  startScheduledSearch(): void {
    if (this.cronJob) {
      console.log('Cron job già attivo');
      return;
    }

    // Leggi l'intervallo dalle variabili d'ambiente (default: 5 minuti)
    const intervalMinutes = parseInt(process.env.IKEA_SEARCH_INTERVAL_MINUTES || '5', 10);

    console.log(`Avvio cron job per la ricerca Ikea (ogni ${intervalMinutes} minuti)...`);

    // Esegue subito la prima ricerca
    this.processAllOffers().catch(err => {
      console.error('Errore nella ricerca iniziale Ikea:', err);
    });

    // Schedula l'esecuzione
    const cronPattern = `*/${intervalMinutes} * * * *`;
    this.cronJob = cron.schedule(cronPattern, () => {
      console.log('\n[CRON] Esecuzione ricerca Ikea schedulata...');
      this.processAllOffers().catch(err => {
        console.error('[CRON] Errore durante la ricerca Ikea:', err);
      });
    });

    console.log(`Cron job avviato con successo (ogni ${intervalMinutes} minuti)`);
  }

  /**
   * Ferma il cron job
   */
  stopScheduledSearch(): void {
    if (this.cronJob) {
      this.cronJob.stop();
      this.cronJob = null;
      console.log('Cron job fermato');
    }
  }

  /**
   * Controlla se il cron job è attivo
   */
  isScheduledSearchActive(): boolean {
    return this.cronJob !== null;
  }
}

