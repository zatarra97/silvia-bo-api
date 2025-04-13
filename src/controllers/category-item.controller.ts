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
  post,
  put,
  requestBody,
  response,
} from '@loopback/rest';
import {CategoryItem} from '../models';
import {CategoryItemRepository} from '../repositories';
export class CategoryItemController {
  constructor(
    @repository(CategoryItemRepository)
    public categoryItemRepository : CategoryItemRepository,
  ) {}

  @post('/category-items')
  @response(200, {
    description: 'CategoryItem model instance',
    content: {'application/json': {schema: getModelSchemaRef(CategoryItem)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(CategoryItem, {
            title: 'NewCategoryItem',
            exclude: ['id'],
          }),
        },
      },
    })
    categoryItem: Omit<CategoryItem, 'id'>,
  ): Promise<CategoryItem> {
    return this.categoryItemRepository.create(categoryItem);
  }

  @get('/category-items/count')
  @response(200, {
    description: 'CategoryItem model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(CategoryItem) where?: Where<CategoryItem>,
  ): Promise<Count> {
    return this.categoryItemRepository.count(where);
  }

  @authenticate('cognito')
  @get('/category-items')
  @response(200, {
    description: 'Array of CategoryItem model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(CategoryItem, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(CategoryItem) filter?: Filter<CategoryItem>,
    @param.query.number('merchantId') merchantId?: number,
    @param.query.number('categoryId') categoryId?: number,
  ): Promise<CategoryItem[]> {
    console.log(`[DEBUG] Ricerca category items con filtro:`, filter);

    let where = filter?.where || {};
    if (merchantId) {
      console.log(`[DEBUG] Filtro aggiuntivo per merchantId: ${merchantId}`);
      where = {...where, merchantId: {eq: merchantId}};
    }
    if (categoryId) {
      console.log(`[DEBUG] Filtro aggiuntivo per categoryId: ${categoryId}`);
      where = {...where, categoryId: {eq: categoryId}};
    }

    if (merchantId || categoryId) {
      filter = {
        ...filter,
        where
      };
    }

    return this.categoryItemRepository.find(filter);
  }

  @patch('/category-items')
  @response(200, {
    description: 'CategoryItem PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(CategoryItem, {partial: true}),
        },
      },
    })
    categoryItem: CategoryItem,
    @param.where(CategoryItem) where?: Where<CategoryItem>,
  ): Promise<Count> {
    return this.categoryItemRepository.updateAll(categoryItem, where);
  }

  @get('/category-items/{id}')
  @response(200, {
    description: 'CategoryItem model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(CategoryItem, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(CategoryItem, {exclude: 'where'}) filter?: FilterExcludingWhere<CategoryItem>
  ): Promise<CategoryItem> {
    return this.categoryItemRepository.findById(id, filter);
  }

  @patch('/category-items/{id}')
  @response(204, {
    description: 'CategoryItem PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(CategoryItem, {partial: true}),
        },
      },
    })
    categoryItem: CategoryItem,
  ): Promise<void> {
    await this.categoryItemRepository.updateById(id, categoryItem);
  }

  @put('/category-items/{id}')
  @response(204, {
    description: 'CategoryItem PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() categoryItem: CategoryItem,
  ): Promise<void> {
    await this.categoryItemRepository.replaceById(id, categoryItem);
  }

  @del('/category-items/{id}')
  @response(204, {
    description: 'CategoryItem DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.categoryItemRepository.deleteById(id);
  }
}
