import { inject } from '@loopback/core';
import { DefaultCrudRepository } from '@loopback/repository';
import { MysqlDataSource } from '../datasources/mysql.datasource';
import { IkeaOffer, IkeaOfferRelations } from '../models';

export class IkeaOfferRepository extends DefaultCrudRepository<
  IkeaOffer,
  typeof IkeaOffer.prototype.id,
  IkeaOfferRelations
> {
  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource,
  ) {
    super(IkeaOffer, dataSource);
  }
}

