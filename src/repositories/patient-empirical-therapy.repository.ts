import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {PatientEmpiricalTherapy, PatientEmpiricalTherapyRelations} from '../models';

export class PatientEmpiricalTherapyRepository extends DefaultCrudRepository<
  PatientEmpiricalTherapy,
  typeof PatientEmpiricalTherapy.prototype.id,
  PatientEmpiricalTherapyRelations
> {
  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource,
  ) {
    super(PatientEmpiricalTherapy, dataSource);
  }
}
