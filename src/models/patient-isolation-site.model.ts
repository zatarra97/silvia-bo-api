import {Entity, model, property} from '@loopback/repository';

@model({
  name: 'patient_isolation_sites',
  settings: {
    mysql: {table: 'patient_isolation_sites'},
  },
})
export class PatientIsolationSite extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'number',
    required: true,
    mysql: {dataType: 'INT', columnName: 'patient_id'},
  })
  patientId: number;

  @property({
    type: 'number',
    required: true,
    mysql: {dataType: 'INT', columnName: 'site_of_isolation_id'},
  })
  siteOfIsolationId: number;

  @property({
    type: 'number',
    required: true,
    mysql: {dataType: 'TINYINT', columnName: 'pathogen_order'},
  })
  pathogenOrder: number;

  @property({
    type: 'date',
    defaultFn: 'now',
    mysql: {dataType: 'TIMESTAMP', columnName: 'created_at'},
  })
  createdAt?: Date;

  constructor(data?: Partial<PatientIsolationSite>) {
    super(data);
  }
}

export interface PatientIsolationSiteRelations {}
export type PatientIsolationSiteWithRelations = PatientIsolationSite & PatientIsolationSiteRelations;
