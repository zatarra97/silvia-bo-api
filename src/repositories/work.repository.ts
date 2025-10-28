import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MysqlDataSource} from '../datasources/mysql.datasource';
import {Work, WorkRelations} from '../models/work.model';

export class WorkRepository extends DefaultCrudRepository<
  Work,
  typeof Work.prototype.id,
  WorkRelations
> {
  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource,
  ) {
    super(Work, dataSource);
  }
}

