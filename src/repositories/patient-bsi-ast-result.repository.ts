import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {PatientBsiAstResult, PatientBsiAstResultRelations} from '../models';

export class PatientBsiAstResultRepository extends DefaultCrudRepository<
  PatientBsiAstResult, typeof PatientBsiAstResult.prototype.id, PatientBsiAstResultRelations
> {
  constructor(@inject('datasources.mysql') dataSource: MysqlDataSource) {
    super(PatientBsiAstResult, dataSource);
  }
}
