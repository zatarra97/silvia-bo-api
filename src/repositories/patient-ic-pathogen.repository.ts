import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {PatientIcPathogen, PatientIcPathogenRelations, PatientIcResistanceProfile, PatientIcAstResult} from '../models';
import {PatientIcResistanceProfileRepository} from './patient-ic-resistance-profile.repository';
import {PatientIcAstResultRepository} from './patient-ic-ast-result.repository';

export class PatientIcPathogenRepository extends DefaultCrudRepository<
  PatientIcPathogen, typeof PatientIcPathogen.prototype.id, PatientIcPathogenRelations
> {
  public readonly resistanceProfiles: HasManyRepositoryFactory<PatientIcResistanceProfile, typeof PatientIcPathogen.prototype.id>;
  public readonly astResults: HasManyRepositoryFactory<PatientIcAstResult, typeof PatientIcPathogen.prototype.id>;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource,
    @repository.getter('PatientIcResistanceProfileRepository')
    protected resistanceProfileRepoGetter: Getter<PatientIcResistanceProfileRepository>,
    @repository.getter('PatientIcAstResultRepository')
    protected astResultRepoGetter: Getter<PatientIcAstResultRepository>,
  ) {
    super(PatientIcPathogen, dataSource);
    this.resistanceProfiles = this.createHasManyRepositoryFactoryFor('resistanceProfiles', resistanceProfileRepoGetter);
    this.registerInclusionResolver('resistanceProfiles', this.resistanceProfiles.inclusionResolver);
    this.astResults = this.createHasManyRepositoryFactoryFor('astResults', astResultRepoGetter);
    this.registerInclusionResolver('astResults', this.astResults.inclusionResolver);
  }
}
