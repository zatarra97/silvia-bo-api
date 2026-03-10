import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {PatientIsolationSite, PatientIsolationSiteRelations} from '../models';

export class PatientIsolationSiteRepository extends DefaultCrudRepository<
  PatientIsolationSite,
  typeof PatientIsolationSite.prototype.id,
  PatientIsolationSiteRelations
> {
  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource,
  ) {
    super(PatientIsolationSite, dataSource);
  }
}
