import {Entity, model, property} from '@loopback/repository';

@model({
  name: 'antimicrobial_therapies',
  settings: {
    mysql: {table: 'antimicrobial_therapies'},
  },
})
export class AntimicrobialTherapy extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
    mysql: {dataType: 'VARCHAR', dataLength: 150, columnName: 'name'},
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

  constructor(data?: Partial<AntimicrobialTherapy>) {
    super(data);
  }
}

export interface AntimicrobialTherapyRelations {}
export type AntimicrobialTherapyWithRelations = AntimicrobialTherapy & AntimicrobialTherapyRelations;
