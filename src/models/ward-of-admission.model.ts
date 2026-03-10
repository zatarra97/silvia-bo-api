import {Entity, model, property} from '@loopback/repository';

@model({
  name: 'wards_of_admission',
  settings: {
    mysql: {table: 'wards_of_admission'},
  },
})
export class WardOfAdmission extends Entity {
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

  constructor(data?: Partial<WardOfAdmission>) {
    super(data);
  }
}

export interface WardOfAdmissionRelations {}
export type WardOfAdmissionWithRelations = WardOfAdmission & WardOfAdmissionRelations;
