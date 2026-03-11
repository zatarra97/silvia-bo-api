import {authenticate} from '@loopback/authentication';
import {
  Count, CountSchema, Filter, FilterExcludingWhere, repository, Where,
} from '@loopback/repository';
import {
  del, get, getModelSchemaRef, param, patch, put, post, requestBody, response,
} from '@loopback/rest';
import {Patient} from '../models';
import {
  PatientRepository,
  PatientIsolationSiteRepository,
  PatientBsiPathogenRepository,
  PatientBsiResistanceProfileRepository,
  PatientBsiAstResultRepository,
  PatientEmpiricalTherapyRepository,
  PatientTargetedTherapyRepository,
  PatientIcPathogenRepository,
  PatientIcResistanceProfileRepository,
  PatientIcAstResultRepository,
  WardOfAdmissionRepository,
} from '../repositories';

const ALL_INCLUDES = [
  {relation: 'isolationSites'},
  {relation: 'bsiPathogens', scope: {include: [{relation: 'resistanceProfiles'}, {relation: 'astResults'}]}},
  {relation: 'infectiousComplications', scope: {include: [{relation: 'resistanceProfiles'}, {relation: 'astResults'}]}},
  {relation: 'empiricalTherapies'},
  {relation: 'targetedTherapies'},
];

@authenticate('cognito')
export class PatientController {
  constructor(
    @repository(PatientRepository) public patientRepository: PatientRepository,
    @repository(PatientIsolationSiteRepository) public patientIsolationSiteRepository: PatientIsolationSiteRepository,
    @repository(PatientBsiPathogenRepository) public patientBsiPathogenRepository: PatientBsiPathogenRepository,
    @repository(PatientBsiResistanceProfileRepository) public patientBsiResistanceProfileRepository: PatientBsiResistanceProfileRepository,
    @repository(PatientBsiAstResultRepository) public patientBsiAstResultRepository: PatientBsiAstResultRepository,
    @repository(PatientEmpiricalTherapyRepository) public patientEmpiricalTherapyRepository: PatientEmpiricalTherapyRepository,
    @repository(PatientTargetedTherapyRepository) public patientTargetedTherapyRepository: PatientTargetedTherapyRepository,
    @repository(PatientIcPathogenRepository) public patientIcPathogenRepository: PatientIcPathogenRepository,
    @repository(PatientIcResistanceProfileRepository) public patientIcResistanceProfileRepository: PatientIcResistanceProfileRepository,
    @repository(PatientIcAstResultRepository) public patientIcAstResultRepository: PatientIcAstResultRepository,
    @repository(WardOfAdmissionRepository) public wardOfAdmissionRepository: WardOfAdmissionRepository,
  ) {}

  private async saveBsiPathogens(patientId: number, bsiPathogens: any[]) {
    for (const bp of bsiPathogens) {
      const {resistanceProfiles, astResults, ...bpData} = bp;
      const created = await this.patientBsiPathogenRepository.create({...bpData, patientId});

      if (resistanceProfiles && resistanceProfiles.length > 0) {
        for (const rp of resistanceProfiles) {
          await this.patientBsiResistanceProfileRepository.create({
            ...rp,
            patientBsiPathogenId: created.id!,
          });
        }
      }

      if (astResults && astResults.length > 0) {
        for (const ar of astResults) {
          await this.patientBsiAstResultRepository.create({
            ...ar,
            patientBsiPathogenId: created.id!,
          });
        }
      }
    }
  }

  private async deleteBsiPathogens(patientId: number) {
    const existing = await this.patientBsiPathogenRepository.find({where: {patientId}});
    for (const bp of existing) {
      await this.patientBsiResistanceProfileRepository.deleteAll({patientBsiPathogenId: bp.id});
      await this.patientBsiAstResultRepository.deleteAll({patientBsiPathogenId: bp.id});
    }
    await this.patientBsiPathogenRepository.deleteAll({patientId});
  }

