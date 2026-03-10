import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {AntimicrobialTherapy, AntimicrobialTherapyRelations} from '../models';

export class AntimicrobialTherapyRepository extends DefaultCrudRepository<
  AntimicrobialTherapy,
  typeof AntimicrobialTherapy.prototype.id,
  AntimicrobialTherapyRelations
> {
  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource,
  ) {
    super(AntimicrobialTherapy, dataSource);
  }
}
