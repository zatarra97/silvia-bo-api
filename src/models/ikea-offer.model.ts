import { Entity, model, property } from '@loopback/repository';

export const IKEA_OFFER_TABLE_NAME = 'ikea_offer';

@model({
  name: IKEA_OFFER_TABLE_NAME
})
export class IkeaOffer extends Entity {
  // Costante per il nome della tabella da usare per le query dirette nei controller
  public static readonly TABLE_NAME: string = IKEA_OFFER_TABLE_NAME;

  // Definizione centralizzata dei nomi delle colonne
  public static readonly COLUMNS = {
    ID: 'id',
    IKEA_ID: 'ikeaId',
    NAME: 'name',
    PRICE: 'price',
    URL: 'url',
    IMAGE_URL: 'imageUrl',
    CREATED_AT: 'createdAt',
    UPDATED_AT: 'updatedAt'
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

  @property({
    type: 'number',
    required: true,
    jsonSchema: {
      type: 'number',
    }
  })
  ikeaId: number;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      type: 'string',
    }
  })
  name: string;

  @property({
    type: 'number',
    required: true,
    jsonSchema: {
      type: 'number',
      format: 'decimal',
      minimum: 0,
    }
  })
  price: number;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      maxLength: 1000,
    }
  })
  url: string;

  @property({
    type: 'string',
    required: false,
    jsonSchema: {
      maxLength: 1000,
    }
  })
  imageUrl?: string;

  @property({
    type: 'date',
    default: () => new Date(),
  })
  createdAt: string;

  @property({
    type: 'date',
    default: () => new Date(),
  })
  updatedAt: string;

  constructor(data?: Partial<IkeaOffer>) {
    super(data);
  }
}

export interface IkeaOfferRelations {
  // Define relations here
}

export type IkeaOfferWithRelations = IkeaOffer & IkeaOfferRelations;
