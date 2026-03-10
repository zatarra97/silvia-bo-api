import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {PatientBsiPathogen, PatientBsiPathogenRelations, PatientBsiResistanceProfile, PatientBsiAstResult} from '../models';
import {PatientBsiResistanceProfileRepository} from './patient-bsi-resistance-profile.repository';
import {PatientBsiAstResultRepository} from './patient-bsi-ast-result.repository';

export class PatientBsiPathogenRepository extends DefaultCrudRepository<
  PatientBsiPathogen, typeof PatientBsiPathogen.prototype.id, PatientBsiPathogenRelations
> {
  public readonly resistanceProfiles: HasManyRepositoryFactory<PatientBsiResistanceProfile, typeof PatientBsiPathogen.prototype.id>;
  public readonly astResults: HasManyRepositoryFactory<PatientBsiAstResult, typeof PatientBsiPathogen.prototype.id>;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource,
    @repository.getter('PatientBsiResistanceProfileRepository')
    protected resistanceProfileRepoGetter: Getter<PatientBsiResistanceProfileRepository>,
    @repository.getter('PatientBsiAstResultRepository')
    protected astResultRepoGetter: Getter<PatientBsiAstResultRepository>,
  ) {
    super(PatientBsiPathogen, dataSource);
    this.resistanceProfiles = this.createHasManyRepositoryFactoryFor('resistanceProfiles', resistanceProfileRepoGetter);
    this.registerInclusionResolver('resistanceProfiles', this.resistanceProfiles.inclusionResolver);
    this.astResults = this.createHasManyRepositoryFactoryFor('astResults', astResultRepoGetter);
    this.registerInclusionResolver('astResults', this.astResults.inclusionResolver);
  }
}
