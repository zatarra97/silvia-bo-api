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
import {OpeningHour} from '../models';
import {OpeningHourRepository} from '../repositories';

export class OpeningHourController {
  constructor(
    @repository(OpeningHourRepository)
    public openingHourRepository : OpeningHourRepository,
  ) {}

  @post('/opening-hours')
  @response(200, {
    description: 'OpeningHour model instance',
    content: {'application/json': {schema: getModelSchemaRef(OpeningHour)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(OpeningHour, {
            title: 'NewOpeningHour',
            exclude: ['id'],
          }),
        },
      },
    })
    openingHour: Omit<OpeningHour, 'id'>,
  ): Promise<OpeningHour> {
    return this.openingHourRepository.create(openingHour);
  }

  @get('/opening-hours/count')
  @response(200, {
    description: 'OpeningHour model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(OpeningHour) where?: Where<OpeningHour>,
  ): Promise<Count> {
    return this.openingHourRepository.count(where);
  }

  @get('/opening-hours')
  @response(200, {
    description: 'Array of OpeningHour model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(OpeningHour, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(OpeningHour) filter?: Filter<OpeningHour>,
  ): Promise<OpeningHour[]> {
    return this.openingHourRepository.find(filter);
  }

  @patch('/opening-hours')
  @response(200, {
    description: 'OpeningHour PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(OpeningHour, {partial: true}),
        },
      },
    })
    openingHour: OpeningHour,
    @param.where(OpeningHour) where?: Where<OpeningHour>,
  ): Promise<Count> {
    return this.openingHourRepository.updateAll(openingHour, where);
  }

  @get('/opening-hours/{id}')
  @response(200, {
    description: 'OpeningHour model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(OpeningHour, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(OpeningHour, {exclude: 'where'}) filter?: FilterExcludingWhere<OpeningHour>
  ): Promise<OpeningHour> {
    return this.openingHourRepository.findById(id, filter);
  }

  @patch('/opening-hours/{id}')
  @response(204, {
    description: 'OpeningHour PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(OpeningHour, {partial: true}),
        },
      },
    })
    openingHour: OpeningHour,
  ): Promise<void> {
    await this.openingHourRepository.updateById(id, openingHour);
  }

  @put('/opening-hours/{id}')
  @response(204, {
    description: 'OpeningHour PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() openingHour: OpeningHour,
  ): Promise<void> {
    await this.openingHourRepository.replaceById(id, openingHour);
  }

  @del('/opening-hours/{id}')
  @response(204, {
    description: 'OpeningHour DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.openingHourRepository.deleteById(id);
  }
}
