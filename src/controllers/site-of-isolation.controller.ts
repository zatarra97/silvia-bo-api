import {authenticate} from '@loopback/authentication';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  param,
  patch,
  put,
  post,
  requestBody,
  response,
} from '@loopback/rest';
import {SiteOfIsolation} from '../models';
import {SiteOfIsolationRepository} from '../repositories';

@authenticate('cognito')
export class SiteOfIsolationController {
  constructor(
    @repository(SiteOfIsolationRepository)
    public siteOfIsolationRepository: SiteOfIsolationRepository,
  ) {}

  @post('/sites-of-isolation')
  @response(200, {
    description: 'SiteOfIsolation model instance',
    content: {'application/json': {schema: getModelSchemaRef(SiteOfIsolation)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(SiteOfIsolation, {
            title: 'NewSiteOfIsolation',
            exclude: ['id', 'createdAt', 'updatedAt'],
          }),
        },
      },
    })
    siteOfIsolation: Omit<SiteOfIsolation, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<SiteOfIsolation> {
    return this.siteOfIsolationRepository.create(siteOfIsolation);
  }

  @get('/sites-of-isolation/count')
  @response(200, {
    description: 'SiteOfIsolation model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(SiteOfIsolation) where?: Where<SiteOfIsolation>,
  ): Promise<Count> {
    return this.siteOfIsolationRepository.count(where);
  }

  @get('/sites-of-isolation')
  @response(200, {
    description: 'Array of SiteOfIsolation model instances',
    content: {
      'application/json': {
        schema: {type: 'array', items: getModelSchemaRef(SiteOfIsolation)},
      },
    },
  })
  async find(
    @param.filter(SiteOfIsolation) filter?: Filter<SiteOfIsolation>,
  ): Promise<SiteOfIsolation[]> {
    return this.siteOfIsolationRepository.find(filter);
  }

  @get('/sites-of-isolation/{id}')
  @response(200, {
    description: 'SiteOfIsolation model instance',
    content: {'application/json': {schema: getModelSchemaRef(SiteOfIsolation)}},
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(SiteOfIsolation, {exclude: 'where'})
    filter?: FilterExcludingWhere<SiteOfIsolation>,
  ): Promise<SiteOfIsolation> {
    return this.siteOfIsolationRepository.findById(id, filter);
  }

  @patch('/sites-of-isolation/{id}')
  @response(204, {description: 'SiteOfIsolation PATCH success'})
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(SiteOfIsolation, {partial: true}),
        },
      },
    })
    siteOfIsolation: Partial<SiteOfIsolation>,
  ): Promise<void> {
    await this.siteOfIsolationRepository.updateById(id, siteOfIsolation);
  }

  @put('/sites-of-isolation/{id}')
  @response(204, {description: 'SiteOfIsolation PUT success'})
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(SiteOfIsolation, {
            exclude: ['id', 'createdAt', 'updatedAt'],
          }),
        },
      },
    })
    siteOfIsolation: Omit<SiteOfIsolation, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<void> {
    await this.siteOfIsolationRepository.updateById(id, siteOfIsolation);
  }

  @del('/sites-of-isolation/{id}')
  @response(204, {description: 'SiteOfIsolation DELETE success'})
  async deleteById(
    @param.path.number('id') id: number,
  ): Promise<void> {
    await this.siteOfIsolationRepository.deleteById(id);
  }
}
