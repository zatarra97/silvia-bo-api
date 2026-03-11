import {Entity, model, property, hasMany} from '@loopback/repository';
import {PatientIsolationSite} from './patient-isolation-site.model';
import {PatientBsiPathogen} from './patient-bsi-pathogen.model';
import {PatientEmpiricalTherapy} from './patient-empirical-therapy.model';
import {PatientTargetedTherapy} from './patient-targeted-therapy.model';
import {PatientIcPathogen} from './patient-ic-pathogen.model';

@model({
  name: 'patients',
  settings: {
    mysql: {table: 'patients'},
  },
})
export class Patient extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
    mysql: {dataType: 'VARCHAR', dataLength: 200, columnName: 'name'},
  })
  name: string;

  @property({
    type: 'string',
    mysql: {dataType: 'VARCHAR', dataLength: 50, columnName: 'internal_id'},
  })
  internalId?: string;

  @property({
    type: 'date',
    mysql: {dataType: 'DATE', columnName: 'date_of_birth'},
  })
  dateOfBirth?: string;

  @property({
    type: 'number',
    mysql: {dataType: 'TINYINT', columnName: 'sex'},
  })
  sex?: number;

  @property({
    type: 'number',
    mysql: {dataType: 'INT', columnName: 'ward_of_admission_id'},
  })
  wardOfAdmissionId?: number;

  @property({
    type: 'number',
    mysql: {dataType: 'TINYINT', columnName: 'bsi_onset'},
  })
  bsiOnset?: number;

  @property({
    type: 'date',
    mysql: {dataType: 'DATE', columnName: 'bsi_diagnosis_date'},
  })
  bsiDiagnosisDate?: string;

  @property({
    type: 'number',
    mysql: {dataType: 'INT', columnName: 'sofa_score'},
  })
  sofaScore?: number;

  @property({
    type: 'number',
    mysql: {dataType: 'INT', columnName: 'charlson_comorbidity_index'},
  })
  charlsonComorbidityIndex?: number;

  @property({
    type: 'number',
    mysql: {dataType: 'TINYINT', columnName: 'rectal_colonization_status'},
  })
  rectalColonizationStatus?: number;

  @property({
    type: 'number',
    mysql: {dataType: 'INT', columnName: 'rectal_colonization_pathogen_id'},
  })
  rectalColonizationPathogenId?: number;

  @property({
    type: 'number',
    mysql: {dataType: 'TINYINT', columnName: 'mono_poli_microbial'},
  })
  monoPoliMicrobial?: number;

  @property({
    type: 'number',
    mysql: {dataType: 'TINYINT', columnName: 'combination_therapy'},
  })
  combinationTherapy?: number;

  @property({
    type: 'date',
    mysql: {dataType: 'DATE', columnName: 'date_targeted_therapy'},
  })
  dateTargetedTherapy?: string;

  @property({
    type: 'number',
    mysql: {dataType: 'INT', columnName: 'time_to_appropriate_therapy'},
  })
  timeToAppropriateTherapy?: number;

  @property({
    type: 'number',
    mysql: {dataType: 'TINYINT', columnName: 'outcome'},
  })
  outcome?: number;

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

  @hasMany(() => PatientIsolationSite, {keyTo: 'patientId'})
  isolationSites?: PatientIsolationSite[];

  @hasMany(() => PatientBsiPathogen, {keyTo: 'patientId'})
  bsiPathogens?: PatientBsiPathogen[];

  @hasMany(() => PatientEmpiricalTherapy, {keyTo: 'patientId'})
  empiricalTherapies?: PatientEmpiricalTherapy[];

  @hasMany(() => PatientTargetedTherapy, {keyTo: 'patientId'})
  targetedTherapies?: PatientTargetedTherapy[];

  @hasMany(() => PatientIcPathogen, {keyTo: 'patientId'})
  infectiousComplications?: PatientIcPathogen[];

  constructor(data?: Partial<Patient>) {
    super(data);
  }
}

export interface PatientRelations {
  isolationSites?: PatientIsolationSite[];
  bsiPathogens?: PatientBsiPathogen[];
  empiricalTherapies?: PatientEmpiricalTherapy[];
  targetedTherapies?: PatientTargetedTherapy[];
  infectiousComplications?: PatientIcPathogen[];
}
export type PatientWithRelations = Patient & PatientRelations;
