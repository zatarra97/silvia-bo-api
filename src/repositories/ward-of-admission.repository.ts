import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {WardOfAdmission, WardOfAdmissionRelations} from '../models';

export class WardOfAdmissionRepository extends DefaultCrudRepository<
  WardOfAdmission,
  typeof WardOfAdmission.prototype.id,
  WardOfAdmissionRelations
> {
  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource,
  ) {
    super(WardOfAdmission, dataSource);
  }
}
