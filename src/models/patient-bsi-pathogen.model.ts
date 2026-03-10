import {Entity, model, property, hasMany} from '@loopback/repository';
import {PatientBsiResistanceProfile} from './patient-bsi-resistance-profile.model';
import {PatientBsiAstResult} from './patient-bsi-ast-result.model';

@model({
  name: 'patient_bsi_pathogens',
  settings: {mysql: {table: 'patient_bsi_pathogens'}},
})
export class PatientBsiPathogen extends Entity {
  @property({type: 'number', id: true, generated: true})
  id?: number;

  @property({type: 'number', required: true, mysql: {dataType: 'INT', columnName: 'patient_id'}})
  patientId: number;

  @property({type: 'number', required: true, mysql: {dataType: 'INT', columnName: 'bsi_pathogen_id'}})
  bsiPathogenId: number;

  @property({type: 'number', required: true, mysql: {dataType: 'TINYINT', columnName: 'pathogen_order'}})
  pathogenOrder: number;

  @property({type: 'date', defaultFn: 'now', mysql: {dataType: 'TIMESTAMP', columnName: 'created_at'}})
  createdAt?: Date;

  @hasMany(() => PatientBsiResistanceProfile, {keyTo: 'patientBsiPathogenId'})
  resistanceProfiles?: PatientBsiResistanceProfile[];

  @hasMany(() => PatientBsiAstResult, {keyTo: 'patientBsiPathogenId'})
  astResults?: PatientBsiAstResult[];

  constructor(data?: Partial<PatientBsiPathogen>) { super(data); }
}

export interface PatientBsiPathogenRelations {
  resistanceProfiles?: PatientBsiResistanceProfile[];
  astResults?: PatientBsiAstResult[];
}
export type PatientBsiPathogenWithRelations = PatientBsiPathogen & PatientBsiPathogenRelations;
