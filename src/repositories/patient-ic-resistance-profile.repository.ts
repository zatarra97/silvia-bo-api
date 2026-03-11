import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {PatientIcResistanceProfile, PatientIcResistanceProfileRelations} from '../models';

export class PatientIcResistanceProfileRepository extends DefaultCrudRepository<
  PatientIcResistanceProfile, typeof PatientIcResistanceProfile.prototype.id, PatientIcResistanceProfileRelations
> {
  constructor(@inject('datasources.mysql') dataSource: MysqlDataSource) {
    super(PatientIcResistanceProfile, dataSource);
  }
}
