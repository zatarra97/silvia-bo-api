import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {PatientIcAstResult, PatientIcAstResultRelations} from '../models';

export class PatientIcAstResultRepository extends DefaultCrudRepository<
  PatientIcAstResult, typeof PatientIcAstResult.prototype.id, PatientIcAstResultRelations
> {
  constructor(@inject('datasources.mysql') dataSource: MysqlDataSource) {
    super(PatientIcAstResult, dataSource);
  }
}
