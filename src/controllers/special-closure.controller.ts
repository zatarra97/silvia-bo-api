import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {SpecialClosure} from '../models';
import {SpecialClosureRepository} from '../repositories';

export class SpecialClosureController {
  constructor(
    @repository(SpecialClosureRepository)
    public specialClosureRepository : SpecialClosureRepository,
  ) {}

  @post('/special-closures')
  @response(200, {
    description: 'SpecialClosure model instance',
    content: {'application/json': {schema: getModelSchemaRef(SpecialClosure)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(SpecialClosure, {
            title: 'NewSpecialClosure',
            exclude: ['id'],
          }),
        },
      },
    })
    specialClosure: Omit<SpecialClosure, 'id'>,
  ): Promise<SpecialClosure> {
    return this.specialClosureRepository.create(specialClosure);
  }

  @get('/special-closures/count')
  @response(200, {
    description: 'SpecialClosure model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(SpecialClosure) where?: Where<SpecialClosure>,
  ): Promise<Count> {
    return this.specialClosureRepository.count(where);
  }

  @get('/special-closures')
  @response(200, {
    description: 'Array of SpecialClosure model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(SpecialClosure, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(SpecialClosure) filter?: Filter<SpecialClosure>,
  ): Promise<SpecialClosure[]> {
    return this.specialClosureRepository.find(filter);
  }

  @patch('/special-closures')
  @response(200, {
    description: 'SpecialClosure PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(SpecialClosure, {partial: true}),
        },
      },
    })
    specialClosure: SpecialClosure,
    @param.where(SpecialClosure) where?: Where<SpecialClosure>,
  ): Promise<Count> {
    return this.specialClosureRepository.updateAll(specialClosure, where);
  }

  @get('/special-closures/{id}')
  @response(200, {
    description: 'SpecialClosure model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(SpecialClosure, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(SpecialClosure, {exclude: 'where'}) filter?: FilterExcludingWhere<SpecialClosure>
  ): Promise<SpecialClosure> {
    return this.specialClosureRepository.findById(id, filter);
  }

  @patch('/special-closures/{id}')
  @response(204, {
    description: 'SpecialClosure PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(SpecialClosure, {partial: true}),
        },
      },
    })
    specialClosure: SpecialClosure,
  ): Promise<void> {
    await this.specialClosureRepository.updateById(id, specialClosure);
  }

  @put('/special-closures/{id}')
  @response(204, {
    description: 'SpecialClosure PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() specialClosure: SpecialClosure,
  ): Promise<void> {
    await this.specialClosureRepository.replaceById(id, specialClosure);
  }

  @del('/special-closures/{id}')
  @response(204, {
    description: 'SpecialClosure DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.specialClosureRepository.deleteById(id);
  }
}
