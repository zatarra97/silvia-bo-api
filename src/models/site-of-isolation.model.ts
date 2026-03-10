import {Entity, model, property} from '@loopback/repository';

@model({
  name: 'sites_of_isolation',
  settings: {
    mysql: {table: 'sites_of_isolation'},
  },
})
export class SiteOfIsolation extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
    mysql: {dataType: 'VARCHAR', dataLength: 100, columnName: 'name'},
  })
  name: string;

  @property({
    type: 'date',
    defaultFn: 'now',
    mysql: {dataType: 'TIMESTAMP', columnName: 'created_at'},
  })
  createdAt?: Date;

  @property({
    type: 'date',
    defaultFn: 'now',
    mysql: {dataType: 'TIMESTAMP', columnName: 'updated_at'},
  })
  updatedAt?: Date;

  constructor(data?: Partial<SiteOfIsolation>) {
    super(data);
  }
}

export interface SiteOfIsolationRelations {}
export type SiteOfIsolationWithRelations = SiteOfIsolation & SiteOfIsolationRelations;
