import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {PatientTargetedTherapy, PatientTargetedTherapyRelations} from '../models';

export class PatientTargetedTherapyRepository extends DefaultCrudRepository<
  PatientTargetedTherapy,
  typeof PatientTargetedTherapy.prototype.id,
  PatientTargetedTherapyRelations
> {
  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource,
  ) {
    super(PatientTargetedTherapy, dataSource);
  }
}
