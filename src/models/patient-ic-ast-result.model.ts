import {Entity, model, property} from '@loopback/repository';

@model({
  name: 'patient_ic_ast_results',
  settings: {mysql: {table: 'patient_ic_ast_results'}},
})
export class PatientIcAstResult extends Entity {
  @property({type: 'number', id: true, generated: true})
  id?: number;

  @property({type: 'number', required: true, mysql: {dataType: 'INT', columnName: 'patient_ic_pathogen_id'}})
  patientIcPathogenId: number;

  @property({type: 'number', required: true, mysql: {dataType: 'INT', columnName: 'ast_antibiotic_id'}})
  astAntibioticId: number;

  @property({type: 'number', mysql: {dataType: 'TINYINT', columnName: 'ast_value'}})
  astValue?: number;

  @property({type: 'string', mysql: {dataType: 'VARCHAR', dataLength: 20, columnName: 'mic_value'}})
  micValue?: string;

  @property({type: 'date', defaultFn: 'now', mysql: {dataType: 'TIMESTAMP', columnName: 'created_at'}})
  createdAt?: Date;

  constructor(data?: Partial<PatientIcAstResult>) { super(data); }
}

export interface PatientIcAstResultRelations {}
export type PatientIcAstResultWithRelations = PatientIcAstResult & PatientIcAstResultRelations;
