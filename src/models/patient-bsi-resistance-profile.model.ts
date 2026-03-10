import {Entity, model, property} from '@loopback/repository';

@model({
  name: 'patient_bsi_resistance_profiles',
  settings: {mysql: {table: 'patient_bsi_resistance_profiles'}},
})
export class PatientBsiResistanceProfile extends Entity {
  @property({type: 'number', id: true, generated: true})
  id?: number;

  @property({type: 'number', required: true, mysql: {dataType: 'INT', columnName: 'patient_bsi_pathogen_id'}})
  patientBsiPathogenId: number;

  @property({type: 'number', required: true, mysql: {dataType: 'INT', columnName: 'resistance_profile_id'}})
  resistanceProfileId: number;

  @property({type: 'date', defaultFn: 'now', mysql: {dataType: 'TIMESTAMP', columnName: 'created_at'}})
  createdAt?: Date;

  constructor(data?: Partial<PatientBsiResistanceProfile>) { super(data); }
}

export interface PatientBsiResistanceProfileRelations {}
export type PatientBsiResistanceProfileWithRelations = PatientBsiResistanceProfile & PatientBsiResistanceProfileRelations;
