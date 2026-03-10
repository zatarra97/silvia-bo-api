import {Entity, model, property} from '@loopback/repository';

@model({
  name: 'ast_antibiotics',
  settings: {mysql: {table: 'ast_antibiotics'}},
})
export class AstAntibiotic extends Entity {
  @property({type: 'number', id: true, generated: true})
  id?: number;

  @property({type: 'string', required: true, mysql: {dataType: 'VARCHAR', dataLength: 150, columnName: 'name'}})
  name: string;

  @property({type: 'date', defaultFn: 'now', mysql: {dataType: 'TIMESTAMP', columnName: 'created_at'}})
  createdAt?: Date;

  @property({type: 'date', defaultFn: 'now', mysql: {dataType: 'TIMESTAMP', columnName: 'updated_at'}})
  updatedAt?: Date;

  constructor(data?: Partial<AstAntibiotic>) { super(data); }
}

export interface AstAntibioticRelations {}
export type AstAntibioticWithRelations = AstAntibiotic & AstAntibioticRelations;
