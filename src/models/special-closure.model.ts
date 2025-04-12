import {belongsTo, Entity, model, property} from '@loopback/repository';
import {Merchant} from './merchant.model';

export const SPECIAL_CLOSURES_TABLE_NAME = 'special_closures';

@model({
  name: SPECIAL_CLOSURES_TABLE_NAME
})
export class SpecialClosure extends Entity {
  // Costante per il nome della tabella da usare per le query dirette nei controller
  public static readonly TABLE_NAME: string = SPECIAL_CLOSURES_TABLE_NAME;

  // Definizione centralizzata dei nomi delle colonne
  public static readonly COLUMNS = {
    ID: 'id',
    MERCHANT_ID: 'merchantId',
    DATE: 'date',
    OPEN_TIME: 'openTime',
    CLOSE_TIME: 'closeTime',
    REASON: 'reason'
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
    type: 'string',
    required: true,
    jsonSchema: {
      type: 'string',
      format: 'date',
    }
  })
  date: string;

  @property({
    type: 'string',
    required: false,
    jsonSchema: {
      type: 'string',
      format: 'time',
      pattern: '^([0-1][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$',
      nullable: true
    }
  })
  openTime?: string;

  @property({
    type: 'string',
    required: false,
    jsonSchema: {
      type: 'string',
      format: 'time',
      pattern: '^([0-1][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$',
      nullable: true
    }
  })
  closeTime?: string;

  @property({
    type: 'string',
    required: false,
    jsonSchema: {
      type: 'string',
      maxLength: 255,
      nullable: true
    }
  })
  reason?: string;

  constructor(data?: Partial<SpecialClosure>) {
    super(data);
  }
}

export interface SpecialClosureRelations {
  merchant?: Merchant;
}

export type SpecialClosureWithRelations = SpecialClosure & SpecialClosureRelations;
