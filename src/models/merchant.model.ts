import {belongsTo, Entity, model, property} from '@loopback/repository';
import {User} from './user.model';

export const MERCHANT_TABLE_NAME = 'merchant';

@model({
  name: MERCHANT_TABLE_NAME
})
export class Merchant extends Entity {
  // Costante per il nome della tabella da usare per le query dirette nei controller
  public static readonly TABLE_NAME: string = MERCHANT_TABLE_NAME;

  // Definizione centralizzata dei nomi delle colonne
  public static readonly COLUMNS = {
    ID: 'id',
    NAME: 'name',
    ADDRESS: 'address',
    PICKUP_ENABLED: 'pickupEnabled',
    DELIVERY_ENABLED: 'deliveryEnabled',
    DELIVERY_COST: 'deliveryCost',
    MIN_ORDER_AMOUNT: 'minOrderAmount',
    ESTIMATED_DELIVERY_TIME: 'estimatedDeliveryTime',
    COVER_IMAGE_URL: 'coverImageUrl',
    LOGO_URL: 'logoUrl',
    USER_ID: 'userId',
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
    type: 'string',
    required: true,
    jsonSchema: {
      maxLength: 100,
    },
  })
  name: string;

  @property({
    type: 'object',
    required: true,
    jsonSchema: {
      type: 'object',
    },
  })
  address: object;

  @property({
    type: 'boolean',
    required: true,
    default: true,
  })
  pickupEnabled: boolean;

  @property({
    type: 'boolean',
    required: true,
    default: false,
  })
  deliveryEnabled: boolean;

  @property({
    type: 'number',
    required: true,
    default: 0,
    jsonSchema: {
      type: 'number',
      format: 'decimal',
      minimum: 0,
      maximum: 9999.99,
    },
  })
  deliveryCost: number;

  @property({
    type: 'number',
    required: true,
    default: 0,
    jsonSchema: {
      type: 'number',
      format: 'decimal',
      minimum: 0,
      maximum: 9999.99,
    },
  })
  minOrderAmount: number;

  @property({
    type: 'string',
    required: false,
    jsonSchema: {
      maxLength: 20,
    },
  })
  estimatedDeliveryTime?: string;

  @property({
    type: 'string',
    required: false,
    jsonSchema: {
      maxLength: 255,
    },
  })
  coverImageUrl?: string;

  @property({
    type: 'string',
    required: false,
    jsonSchema: {
      maxLength: 255,
    },
  })
  logoUrl?: string;

  @belongsTo(() => User)
  userId: number;

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

  constructor(data?: Partial<Merchant>) {
    super(data);
  }
}

export interface MerchantRelations {
  user?: User;
}

export type MerchantWithRelations = Merchant & MerchantRelations;
