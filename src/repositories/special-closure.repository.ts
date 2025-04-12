import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, DefaultCrudRepository, repository} from '@loopback/repository';
import {MysqlDataSource} from '../datasources/mysql.datasource';
import {Merchant, SpecialClosure, SpecialClosureRelations} from '../models';
import {MerchantRepository} from './merchant.repository';

export class SpecialClosureRepository extends DefaultCrudRepository<
  SpecialClosure,
  typeof SpecialClosure.prototype.id,
  SpecialClosureRelations
> {
  public readonly merchant: BelongsToAccessor<Merchant, typeof SpecialClosure.prototype.id>;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource,
    @repository.getter('MerchantRepository')
    protected merchantRepositoryGetter: Getter<MerchantRepository>,
  ) {
    super(SpecialClosure, dataSource);
    this.merchant = this.createBelongsToAccessorFor(
      'merchant',
      merchantRepositoryGetter,
    );
    this.registerInclusionResolver('merchant', this.merchant.inclusionResolver);
  }
}
