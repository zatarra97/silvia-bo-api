import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {PatientBsiResistanceProfile, PatientBsiResistanceProfileRelations} from '../models';

export class PatientBsiResistanceProfileRepository extends DefaultCrudRepository<
  PatientBsiResistanceProfile, typeof PatientBsiResistanceProfile.prototype.id, PatientBsiResistanceProfileRelations
> {
  constructor(@inject('datasources.mysql') dataSource: MysqlDataSource) {
    super(PatientBsiResistanceProfile, dataSource);
  }
}
