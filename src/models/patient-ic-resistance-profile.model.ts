import {Entity, model, property} from '@loopback/repository';

@model({
  name: 'patient_ic_resistance_profiles',
  settings: {mysql: {table: 'patient_ic_resistance_profiles'}},
})
export class PatientIcResistanceProfile extends Entity {
  @property({type: 'number', id: true, generated: true})
  id?: number;

  @property({type: 'number', required: true, mysql: {dataType: 'INT', columnName: 'patient_ic_pathogen_id'}})
  patientIcPathogenId: number;

  @property({type: 'number', required: true, mysql: {dataType: 'INT', columnName: 'resistance_profile_id'}})
  resistanceProfileId: number;

  @property({type: 'date', defaultFn: 'now', mysql: {dataType: 'TIMESTAMP', columnName: 'created_at'}})
  createdAt?: Date;

  constructor(data?: Partial<PatientIcResistanceProfile>) { super(data); }
}

export interface PatientIcResistanceProfileRelations {}
export type PatientIcResistanceProfileWithRelations = PatientIcResistanceProfile & PatientIcResistanceProfileRelations;
