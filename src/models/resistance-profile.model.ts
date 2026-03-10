import {Entity, model, property} from '@loopback/repository';

@model({
  name: 'resistance_profiles',
  settings: {mysql: {table: 'resistance_profiles'}},
})
export class ResistanceProfile extends Entity {
  @property({type: 'number', id: true, generated: true})
  id?: number;

  @property({type: 'string', required: true, mysql: {dataType: 'VARCHAR', dataLength: 150, columnName: 'name'}})
  name: string;

  @property({type: 'date', defaultFn: 'now', mysql: {dataType: 'TIMESTAMP', columnName: 'created_at'}})
  createdAt?: Date;

  @property({type: 'date', defaultFn: 'now', mysql: {dataType: 'TIMESTAMP', columnName: 'updated_at'}})
  updatedAt?: Date;

  constructor(data?: Partial<ResistanceProfile>) { super(data); }
}

export interface ResistanceProfileRelations {}
export type ResistanceProfileWithRelations = ResistanceProfile & ResistanceProfileRelations;
