import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {AstAntibiotic, AstAntibioticRelations} from '../models';

export class AstAntibioticRepository extends DefaultCrudRepository<
  AstAntibiotic, typeof AstAntibiotic.prototype.id, AstAntibioticRelations
> {
  constructor(@inject('datasources.mysql') dataSource: MysqlDataSource) {
    super(AstAntibiotic, dataSource);
  }
}
