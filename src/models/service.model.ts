import {Entity, model, property} from '@loopback/repository';

@model({name: 'services'})
export class Service extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    mysql: {dataType: 'VARCHAR', dataLength: 36},
    index: {unique: true},
  })
  publicId?: string;

  @property({
    type: 'string',
    required: true,
    mysql: {dataType: 'VARCHAR', dataLength: 200},
  })
  name: string;

  @property({
    type: 'string',
    required: true,
    mysql: {dataType: 'TEXT'},
  })
  description: string;

  @property({
    type: 'string',
    mysql: {dataType: 'VARCHAR', dataLength: 500},
  })
  durationDescription?: string;

  @property({
    type: 'number',
    mysql: {dataType: 'SMALLINT UNSIGNED'},
  })
  minDuration?: number;

  @property({
    type: 'number',
    mysql: {dataType: 'SMALLINT UNSIGNED'},
  })
  maxDuration?: number;

  @property({
    type: 'string',
    required: true,
    default: 'both',
    jsonSchema: {enum: ['vertical', 'horizontal', 'both']},
    mysql: {dataType: "ENUM('vertical','horizontal','both')"},
  })
  orientation: 'vertical' | 'horizontal' | 'both';

  @property({
    type: 'number',
    mysql: {dataType: 'DECIMAL', dataPrecision: 10, dataScale: 2},
  })
  priceVertical?: number;

  @property({
    type: 'number',
    mysql: {dataType: 'DECIMAL', dataPrecision: 10, dataScale: 2},
  })
  priceHorizontal?: number;

  @property({
    type: 'number',
    mysql: {dataType: 'DECIMAL', dataPrecision: 10, dataScale: 2},
  })
  priceBoth?: number;

  @property({
    type: 'object',
    mysql: {dataType: 'JSON'},
  })
  additionalOptions?: object;

  @property({
    type: 'date',
    defaultFn: 'now',
    mysql: {dataType: 'TIMESTAMP'},
  })
  createdAt?: Date;

  @property({
    type: 'date',
    defaultFn: 'now',
    mysql: {dataType: 'TIMESTAMP'},
  })
  updatedAt?: Date;

  constructor(data?: Partial<Service>) {
    super(data);
  }
}

export interface ServiceRelations {}

export type ServiceWithRelations = Service & ServiceRelations;
