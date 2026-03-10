import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {ResistanceProfile, ResistanceProfileRelations} from '../models';

export class ResistanceProfileRepository extends DefaultCrudRepository<
  ResistanceProfile, typeof ResistanceProfile.prototype.id, ResistanceProfileRelations
> {
  constructor(@inject('datasources.mysql') dataSource: MysqlDataSource) {
    super(ResistanceProfile, dataSource);
  }
}
