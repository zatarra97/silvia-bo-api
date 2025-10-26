import {inject} from '@loopback/core';
import {
  DefaultCrudRepository,
  juggler,
} from '@loopback/repository';
import {MonitorOffer, MonitorOfferRelations} from '../models';

export class MonitorOfferRepository extends DefaultCrudRepository<
  MonitorOffer,
  typeof MonitorOffer.prototype.id,
  MonitorOfferRelations
> {
  constructor(
    @inject('datasources.mysql') dataSource: juggler.DataSource,
  ) {
    super(MonitorOffer, dataSource);
  }
}

