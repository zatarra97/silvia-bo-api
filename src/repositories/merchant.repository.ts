import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, DefaultCrudRepository, repository} from '@loopback/repository';
import {MysqlDataSource} from '../datasources/mysql.datasource';
import {Merchant, MerchantRelations, User} from '../models';
import {UserRepository} from './user.repository';

export class MerchantRepository extends DefaultCrudRepository<
  Merchant,
  typeof Merchant.prototype.id,
  MerchantRelations
> {
  public readonly user: BelongsToAccessor<User, typeof Merchant.prototype.id>;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource,
    @repository.getter('UserRepository')
    protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(Merchant, dataSource);
    this.user = this.createBelongsToAccessorFor(
      'user',
      userRepositoryGetter,
    );
    this.registerInclusionResolver('user', this.user.inclusionResolver);
  }
}
