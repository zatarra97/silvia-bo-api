import {Entity, model, property} from '@loopback/repository';

@model({
  name: 'bsi_pathogens',
  settings: {mysql: {table: 'bsi_pathogens'}},
})
export class BsiPathogen extends Entity {
  @property({type: 'number', id: true, generated: true})
  id?: number;

  @property({type: 'string', required: true, mysql: {dataType: 'VARCHAR', dataLength: 150, columnName: 'name'}})
  name: string;

  @property({type: 'date', defaultFn: 'now', mysql: {dataType: 'TIMESTAMP', columnName: 'created_at'}})
  createdAt?: Date;

  @property({type: 'date', defaultFn: 'now', mysql: {dataType: 'TIMESTAMP', columnName: 'updated_at'}})
  updatedAt?: Date;

  constructor(data?: Partial<BsiPathogen>) { super(data); }
}

export interface BsiPathogenRelations {}
export type BsiPathogenWithRelations = BsiPathogen & BsiPathogenRelations;
