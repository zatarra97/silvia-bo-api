import axios from 'axios';

export interface TelegramMessage {
  ikeaId: number;
  name: string;
  price: number;
  url: string;
  imageUrl?: string;
}

export class TelegramService {
  private botToken: string;
  private chatId: string;
  private apiUrl: string;

  constructor() {
    this.botToken = process.env.TELEGRAM_BOT_TOKEN || '';
    this.chatId = process.env.TELEGRAM_CHAT_ID || '';
    this.apiUrl = `https://api.telegram.org/bot${this.botToken}`;
  }

  /**
   * Escape i caratteri HTML speciali nel testo
   */
  private escapeHtml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /**
   * Verifica se Telegram è configurato correttamente
   */
  isConfigured(): boolean {
    return !!(this.botToken && this.chatId);
  }

  /**
   * Formatta un singolo messaggio per il prodotto
   */
  private formatProductMessage(product: TelegramMessage): string {
    const escapedName = this.escapeHtml(product.name);
    const nameUpperCase = escapedName.toUpperCase();

    let message = `<b>${nameUpperCase}</b>\n\n`;
    message += `💰 Prezzo: €${product.price}\n`;
    message += `🔗 <a href="${product.url}">Vedi prodotto</a>`;

    return message;
  }

  /**
   * Invia un messaggio singolo a Telegram
   */
  private async sendTelegramMessage(text: string): Promise<void> {
    if (!this.isConfigured()) {
      console.warn('⚠️  Telegram non configurato. Configura TELEGRAM_BOT_TOKEN e TELEGRAM_CHAT_ID nel file .env');
      return;
    }

    try {
      console.log('📤 Invio messaggio a Telegram...');
      const response = await axios.post(`${this.apiUrl}/sendMessage`, {
        chat_id: this.chatId,
        text: text,
        parse_mode: 'HTML',
        disable_web_page_preview: false,
      });

      if (response.data.ok) {
        console.log('✅ Messaggio inviato a Telegram con successo');
      } else {
        console.error('❌ Errore nell\'invio del messaggio Telegram:', response.data.description);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error('❌ Errore nell\'invio del messaggio Telegram:', error.response.status, error.response.data);
      } else {
        console.error('❌ Errore nell\'invio del messaggio Telegram:', error instanceof Error ? error.message : 'Errore sconosciuto');
      }
    }
  }

  /**
   * Invia un messaggio con foto a Telegram
   */
  private async sendTelegramPhoto(photoUrl: string, caption: string): Promise<void> {
    if (!this.isConfigured()) {
      console.warn('⚠️  Telegram non configurato. Configura TELEGRAM_BOT_TOKEN e TELEGRAM_CHAT_ID nel file .env');
      return;
    }

    try {
      console.log('📤 Invio foto a Telegram...');
      const response = await axios.post(`${this.apiUrl}/sendPhoto`, {
        chat_id: this.chatId,
        photo: photoUrl,
        caption: caption,
        parse_mode: 'HTML',
      });

      if (response.data.ok) {
        console.log('✅ Foto inviata a Telegram con successo');
      } else {
        console.error('❌ Errore nell\'invio della foto Telegram:', response.data.description);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error('❌ Errore nell\'invio della foto Telegram:', error.response.status, error.response.data);
      } else {
        console.error('❌ Errore nell\'invio della foto Telegram:', error instanceof Error ? error.message : 'Errore sconosciuto');
      }
    }
  }

  /**
   * Invia i nuovi prodotti a Telegram, un messaggio per ogni prodotto
   */
  async sendNewProducts(products: TelegramMessage[]): Promise<void> {
    if (products.length === 0) {
      return;
    }

    // Invio un messaggio separato per ogni prodotto
    for (const product of products) {
      // Se c'è un'immagine, invia la foto con caption
      if (product.imageUrl) {
        const message = this.formatProductMessage(product);
        await this.sendTelegramPhoto(product.imageUrl, message);
      } else {
        // Se non c'è immagine, invia solo il messaggio di testo
        const message = this.formatProductMessage(product);
        await this.sendTelegramMessage(message);
      }
    }
  }

  /**
   * Test del bot Telegram
   */
  async testBot(): Promise<void> {
    const testMessage = '🤖 <b>Test Bot Telegram</b>\n\nBot configurato correttamente!\n✅ Connessione OK';
    await this.sendTelegramMessage(testMessage);
  }
}

