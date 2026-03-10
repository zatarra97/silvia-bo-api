import {Entity, model, property} from '@loopback/repository';

@model({
  name: 'patient_targeted_therapies',
  settings: {
    mysql: {table: 'patient_targeted_therapies'},
  },
})
export class PatientTargetedTherapy extends Entity {
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

  constructor(data?: Partial<PatientTargetedTherapy>) {
    super(data);
  }
}

export interface PatientTargetedTherapyRelations {}
export type PatientTargetedTherapyWithRelations = PatientTargetedTherapy & PatientTargetedTherapyRelations;
