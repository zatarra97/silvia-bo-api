import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, DefaultCrudRepository, repository} from '@loopback/repository';
import {MysqlDataSource} from '../datasources/mysql.datasource';
import {Merchant, OpeningHour, OpeningHourRelations} from '../models';
import {MerchantRepository} from './merchant.repository';

export class OpeningHourRepository extends DefaultCrudRepository<
  OpeningHour,
  typeof OpeningHour.prototype.id,
  OpeningHourRelations
> {
  public readonly merchant: BelongsToAccessor<Merchant, typeof OpeningHour.prototype.id>;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource,
    @repository.getter('MerchantRepository')
    protected merchantRepositoryGetter: Getter<MerchantRepository>,
  ) {
    super(OpeningHour, dataSource);
    this.merchant = this.createBelongsToAccessorFor(
      'merchant',
      merchantRepositoryGetter,
    );
    this.registerInclusionResolver('merchant', this.merchant.inclusionResolver);
  }
}
