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
import {MonitorOffer} from '../models';
import {MonitorOfferRepository} from '../repositories';

export class MonitorOfferController {
  constructor(
    @repository(MonitorOfferRepository)
    public monitorOfferRepository : MonitorOfferRepository,
  ) {}

  @post('/monitor-offers')
  @response(200, {
    description: 'MonitorOffer model instance',
    content: {'application/json': {schema: getModelSchemaRef(MonitorOffer)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(MonitorOffer, {
            title: 'NewMonitorOffer',
            exclude: ['id'],
          }),
        },
      },
    })
    monitorOffer: Omit<MonitorOffer, 'id'>,
  ): Promise<MonitorOffer> {
    return this.monitorOfferRepository.create(monitorOffer);
  }

  @get('/monitor-offers/count')
  @response(200, {
    description: 'MonitorOffer model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(MonitorOffer) where?: Where<MonitorOffer>,
  ): Promise<Count> {
    return this.monitorOfferRepository.count(where);
  }

  @get('/monitor-offers')
  @response(200, {
    description: 'Array of MonitorOffer model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(MonitorOffer, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(MonitorOffer) filter?: Filter<MonitorOffer>,
  ): Promise<MonitorOffer[]> {
    return this.monitorOfferRepository.find(filter);
  }

  @patch('/monitor-offers')
  @response(200, {
    description: 'MonitorOffer PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(MonitorOffer, {partial: true}),
        },
      },
    })
    monitorOffer: MonitorOffer,
    @param.where(MonitorOffer) where?: Where<MonitorOffer>,
  ): Promise<Count> {
    return this.monitorOfferRepository.updateAll(monitorOffer, where);
  }

  @get('/monitor-offers/{id}')
  @response(200, {
    description: 'MonitorOffer model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(MonitorOffer, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(MonitorOffer, {exclude: 'where'}) filter?: FilterExcludingWhere<MonitorOffer>
  ): Promise<MonitorOffer> {
    return this.monitorOfferRepository.findById(id, filter);
  }

  @patch('/monitor-offers/{id}')
  @response(204, {
    description: 'MonitorOffer PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(MonitorOffer, {partial: true}),
        },
      },
    })
    monitorOffer: MonitorOffer,
  ): Promise<void> {
    await this.monitorOfferRepository.updateById(id, monitorOffer);
  }

  @put('/monitor-offers/{id}')
  @response(204, {
    description: 'MonitorOffer PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() monitorOffer: MonitorOffer,
  ): Promise<void> {
    await this.monitorOfferRepository.replaceById(id, monitorOffer);
  }

  @del('/monitor-offers/{id}')
  @response(204, {
    description: 'MonitorOffer DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.monitorOfferRepository.deleteById(id);
  }
}
