import {belongsTo, Entity, model, property} from '@loopback/repository';
import {Merchant} from './merchant.model';

export const OPENING_HOURS_TABLE_NAME = 'opening_hours';

@model({
  name: OPENING_HOURS_TABLE_NAME
})
export class OpeningHour extends Entity {
  // Costante per il nome della tabella da usare per le query dirette nei controller
  public static readonly TABLE_NAME: string = OPENING_HOURS_TABLE_NAME;

  // Definizione centralizzata dei nomi delle colonne
  public static readonly COLUMNS = {
    ID: 'id',
    MERCHANT_ID: 'merchantId',
    WEEKDAY: 'weekday',
    OPEN_TIME: 'openTime',
    CLOSE_TIME: 'closeTime'
  };

  @property({
    type: 'number',
    id: true,
    generated: true,
    jsonSchema: {
      type: 'number',
      unsigned: true,
    }
  })
  id: number;

  @belongsTo(() => Merchant)
  merchantId: number;

  @property({
    type: 'number',
    required: true,
    jsonSchema: {
      type: 'number',
      minimum: 0,
      maximum: 6,
      description: '0 = Domenica, 6 = Sabato'
    }
  })
  weekday: number;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      type: 'string',
      format: 'time',
      pattern: '^([0-1][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$'
    }
  })
  openTime: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      type: 'string',
      format: 'time',
      pattern: '^([0-1][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$'
    }
  })
  closeTime: string;

  constructor(data?: Partial<OpeningHour>) {
    super(data);
  }
}

export interface OpeningHourRelations {
  merchant?: Merchant;
}

export type OpeningHourWithRelations = OpeningHour & OpeningHourRelations;
