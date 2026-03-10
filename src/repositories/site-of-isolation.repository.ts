import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {SiteOfIsolation, SiteOfIsolationRelations} from '../models';

export class SiteOfIsolationRepository extends DefaultCrudRepository<
  SiteOfIsolation,
  typeof SiteOfIsolation.prototype.id,
  SiteOfIsolationRelations
> {
  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource,
  ) {
    super(SiteOfIsolation, dataSource);
  }
}
