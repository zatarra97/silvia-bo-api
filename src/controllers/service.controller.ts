import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/core';
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
  post,
  put,
  requestBody,
  response,
} from '@loopback/rest';
import {SecurityBindings, UserProfile} from '@loopback/security';
import {Service} from '../models';
import {ServiceRepository} from '../repositories';
import {requireAdmin} from '../utils/authorization';

@authenticate('cognito')
export class ServiceController {
  constructor(
    @repository(ServiceRepository)
    public serviceRepository: ServiceRepository,
  ) {}

  @post('/services')
  @response(200, {
    description: 'Service model instance',
    content: {'application/json': {schema: getModelSchemaRef(Service)}},
  })
  async create(
    @inject(SecurityBindings.USER) currentUser: UserProfile,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Service, {
            title: 'NewService',
            exclude: ['id', 'createdAt', 'updatedAt'],
          }),
        },
      },
    })
    service: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Service> {
    requireAdmin(currentUser);
    return this.serviceRepository.create(service);
  }

  @get('/services/count')
  @response(200, {
    description: 'Service model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Service) where?: Where<Service>,
  ): Promise<Count> {
    return this.serviceRepository.count(where);
  }

  @get('/services')
  @response(200, {
    description: 'Array of Service model instances',
    content: {
      'application/json': {
        schema: {type: 'array', items: getModelSchemaRef(Service)},
      },
    },
  })
  async find(
    @param.filter(Service) filter?: Filter<Service>,
  ): Promise<Service[]> {
    return this.serviceRepository.find(filter);
  }

  @get('/services/{id}')
  @response(200, {
    description: 'Service model instance',
    content: {'application/json': {schema: getModelSchemaRef(Service)}},
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Service, {exclude: 'where'})
    filter?: FilterExcludingWhere<Service>,
  ): Promise<Service> {
    return this.serviceRepository.findById(id, filter);
  }

  @patch('/services/{id}')
  @response(204, {description: 'Service PATCH success'})
  async updateById(
    @inject(SecurityBindings.USER) currentUser: UserProfile,
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Service, {partial: true}),
        },
      },
    })
    service: Partial<Service>,
  ): Promise<void> {
    requireAdmin(currentUser);
    await this.serviceRepository.updateById(id, service);
  }

  @put('/services/{id}')
  @response(204, {description: 'Service PUT success'})
  async replaceById(
    @inject(SecurityBindings.USER) currentUser: UserProfile,
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Service, {
            exclude: ['id', 'createdAt', 'updatedAt'],
          }),
        },
      },
    })
    service: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<void> {
    requireAdmin(currentUser);
    await this.serviceRepository.replaceById(id, service);
  }

  @del('/services/{id}')
  @response(204, {description: 'Service DELETE success'})
  async deleteById(
    @inject(SecurityBindings.USER) currentUser: UserProfile,
    @param.path.number('id') id: number,
  ): Promise<void> {
    requireAdmin(currentUser);
    await this.serviceRepository.deleteById(id);
  }
}
