import {
  authenticate,
  AuthenticationBindings,
} from '@loopback/authentication';
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
  HttpErrors,
  param,
  patch,
  post,
  put,
  requestBody,
  response,
} from '@loopback/rest';
import {UserProfile} from '@loopback/security';
import {Category} from '../models';
import {CategoryRepository} from '../repositories';
import {MerchantRepository} from '../repositories/merchant.repository';
import {UserRepository} from '../repositories/user.repository';

export class CategoryController {
  constructor(
    @repository(CategoryRepository)
    public categoryRepository : CategoryRepository,
    @repository(UserRepository)
    public userRepository: UserRepository,
    @repository(MerchantRepository)
    public merchantRepository: MerchantRepository,
  ) {}

  @post('/categories')
  @response(200, {
    description: 'Category model instance',
    content: {'application/json': {schema: getModelSchemaRef(Category)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Category, {
            title: 'NewCategory',
            exclude: ['id'],
          }),
        },
      },
    })
    category: Omit<Category, 'id'>,
  ): Promise<Category> {
    return this.categoryRepository.create(category);
  }

  @get('/categories/count')
  @response(200, {
    description: 'Category model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Category) where?: Where<Category>,
  ): Promise<Count> {
    return this.categoryRepository.count(where);
  }

  //API usata nel pannello di controllo del merchant per recuperare le categorie
  @authenticate('cognito')
  @get('/categories')
  @response(200, {
    description: 'Array of Category model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Category, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @inject(AuthenticationBindings.CURRENT_USER) currentUser: UserProfile,
    @param.filter(Category) filter?: Filter<Category>,
  ): Promise<Category[]> {
    console.log('Current user email:', currentUser.email);

    const user = await this.userRepository.findOne({
      where: {
        email: currentUser.email,
      },
      include: [{relation: 'role'}]
    });

    if (!user) {
      throw new HttpErrors.NotFound('User not found');
    }

    console.log('User found:', user);

    if (user.role?.key !== 'M') {
      throw new HttpErrors.Unauthorized('User is not a merchant');
    }

    const merchant = await this.merchantRepository.findOne({
      where: {
        userId: user.id,
      },
    });

    if (!merchant) {
      throw new HttpErrors.NotFound('Merchant not found');
    }

    console.log('Merchant found:', merchant);

    const finalFilter: Filter<Category> = {
      ...filter,
      where: {
        ...filter?.where,
        merchantId: merchant.id,
      },
      order: ['order ASC', 'name ASC']
    };

    return this.categoryRepository.find(finalFilter);
  }

  @patch('/categories')
  @response(200, {
    description: 'Category PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Category, {partial: true}),
        },
      },
    })
    category: Category,
    @param.where(Category) where?: Where<Category>,
  ): Promise<Count> {
    return this.categoryRepository.updateAll(category, where);
  }

  @get('/categories/{id}')
  @response(200, {
    description: 'Category model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Category, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Category, {exclude: 'where'}) filter?: FilterExcludingWhere<Category>
  ): Promise<Category> {
    return this.categoryRepository.findById(id, filter);
  }

  @patch('/categories/{id}')
  @response(204, {
    description: 'Category PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Category, {partial: true}),
        },
      },
    })
    category: Category,
  ): Promise<void> {
    await this.categoryRepository.updateById(id, category);
  }

  @put('/categories/{id}')
  @response(204, {
    description: 'Category PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() category: Category,
  ): Promise<void> {
    await this.categoryRepository.replaceById(id, category);
  }

  @del('/categories/{id}')
  @response(204, {
    description: 'Category DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.categoryRepository.deleteById(id);
  }
}
