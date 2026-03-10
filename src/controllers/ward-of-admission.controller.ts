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
import {WardOfAdmission} from '../models';
import {WardOfAdmissionRepository} from '../repositories';

@authenticate('cognito')
export class WardOfAdmissionController {
  constructor(
    @repository(WardOfAdmissionRepository)
    public wardOfAdmissionRepository: WardOfAdmissionRepository,
  ) {}

  @post('/wards-of-admission')
  @response(200, {
    description: 'WardOfAdmission model instance',
    content: {'application/json': {schema: getModelSchemaRef(WardOfAdmission)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(WardOfAdmission, {
            title: 'NewWardOfAdmission',
            exclude: ['id', 'createdAt', 'updatedAt'],
          }),
        },
      },
    })
    wardOfAdmission: Omit<WardOfAdmission, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<WardOfAdmission> {
    return this.wardOfAdmissionRepository.create(wardOfAdmission);
  }

  @get('/wards-of-admission/count')
  @response(200, {
    description: 'WardOfAdmission model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(WardOfAdmission) where?: Where<WardOfAdmission>,
  ): Promise<Count> {
    return this.wardOfAdmissionRepository.count(where);
  }

  @get('/wards-of-admission')
  @response(200, {
    description: 'Array of WardOfAdmission model instances',
    content: {
      'application/json': {
        schema: {type: 'array', items: getModelSchemaRef(WardOfAdmission)},
      },
    },
  })
  async find(
    @param.filter(WardOfAdmission) filter?: Filter<WardOfAdmission>,
  ): Promise<WardOfAdmission[]> {
    return this.wardOfAdmissionRepository.find(filter);
  }

  @get('/wards-of-admission/{id}')
  @response(200, {
    description: 'WardOfAdmission model instance',
    content: {'application/json': {schema: getModelSchemaRef(WardOfAdmission)}},
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(WardOfAdmission, {exclude: 'where'})
    filter?: FilterExcludingWhere<WardOfAdmission>,
  ): Promise<WardOfAdmission> {
    return this.wardOfAdmissionRepository.findById(id, filter);
  }

  @patch('/wards-of-admission/{id}')
  @response(204, {description: 'WardOfAdmission PATCH success'})
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(WardOfAdmission, {partial: true}),
        },
      },
    })
    wardOfAdmission: Partial<WardOfAdmission>,
  ): Promise<void> {
    await this.wardOfAdmissionRepository.updateById(id, wardOfAdmission);
  }

  @put('/wards-of-admission/{id}')
  @response(204, {description: 'WardOfAdmission PUT success'})
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(WardOfAdmission, {
            exclude: ['id', 'createdAt', 'updatedAt'],
          }),
        },
      },
    })
    wardOfAdmission: Omit<WardOfAdmission, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<void> {
    await this.wardOfAdmissionRepository.updateById(id, wardOfAdmission);
  }

  @del('/wards-of-admission/{id}')
  @response(204, {description: 'WardOfAdmission DELETE success'})
  async deleteById(
    @param.path.number('id') id: number,
  ): Promise<void> {
    await this.wardOfAdmissionRepository.deleteById(id);
  }
}
