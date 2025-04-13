import {authenticate, AuthenticationBindings} from '@loopback/authentication';
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
import {Order} from '../models';
import {OrderRepository} from '../repositories';
import {MerchantRepository} from '../repositories/merchant.repository';
import {UserRepository} from '../repositories/user.repository';

// Interfaccia per il payload della richiesta
interface CreateOrderRequest extends Omit<Order, 'id' | 'userId' | 'merchantId'> {
  merchantSlug: string;
}

export class OrderController {
  constructor(
    @repository(OrderRepository)
    public orderRepository: OrderRepository,
    @repository(MerchantRepository)
    public merchantRepository: MerchantRepository,
    @repository(UserRepository)
    public userRepository: UserRepository,
  ) {}

  @authenticate('cognito')
  @post('/orders')
  @response(200, {
    description: 'Order model instance',
    content: {'application/json': {schema: getModelSchemaRef(Order)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['merchantSlug', 'total', 'delivery', 'scheduledAt'],
            properties: {
              merchantSlug: {type: 'string'},
              total: {type: 'number'},
              delivery: {type: 'boolean'},
              deliveryCost: {type: 'number'},
              scheduledAt: {type: 'string', format: 'date-time'},
              notes: {type: 'string'},
              summary: {type: 'array', items: {type: 'object'}},
              userInfo: {type: 'object'}
            }
          }
        },
      },
    })
    orderRequest: CreateOrderRequest,
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: UserProfile,
  ): Promise<Order> {
    try {
      console.log('[DEBUG] Inizio processo di creazione ordine');
      console.log('[DEBUG] Dati ricevuti:', {
        merchantSlug: orderRequest.merchantSlug,
        total: orderRequest.total,
        delivery: orderRequest.delivery,
        scheduledAt: orderRequest.scheduledAt
      });

      // Estrai l'email dall'utente autenticato
      const userEmail = currentUser.email;
      console.log('[DEBUG] Email utente dal token:', userEmail);

      if (!userEmail) {
        console.error('[ERROR] Email utente non trovata nel token');
        throw new HttpErrors.Unauthorized('User email not found in token');
      }

      // Trova l'utente per email
      console.log('[DEBUG] Ricerca utente per email:', userEmail);
      const user = await this.userRepository.findOne({
        where: {email: userEmail}
      });

      if (!user) {
        console.error('[ERROR] Utente non trovato per email:', userEmail);
        throw new HttpErrors.NotFound('User not found');
      }
      console.log('[DEBUG] Utente trovato con ID:', user.id);

      // Trova il merchant per slug
      console.log('[DEBUG] Ricerca merchant per slug:', orderRequest.merchantSlug);
      const merchant = await this.merchantRepository.findOne({
        where: {slug: orderRequest.merchantSlug}
      });

      if (!merchant) {
        console.error('[ERROR] Merchant non trovato per slug:', orderRequest.merchantSlug);
        throw new HttpErrors.NotFound('Merchant not found');
      }
      console.log('[DEBUG] Merchant trovato con ID:', merchant.id);

      // Crea l'ordine con gli ID risolti
      const {merchantSlug, ...orderData} = orderRequest;
      const order = {
        ...orderData,
        userId: user.id,
        merchantId: merchant.id,
      };
      console.log('[DEBUG] Dati ordine preparati:', {
        userId: order.userId,
        merchantId: order.merchantId,
        total: order.total,
        delivery: order.delivery,
        scheduledAt: order.scheduledAt
      });

      const createdOrder = await this.orderRepository.create(order);
      console.log('[DEBUG] Ordine creato con successo. ID:', createdOrder.id);

      return createdOrder;
    } catch (error) {
      console.error('[ERROR] Errore durante la creazione dell\'ordine:', error);
      if (error instanceof HttpErrors.HttpError) {
        throw error;
      }
      throw new HttpErrors.InternalServerError('Error creating order');
    }
  }

  @get('/orders/count')
  @response(200, {
    description: 'Order model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Order) where?: Where<Order>,
  ): Promise<Count> {
    return this.orderRepository.count(where);
  }

  @authenticate('cognito')
  @get('/orders')
  @response(200, {
    description: 'Array of Order model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Order, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: UserProfile,
    @param.filter(Order) filter?: Filter<Order>,
  ): Promise<Order[]> {
    console.log('[DEBUG] Inizio processo di recupero ordini');
    console.log('[DEBUG] Dati utente dal token:', {
      email: currentUser.email,
      id: currentUser.id
    });

    const userEmail = currentUser.email;
    if (!userEmail) {
      console.error('[ERROR] Email utente non trovata nel token');
      throw new HttpErrors.Unauthorized('User email not found in token');
    }

    console.log('[DEBUG] Ricerca utente per email:', userEmail);
    const user = await this.userRepository.findOne({
      where: {email: userEmail},
      include: ['role']
    });

    if (!user) {
      console.error('[ERROR] Utente non trovato per email:', userEmail);
      throw new HttpErrors.NotFound('User not found');
    }
    console.log('[DEBUG] Utente trovato:', {
      id: user.id,
      email: user.email,
      role: user.role ? {
        id: user.role.id,
        key: user.role.key,
        name: user.role.name
      } : null
    });

    if (!user.role) {
      console.error('[ERROR] Ruolo non trovato per l\'utente:', user.id);
      throw new HttpErrors.Unauthorized('User role not found');
    }

    let userFilter;
    if (user.role.key === 'U') {
      console.log('[DEBUG] Filtro ordini per utente normale (userId):', user.id);
      userFilter = {
        ...filter,
        where: {
          ...filter?.where,
          userId: user.id
        }
      };
    } else if (user.role.key === 'M') {
      console.log('[DEBUG] Ricerca merchant per userId:', user.id);
      const merchant = await this.merchantRepository.findOne({
        where: {userId: user.id}
      });

      if (!merchant) {
        console.error('[ERROR] Merchant non trovato per userId:', user.id);
        throw new HttpErrors.NotFound('Merchant not found for this user');
      }

      console.log('[DEBUG] Merchant trovato con ID:', merchant.id);
      userFilter = {
        ...filter,
        where: {
          ...filter?.where,
          merchantId: merchant.id
        }
      };
    } else {
      console.error('[ERROR] Ruolo utente non valido:', user.role.key);
      throw new HttpErrors.Unauthorized('Invalid user role');
    }

    console.log('[DEBUG] Filtro finale applicato:', userFilter);
    const orders = await this.orderRepository.find(userFilter);
    console.log('[DEBUG] Numero di ordini trovati:', orders.length);

    return orders;
  }

  @patch('/orders')
  @response(200, {
    description: 'Order PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Order, {partial: true}),
        },
      },
    })
    order: Order,
    @param.where(Order) where?: Where<Order>,
  ): Promise<Count> {
    return this.orderRepository.updateAll(order, where);
  }

  @get('/orders/{id}')
  @response(200, {
    description: 'Order model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Order, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Order, {exclude: 'where'}) filter?: FilterExcludingWhere<Order>
  ): Promise<Order> {
    return this.orderRepository.findById(id, filter);
  }

  @patch('/orders/{id}')
  @response(204, {
    description: 'Order PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Order, {partial: true}),
        },
      },
    })
    order: Order,
  ): Promise<void> {
    await this.orderRepository.updateById(id, order);
  }

  @put('/orders/{id}')
  @response(204, {
    description: 'Order PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() order: Order,
  ): Promise<void> {
    await this.orderRepository.replaceById(id, order);
  }

  @del('/orders/{id}')
  @response(204, {
    description: 'Order DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.orderRepository.deleteById(id);
  }
}
