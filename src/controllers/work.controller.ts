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
import {Work} from '../models';
import {WorkRepository} from '../repositories';

export class WorkController {
  constructor(
    @repository(WorkRepository)
    public workRepository : WorkRepository,
  ) {}

  @post('/works')
  @response(200, {
    description: 'Work model instance',
    content: {'application/json': {schema: getModelSchemaRef(Work)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Work, {
            title: 'NewWork',
            exclude: ['id'],
          }),
        },
      },
    })
    work: Omit<Work, 'id'>,
  ): Promise<Work> {
    return this.workRepository.create(work);
  }

  @get('/works/count')
  @response(200, {
    description: 'Work model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Work) where?: Where<Work>,
  ): Promise<Count> {
    return this.workRepository.count(where);
  }

  @get('/works')
  @response(200, {
    description: 'Array of Work model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Work, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Work) filter?: Filter<Work>,
  ): Promise<Work[]> {
    return this.workRepository.find(filter);
  }

  @patch('/works')
  @response(200, {
    description: 'Work PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Work, {partial: true}),
        },
      },
    })
    work: Work,
    @param.where(Work) where?: Where<Work>,
  ): Promise<Count> {
    return this.workRepository.updateAll(work, where);
  }

  @get('/works/{id}')
  @response(200, {
    description: 'Work model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Work, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Work, {exclude: 'where'}) filter?: FilterExcludingWhere<Work>
  ): Promise<Work> {
    return this.workRepository.findById(id, filter);
  }

  @patch('/works/{id}')
  @response(204, {
    description: 'Work PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Work, {partial: true}),
        },
      },
    })
    work: Work,
  ): Promise<void> {
    await this.workRepository.updateById(id, work);
  }

  @put('/works/{id}')
  @response(204, {
    description: 'Work PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() work: Work,
  ): Promise<void> {
    await this.workRepository.replaceById(id, work);
  }

  @del('/works/{id}')
  @response(204, {
    description: 'Work DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.workRepository.deleteById(id);
  }
}
