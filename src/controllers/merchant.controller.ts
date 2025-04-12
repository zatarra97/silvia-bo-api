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
import {Merchant} from '../models';
import {MerchantRepository} from '../repositories';

export class MerchantController {
  constructor(
    @repository(MerchantRepository)
    public merchantRepository : MerchantRepository,
  ) {}

  @post('/merchants')
  @response(200, {
    description: 'Merchant model instance',
    content: {'application/json': {schema: getModelSchemaRef(Merchant)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Merchant, {
            title: 'NewMerchant',
            exclude: ['id'],
          }),
        },
      },
    })
    merchant: Omit<Merchant, 'id'>,
  ): Promise<Merchant> {
    return this.merchantRepository.create(merchant);
  }

  @get('/merchants/count')
  @response(200, {
    description: 'Merchant model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Merchant) where?: Where<Merchant>,
  ): Promise<Count> {
    return this.merchantRepository.count(where);
  }

  @get('/merchants')
  @response(200, {
    description: 'Array of Merchant model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Merchant, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Merchant) filter?: Filter<Merchant>,
  ): Promise<Merchant[]> {
    return this.merchantRepository.find(filter);
  }

  @patch('/merchants')
  @response(200, {
    description: 'Merchant PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Merchant, {partial: true}),
        },
      },
    })
    merchant: Merchant,
    @param.where(Merchant) where?: Where<Merchant>,
  ): Promise<Count> {
    return this.merchantRepository.updateAll(merchant, where);
  }

  @get('/merchants/{id}')
  @response(200, {
    description: 'Merchant model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Merchant, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Merchant, {exclude: 'where'}) filter?: FilterExcludingWhere<Merchant>
  ): Promise<Merchant> {
    return this.merchantRepository.findById(id, filter);
  }

  @patch('/merchants/{id}')
  @response(204, {
    description: 'Merchant PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Merchant, {partial: true}),
        },
      },
    })
    merchant: Merchant,
  ): Promise<void> {
    await this.merchantRepository.updateById(id, merchant);
  }

  @put('/merchants/{id}')
  @response(204, {
    description: 'Merchant PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() merchant: Merchant,
  ): Promise<void> {
    await this.merchantRepository.replaceById(id, merchant);
  }

  @del('/merchants/{id}')
  @response(204, {
    description: 'Merchant DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.merchantRepository.deleteById(id);
  }
}
