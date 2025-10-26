import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {
  get,
  Request,
  ResponseObject,
  RestBindings,
} from '@loopback/rest';
import {IkeaOfferRepository} from '../repositories';
import {IkeaApiService} from '../services/ikea-api.service';
import {TelegramService} from '../services/telegram.service';

/**
 * OpenAPI response for startIkeaSearch()
 */
const START_SEARCH_RESPONSE: ResponseObject = {
  description: 'Start Ikea Search Response',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          message: {type: 'string'},
          started: {type: 'boolean'},
        },
      },
    },
  },
};

/**
 * Controller per gestire le ricerche su Ikea API
 */
export class IkeaController {
  private ikeaService: IkeaApiService;

  constructor(
    @inject(RestBindings.Http.REQUEST) private req: Request,
    @repository(IkeaOfferRepository) private ikeaOfferRepository: IkeaOfferRepository,
  ) {
    this.ikeaService = new IkeaApiService(ikeaOfferRepository);
  }

  @get('/ikea/start-search', {
    summary: 'Avvia la ricerca dei prodotti Ikea',
    description: 'Esegue la ricerca di tutti i prodotti offerti da Ikea e logga le informazioni delle migliori offerte',
    tags: ['Ikea'],
    responses: {
      '200': START_SEARCH_RESPONSE,
    },
  })
  async startSearch(): Promise<object> {
    // Avvia il processo in background
    // Nota: in un'applicazione reale, useresti un job queue (es. Bull, BullMQ) per gestire task asincroni
    this.ikeaService.processAllOffers().catch(err => {
      console.error('Errore durante la ricerca Ikea:', err);
    });

    return {
      message: 'Ricerca avviata. Controlla i log per i risultati.',
      started: true,
    };
  }

  @get('/ikea/test-single-page', {
    summary: 'Test chiamata single page',
    description: 'Esegue una chiamata di test alla prima pagina dell\'API Ikea',
    tags: ['Ikea'],
    responses: {
      '200': {
        description: 'Dati della prima pagina',
        content: {
          'application/json': {
            schema: {
              type: 'object',
            },
          },
        },
      },
    },
  })
  async testSinglePage(): Promise<object> {
    try {
      const response = await this.ikeaService.fetchIkeaOffers(0);
      return {
        success: true,
        totalPages: response.totalPages,
        totalElements: response.totalElements,
        productsCount: response.content.length,
        products: response.content,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Errore sconosciuto',
      };
    }
  }

  @get('/ikea/test-telegram', {
    summary: 'Test bot Telegram',
    description: 'Invia un messaggio di test al bot Telegram',
    tags: ['Ikea'],
    responses: {
      '200': {
        description: 'Messaggio di test inviato',
        content: {
          'application/json': {
            schema: {
              type: 'object',
            },
          },
        },
      },
    },
  })
  async testTelegram(): Promise<object> {
    const telegramService = new TelegramService();

    if (!telegramService.isConfigured()) {
      return {
        success: false,
        message: 'Telegram non configurato. Aggiungi TELEGRAM_BOT_TOKEN e TELEGRAM_CHAT_ID nel file .env',
        configured: false,
      };
    }

    try {
      await telegramService.testBot();
      return {
        success: true,
        message: 'Messaggio di test inviato con successo!',
        configured: true,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Errore nell\'invio del messaggio',
        error: error instanceof Error ? error.message : 'Errore sconosciuto',
        configured: true,
      };
    }
  }
}