  private async saveInfectiousComplications(patientId: number, icPathogens: any[]) {
    for (const ic of icPathogens) {
      const {resistanceProfiles, astResults, ...icData} = ic;
      const created = await this.patientIcPathogenRepository.create({...icData, patientId});

      if (resistanceProfiles && resistanceProfiles.length > 0) {
        for (const rp of resistanceProfiles) {
          await this.patientIcResistanceProfileRepository.create({
            ...rp,
            patientIcPathogenId: created.id!,
          });
        }
      }

      if (astResults && astResults.length > 0) {
        for (const ar of astResults) {
          await this.patientIcAstResultRepository.create({
            ...ar,
            patientIcPathogenId: created.id!,
          });
        }
      }
    }
  }

  private async deleteInfectiousComplications(patientId: number) {
    const existing = await this.patientIcPathogenRepository.find({where: {patientId}});
    for (const ic of existing) {
      await this.patientIcResistanceProfileRepository.deleteAll({patientIcPathogenId: ic.id});
      await this.patientIcAstResultRepository.deleteAll({patientIcPathogenId: ic.id});
    }
    await this.patientIcPathogenRepository.deleteAll({patientId});
  }

  @post('/patients')
  @response(200, {content: {'application/json': {schema: getModelSchemaRef(Patient)}}})
  async create(
    @requestBody({content: {'application/json': {schema: {type: 'object'}}}})
    body: any,
  ): Promise<Patient> {
    const {isolationSites, bsiPathogens, infectiousComplications, empiricalTherapies, targetedTherapies, ...patientData} = body;
    const patient = await this.patientRepository.create(patientData);

    if (isolationSites?.length > 0) {
      for (const site of isolationSites) {
        await this.patientIsolationSiteRepository.create({...site, patientId: patient.id!});
      }
    }

    if (bsiPathogens?.length > 0) {
      await this.saveBsiPathogens(patient.id!, bsiPathogens);
    }

    if (infectiousComplications?.length > 0) {
      await this.saveInfectiousComplications(patient.id!, infectiousComplications);
    }

    if (empiricalTherapies?.length > 0) {
      for (const t of empiricalTherapies) {
        await this.patientEmpiricalTherapyRepository.create({...t, patientId: patient.id!});
      }
    }

    if (targetedTherapies?.length > 0) {
      for (const t of targetedTherapies) {
        await this.patientTargetedTherapyRepository.create({...t, patientId: patient.id!});
      }
    }

    return this.patientRepository.findById(patient.id!, {include: ALL_INCLUDES});
  }

  @get('/patients/count')
  @response(200, {content: {'application/json': {schema: CountSchema}}})
  async count(@param.where(Patient) where?: Where<Patient>): Promise<Count> {
    return this.patientRepository.count(where);
  }

  @get('/patients')
  @response(200, {content: {'application/json': {schema: {type: 'array', items: getModelSchemaRef(Patient)}}}})
  async find(@param.filter(Patient) filter?: Filter<Patient>): Promise<any[]> {
    const mergedFilter: Filter<Patient> = {...filter, include: ALL_INCLUDES};
    const patients = await this.patientRepository.find(mergedFilter);

    const wards = await this.wardOfAdmissionRepository.find();
    const wardMap = new Map<number, string>();
    for (const w of wards) { if (w.id != null) wardMap.set(w.id, w.name); }

    return patients.map(p => {
      const enriched = p.toJSON() as any;
      if (p.wardOfAdmissionId != null) enriched.wardOfAdmissionName = wardMap.get(p.wardOfAdmissionId);
      return enriched;
    });
  }

