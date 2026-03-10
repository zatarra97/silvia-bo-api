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
import {AntimicrobialTherapy} from '../models';
import {AntimicrobialTherapyRepository} from '../repositories';

@authenticate('cognito')
export class AntimicrobialTherapyController {
  constructor(
    @repository(AntimicrobialTherapyRepository)
    public antimicrobialTherapyRepository: AntimicrobialTherapyRepository,
  ) {}

  @post('/antimicrobial-therapies')
  @response(200, {
    description: 'AntimicrobialTherapy model instance',
    content: {'application/json': {schema: getModelSchemaRef(AntimicrobialTherapy)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(AntimicrobialTherapy, {
            title: 'NewAntimicrobialTherapy',
            exclude: ['id', 'createdAt', 'updatedAt'],
          }),
        },
      },
    })
    antimicrobialTherapy: Omit<AntimicrobialTherapy, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<AntimicrobialTherapy> {
    return this.antimicrobialTherapyRepository.create(antimicrobialTherapy);
  }

  @get('/antimicrobial-therapies/count')
  @response(200, {
    description: 'AntimicrobialTherapy model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(AntimicrobialTherapy) where?: Where<AntimicrobialTherapy>,
  ): Promise<Count> {
    return this.antimicrobialTherapyRepository.count(where);
  }

  @get('/antimicrobial-therapies')
  @response(200, {
    description: 'Array of AntimicrobialTherapy model instances',
    content: {
      'application/json': {
        schema: {type: 'array', items: getModelSchemaRef(AntimicrobialTherapy)},
      },
    },
  })
  async find(
    @param.filter(AntimicrobialTherapy) filter?: Filter<AntimicrobialTherapy>,
  ): Promise<AntimicrobialTherapy[]> {
    return this.antimicrobialTherapyRepository.find(filter);
  }

  @get('/antimicrobial-therapies/{id}')
  @response(200, {
    description: 'AntimicrobialTherapy model instance',
    content: {'application/json': {schema: getModelSchemaRef(AntimicrobialTherapy)}},
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(AntimicrobialTherapy, {exclude: 'where'})
    filter?: FilterExcludingWhere<AntimicrobialTherapy>,
  ): Promise<AntimicrobialTherapy> {
    return this.antimicrobialTherapyRepository.findById(id, filter);
  }

  @patch('/antimicrobial-therapies/{id}')
  @response(204, {description: 'AntimicrobialTherapy PATCH success'})
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(AntimicrobialTherapy, {partial: true}),
        },
      },
    })
    antimicrobialTherapy: Partial<AntimicrobialTherapy>,
  ): Promise<void> {
    await this.antimicrobialTherapyRepository.updateById(id, antimicrobialTherapy);
  }

  @put('/antimicrobial-therapies/{id}')
  @response(204, {description: 'AntimicrobialTherapy PUT success'})
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(AntimicrobialTherapy, {
            exclude: ['id', 'createdAt', 'updatedAt'],
          }),
        },
      },
    })
    antimicrobialTherapy: Omit<AntimicrobialTherapy, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<void> {
    await this.antimicrobialTherapyRepository.updateById(id, antimicrobialTherapy);
  }

  @del('/antimicrobial-therapies/{id}')
  @response(204, {description: 'AntimicrobialTherapy DELETE success'})
  async deleteById(
    @param.path.number('id') id: number,
  ): Promise<void> {
    await this.antimicrobialTherapyRepository.deleteById(id);
  }
}
