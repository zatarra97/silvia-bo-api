import {Entity, model, property, hasMany} from '@loopback/repository';
import {PatientIcResistanceProfile} from './patient-ic-resistance-profile.model';
import {PatientIcAstResult} from './patient-ic-ast-result.model';

@model({
  name: 'patient_ic_pathogens',
  settings: {mysql: {table: 'patient_ic_pathogens'}},
})
export class PatientIcPathogen extends Entity {
  @property({type: 'number', id: true, generated: true})
  id?: number;

  @property({type: 'number', required: true, mysql: {dataType: 'INT', columnName: 'patient_id'}})
  patientId: number;

  @property({type: 'number', required: true, mysql: {dataType: 'INT', columnName: 'bsi_pathogen_id'}})
  bsiPathogenId: number;

  @property({type: 'number', mysql: {dataType: 'INT', columnName: 'site_of_isolation_id'}})
  siteOfIsolationId?: number;

  @property({type: 'number', required: true, mysql: {dataType: 'TINYINT', columnName: 'pathogen_order'}})
  pathogenOrder: number;

  @property({type: 'date', defaultFn: 'now', mysql: {dataType: 'TIMESTAMP', columnName: 'created_at'}})
  createdAt?: Date;

  @hasMany(() => PatientIcResistanceProfile, {keyTo: 'patientIcPathogenId'})
  resistanceProfiles?: PatientIcResistanceProfile[];

  @hasMany(() => PatientIcAstResult, {keyTo: 'patientIcPathogenId'})
  astResults?: PatientIcAstResult[];

  constructor(data?: Partial<PatientIcPathogen>) { super(data); }
}

export interface PatientIcPathogenRelations {
  resistanceProfiles?: PatientIcResistanceProfile[];
  astResults?: PatientIcAstResult[];
}
export type PatientIcPathogenWithRelations = PatientIcPathogen & PatientIcPathogenRelations;
