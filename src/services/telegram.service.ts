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
   * Verifica se Telegram è configurato correttamente
   */
  isConfigured(): boolean {
    return !!(this.botToken && this.chatId);
  }

  /**
   * Formatta un singolo messaggio per il prodotto
   */
  private formatProductMessage(product: TelegramMessage): string {
    let message = `🛋️ **NUOVA OFFERTA IKEA**\n\n`;
    message += `📦 ${product.name}\n`;
    message += `💰 Prezzo: €${product.price}\n`;
    message += `🔗 [Vedi prodotto](${product.url})`;

    return message;
  }

  /**
   * Crea un messaggio raggruppato per tutti i prodotti nuovi
   */
  private formatGroupedMessage(products: TelegramMessage[]): string {
    let message = `🎉 **NUOVE OFFERTE IKEA: ${products.length}**\n\n`;
    message += `─`.repeat(30);
    message += `\n\n`;

    products.forEach((product, index) => {
      message += `${index + 1}. **${product.name}**\n`;
      message += `   💰 €${product.price}\n`;
      message += `   🔗 [Link prodotto](${product.url})\n`;
      message += `\n`;
    });

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
      const response = await axios.post(`${this.apiUrl}/sendMessage`, {
        chat_id: this.chatId,
        text: text,
        parse_mode: 'Markdown',
        disable_web_page_preview: false,
      });

      if (response.data.ok) {
        console.log('✅ Messaggio inviato a Telegram con successo');
      } else {
        console.error('❌ Errore nell\'invio del messaggio Telegram:', response.data.description);
      }
    } catch (error) {
      console.error('❌ Errore nell\'invio del messaggio Telegram:', error instanceof Error ? error.message : 'Errore sconosciuto');
    }
  }

  /**
   * Invia i nuovi prodotti a Telegram in un messaggio raggruppato
   */
  async sendNewProducts(products: TelegramMessage[]): Promise<void> {
    if (products.length === 0) {
      return;
    }

    // Se c'è un solo prodotto, formatta in modo più completo con immagine
    if (products.length === 1) {
      const product = products[0];
      const message = this.formatProductMessage(product);

      await this.sendTelegramMessage(message);

      // Se c'è un'immagine, invia anche quella
      if (product.imageUrl) {
        try {
          await axios.post(`${this.apiUrl}/sendPhoto`, {
            chat_id: this.chatId,
            photo: product.imageUrl,
            caption: `📦 ${product.name}\n💰 Prezzo: €${product.price}`,
            parse_mode: 'Markdown',
          });
        } catch (error) {
          console.warn('⚠️  Errore nell\'invio dell\'immagine Telegram:', error instanceof Error ? error.message : 'Errore sconosciuto');
        }
      }
    } else {
      // Più prodotti: invia un messaggio raggruppato
      const message = this.formatGroupedMessage(products);
      await this.sendTelegramMessage(message);
    }
  }

  /**
   * Test del bot Telegram
   */
  async testBot(): Promise<void> {
    const testMessage = '🤖 **Test Bot Telegram**\n\nBot configurato correttamente!\n✅ Connessione OK';
    await this.sendTelegramMessage(testMessage);
  }
}

