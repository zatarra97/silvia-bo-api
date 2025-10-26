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
import {IkeaOffer} from '../models';
import {IkeaOfferRepository} from '../repositories';

export class IkeaOfferController {
  constructor(
    @repository(IkeaOfferRepository)
    public ikeaOfferRepository : IkeaOfferRepository,
  ) {}

  @post('/ikea-offers')
  @response(200, {
    description: 'IkeaOffer model instance',
    content: {'application/json': {schema: getModelSchemaRef(IkeaOffer)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(IkeaOffer, {
            title: 'NewIkeaOffer',
            exclude: ['id'],
          }),
        },
      },
    })
    ikeaOffer: Omit<IkeaOffer, 'id'>,
  ): Promise<IkeaOffer> {
    return this.ikeaOfferRepository.create(ikeaOffer);
  }

  @get('/ikea-offers/count')
  @response(200, {
    description: 'IkeaOffer model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(IkeaOffer) where?: Where<IkeaOffer>,
  ): Promise<Count> {
    return this.ikeaOfferRepository.count(where);
  }

  @get('/ikea-offers')
  @response(200, {
    description: 'Array of IkeaOffer model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(IkeaOffer, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(IkeaOffer) filter?: Filter<IkeaOffer>,
  ): Promise<IkeaOffer[]> {
    return this.ikeaOfferRepository.find(filter);
  }

  @patch('/ikea-offers')
  @response(200, {
    description: 'IkeaOffer PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(IkeaOffer, {partial: true}),
        },
      },
    })
    ikeaOffer: IkeaOffer,
    @param.where(IkeaOffer) where?: Where<IkeaOffer>,
  ): Promise<Count> {
    return this.ikeaOfferRepository.updateAll(ikeaOffer, where);
  }

  @get('/ikea-offers/{id}')
  @response(200, {
    description: 'IkeaOffer model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(IkeaOffer, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(IkeaOffer, {exclude: 'where'}) filter?: FilterExcludingWhere<IkeaOffer>
  ): Promise<IkeaOffer> {
    return this.ikeaOfferRepository.findById(id, filter);
  }

  @patch('/ikea-offers/{id}')
  @response(204, {
    description: 'IkeaOffer PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(IkeaOffer, {partial: true}),
        },
      },
    })
    ikeaOffer: IkeaOffer,
  ): Promise<void> {
    await this.ikeaOfferRepository.updateById(id, ikeaOffer);
  }

  @put('/ikea-offers/{id}')
  @response(204, {
    description: 'IkeaOffer PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() ikeaOffer: IkeaOffer,
  ): Promise<void> {
    await this.ikeaOfferRepository.replaceById(id, ikeaOffer);
  }

  @del('/ikea-offers/{id}')
  @response(204, {
    description: 'IkeaOffer DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.ikeaOfferRepository.deleteById(id);
  }
}
