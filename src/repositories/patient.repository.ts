import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {Patient, PatientRelations, PatientIsolationSite, PatientBsiPathogen, PatientEmpiricalTherapy, PatientTargetedTherapy} from '../models';
import {PatientIsolationSiteRepository} from './patient-isolation-site.repository';
import {PatientBsiPathogenRepository} from './patient-bsi-pathogen.repository';
import {PatientEmpiricalTherapyRepository} from './patient-empirical-therapy.repository';
import {PatientTargetedTherapyRepository} from './patient-targeted-therapy.repository';

export class PatientRepository extends DefaultCrudRepository<
  Patient, typeof Patient.prototype.id, PatientRelations
> {
  public readonly isolationSites: HasManyRepositoryFactory<PatientIsolationSite, typeof Patient.prototype.id>;
  public readonly bsiPathogens: HasManyRepositoryFactory<PatientBsiPathogen, typeof Patient.prototype.id>;
  public readonly empiricalTherapies: HasManyRepositoryFactory<PatientEmpiricalTherapy, typeof Patient.prototype.id>;
  public readonly targetedTherapies: HasManyRepositoryFactory<PatientTargetedTherapy, typeof Patient.prototype.id>;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource,
    @repository.getter('PatientIsolationSiteRepository')
    protected patientIsolationSiteRepositoryGetter: Getter<PatientIsolationSiteRepository>,
    @repository.getter('PatientBsiPathogenRepository')
    protected patientBsiPathogenRepositoryGetter: Getter<PatientBsiPathogenRepository>,
    @repository.getter('PatientEmpiricalTherapyRepository')
    protected patientEmpiricalTherapyRepositoryGetter: Getter<PatientEmpiricalTherapyRepository>,
    @repository.getter('PatientTargetedTherapyRepository')
    protected patientTargetedTherapyRepositoryGetter: Getter<PatientTargetedTherapyRepository>,
  ) {
    super(Patient, dataSource);

    this.isolationSites = this.createHasManyRepositoryFactoryFor('isolationSites', patientIsolationSiteRepositoryGetter);
    this.registerInclusionResolver('isolationSites', this.isolationSites.inclusionResolver);

    this.bsiPathogens = this.createHasManyRepositoryFactoryFor('bsiPathogens', patientBsiPathogenRepositoryGetter);
    this.registerInclusionResolver('bsiPathogens', this.bsiPathogens.inclusionResolver);

    this.empiricalTherapies = this.createHasManyRepositoryFactoryFor('empiricalTherapies', patientEmpiricalTherapyRepositoryGetter);
    this.registerInclusionResolver('empiricalTherapies', this.empiricalTherapies.inclusionResolver);

    this.targetedTherapies = this.createHasManyRepositoryFactoryFor('targetedTherapies', patientTargetedTherapyRepositoryGetter);
    this.registerInclusionResolver('targetedTherapies', this.targetedTherapies.inclusionResolver);
  }
}