  @get('/patients/{id}')
  @response(200, {content: {'application/json': {schema: getModelSchemaRef(Patient)}}})
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Patient, {exclude: 'where'}) filter?: FilterExcludingWhere<Patient>,
  ): Promise<any> {
    const mergedFilter: FilterExcludingWhere<Patient> = {...filter, include: ALL_INCLUDES};
    const patient = await this.patientRepository.findById(id, mergedFilter);
    const enriched = patient.toJSON() as any;
    if (patient.wardOfAdmissionId != null) {
      const ward = await this.wardOfAdmissionRepository.findById(patient.wardOfAdmissionId);
      enriched.wardOfAdmissionName = ward.name;
    }
    return enriched;
  }

  @patch('/patients/{id}')
  @response(204, {description: 'Patient PATCH success'})
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({content: {'application/json': {schema: {type: 'object'}}}})
    body: any,
  ): Promise<void> {
    const {isolationSites, bsiPathogens, infectiousComplications, empiricalTherapies, targetedTherapies, ...patientData} = body;
    await this.patientRepository.updateById(id, patientData);

    if (isolationSites !== undefined) {
      await this.patientIsolationSiteRepository.deleteAll({patientId: id});
      for (const s of isolationSites) await this.patientIsolationSiteRepository.create({...s, patientId: id});
    }

    if (bsiPathogens !== undefined) {
      await this.deleteBsiPathogens(id);
      if (bsiPathogens.length > 0) await this.saveBsiPathogens(id, bsiPathogens);
    }

    if (infectiousComplications !== undefined) {
      await this.deleteInfectiousComplications(id);
      if (infectiousComplications.length > 0) await this.saveInfectiousComplications(id, infectiousComplications);
    }

    if (empiricalTherapies !== undefined) {
      await this.patientEmpiricalTherapyRepository.deleteAll({patientId: id});
      for (const t of empiricalTherapies) await this.patientEmpiricalTherapyRepository.create({...t, patientId: id});
    }

    if (targetedTherapies !== undefined) {
      await this.patientTargetedTherapyRepository.deleteAll({patientId: id});
      for (const t of targetedTherapies) await this.patientTargetedTherapyRepository.create({...t, patientId: id});
    }
  }

  @put('/patients/{id}')
  @response(204, {description: 'Patient PUT success'})
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody({content: {'application/json': {schema: {type: 'object'}}}})
    body: any,
  ): Promise<void> {
    const {isolationSites, bsiPathogens, infectiousComplications, empiricalTherapies, targetedTherapies, ...patientData} = body;
    delete patientData.id;
    delete patientData.createdAt;
    delete patientData.updatedAt;
    delete patientData.wardOfAdmissionName;

    await this.patientRepository.updateById(id, patientData);

    if (isolationSites !== undefined) {
      await this.patientIsolationSiteRepository.deleteAll({patientId: id});
      for (const s of isolationSites) await this.patientIsolationSiteRepository.create({...s, patientId: id});
    }

    if (bsiPathogens !== undefined) {
      await this.deleteBsiPathogens(id);
      if (bsiPathogens.length > 0) await this.saveBsiPathogens(id, bsiPathogens);
    }

    if (infectiousComplications !== undefined) {
      await this.deleteInfectiousComplications(id);
      if (infectiousComplications.length > 0) await this.saveInfectiousComplications(id, infectiousComplications);
    }

    if (empiricalTherapies !== undefined) {
      await this.patientEmpiricalTherapyRepository.deleteAll({patientId: id});
      for (const t of empiricalTherapies) await this.patientEmpiricalTherapyRepository.create({...t, patientId: id});
    }

    if (targetedTherapies !== undefined) {
      await this.patientTargetedTherapyRepository.deleteAll({patientId: id});
      for (const t of targetedTherapies) await this.patientTargetedTherapyRepository.create({...t, patientId: id});
    }
  }

  @del('/patients/{id}')
  @response(204, {description: 'Patient DELETE success'})
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.deleteBsiPathogens(id);
    await this.deleteInfectiousComplications(id);
    await this.patientIsolationSiteRepository.deleteAll({patientId: id});
    await this.patientEmpiricalTherapyRepository.deleteAll({patientId: id});
    await this.patientTargetedTherapyRepository.deleteAll({patientId: id});
    await this.patientRepository.deleteById(id);
  }
}
