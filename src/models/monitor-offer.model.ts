import {Entity, model, property} from '@loopback/repository';

export const MONITOR_OFFER_TABLE_NAME = 'monitor_offer';

@model({
  name: MONITOR_OFFER_TABLE_NAME
})
export class MonitorOffer extends Entity {
  // Costante per il nome della tabella da usare per le query dirette nei controller
  public static readonly TABLE_NAME: string = MONITOR_OFFER_TABLE_NAME;

  // Definizione centralizzata dei nomi delle colonne
  public static readonly COLUMNS = {
    ID: 'id',
    IKEA_ID: 'ikeaId',
    NAME: 'name',
    CREATED_AT: 'createdAt',
    UPDATED_AT: 'updatedAt'
  };
  @property({
    type: 'number',
    id: true,
    generated: true,
    mysql: {
      columnName: 'id',
      dataType: 'INT',
      dataLength: null,
      dataPrecision: 10,
      dataScale: 0,
      nullable: 'N',
    },
  })
  id: number;

  @property({
    type: 'number',
    required: true,
    mysql: {
      columnName: 'ikeaId',
      dataType: 'BIGINT',
      dataLength: null,
      dataPrecision: 19,
      dataScale: 0,
      nullable: 'N',
    },
  })
  ikeaId: number;

  @property({
    type: 'string',
    required: true,
    mysql: {
      columnName: 'name',
      dataType: 'VARCHAR',
      dataLength: 500,
      dataPrecision: null,
      dataScale: null,
      nullable: 'N',
    },
  })
  name: string;

  @property({
    type: 'date',
    required: true,
    mysql: {
      columnName: 'createdAt',
      dataType: 'DATETIME',
      dataLength: null,
      dataPrecision: null,
      dataScale: null,
      nullable: 'N',
    },
  })
  createdAt: string;

  @property({
    type: 'date',
    required: true,
    mysql: {
      columnName: 'updatedAt',
      dataType: 'DATETIME',
      dataLength: null,
      dataPrecision: null,
      dataScale: null,
      nullable: 'N',
    },
  })
  updatedAt: string;

  constructor(data?: Partial<MonitorOffer>) {
    super(data);
  }
}

export interface MonitorOfferRelations {
  // describe navigational properties here
}

export type MonitorOfferWithRelations = MonitorOffer & MonitorOfferRelations;

