import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {BsiPathogen, BsiPathogenRelations} from '../models';

export class BsiPathogenRepository extends DefaultCrudRepository<
  BsiPathogen, typeof BsiPathogen.prototype.id, BsiPathogenRelations
> {
  constructor(@inject('datasources.mysql') dataSource: MysqlDataSource) {
    super(BsiPathogen, dataSource);
  }
}
