import {Entity, model, property} from '@loopback/repository';

@model({
  name: 'patient_empirical_therapies',
  settings: {
    mysql: {table: 'patient_empirical_therapies'},
  },
})
export class PatientEmpiricalTherapy extends Entity {
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
    mysql: {dataType: 'INT', columnName: 'antimicrobial_therapy_id'},
  })
  antimicrobialTherapyId: number;

  @property({
    type: 'number',
    required: true,
    mysql: {dataType: 'TINYINT', columnName: 'therapy_order'},
  })
  therapyOrder: number;

  @property({
    type: 'date',
    defaultFn: 'now',
    mysql: {dataType: 'TIMESTAMP', columnName: 'created_at'},
  })
  createdAt?: Date;

  constructor(data?: Partial<PatientEmpiricalTherapy>) {
    super(data);
  }
}

export interface PatientEmpiricalTherapyRelations {}
export type PatientEmpiricalTherapyWithRelations = PatientEmpiricalTherapy & PatientEmpiricalTherapyRelations;
