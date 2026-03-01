import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {
  get,
  getModelSchemaRef,
  HttpErrors,
  param,
  post,
  requestBody,
  response,
} from '@loopback/rest';
import {SecurityBindings, UserProfile} from '@loopback/security';
import {randomUUID} from 'crypto';
import {Order} from '../models';
import {OrderRepository} from '../repositories';
import {requireUser} from '../utils/authorization';

function normalizeWeddingDate(value: unknown): string {
  if (typeof value !== 'string' || !value.trim()) {
    throw new HttpErrors.BadRequest(
      'weddingDate deve essere una stringa nel formato YYYY-MM-DD.',
    );
  }

  const trimmedValue = value.trim();
  const datePrefixMatch = trimmedValue.match(/^(\d{4}-\d{2}-\d{2})/);
  if (datePrefixMatch) {
    return datePrefixMatch[1];
  }

  const parsedDate = new Date(trimmedValue);

  if (Number.isNaN(parsedDate.getTime())) {
    throw new HttpErrors.BadRequest(
      'weddingDate non valida. Usa il formato YYYY-MM-DD.',
    );
  }

  return parsedDate.toISOString().slice(0, 10);
}

@authenticate('cognito')
export class UserOrderController {
  constructor(
    @repository(OrderRepository)
    public orderRepository: OrderRepository,
  ) {}

  @post('/user/orders')
  @response(201, {
    description: 'Order creato',
    content: {'application/json': {schema: getModelSchemaRef(Order)}},
  })
  async create(
    @inject(SecurityBindings.USER) currentUser: UserProfile,
    @requestBody({
      content: {
        'application/json': {
          schema: {type: 'object'},
        },
      },
    })
    body: Record<string, any>,
  ): Promise<Order> {
    requireUser(currentUser);
    const email: string = (currentUser as any).email ?? '';
    const weddingDate = normalizeWeddingDate(body.weddingDate);
    const order = await this.orderRepository.create({
      ...body,
      weddingDate,
      publicId: randomUUID(),
      userEmail: email,
      status: 'pending',
    });
    return order;
  }

  @get('/user/orders')
  @response(200, {
    description: 'Lista ordini dell\'utente',
    content: {
      'application/json': {
        schema: {type: 'array', items: getModelSchemaRef(Order)},
      },
    },
  })
  async findMyOrders(
    @inject(SecurityBindings.USER) currentUser: UserProfile,
    @param.query.number('limit') limit?: number,
    @param.query.number('skip') skip?: number,
  ): Promise<Order[]> {
    requireUser(currentUser);
    const email: string = (currentUser as any).email ?? '';
    return this.orderRepository.find({
      where: {userEmail: email},
      limit,
      skip,
      order: ['createdAt DESC'],
    });
  }

  @get('/user/orders/{publicId}')
  @response(200, {
    description: 'Dettaglio ordine',
    content: {'application/json': {schema: getModelSchemaRef(Order)}},
  })
  async findOne(
    @inject(SecurityBindings.USER) currentUser: UserProfile,
    @param.path.string('publicId') publicId: string,
  ): Promise<Order> {
    requireUser(currentUser);
    const email: string = (currentUser as any).email ?? '';
    const [order] = await this.orderRepository.find({
      where: {publicId},
      limit: 1,
    });
    if (!order) throw new HttpErrors.NotFound('Ordine non trovato.');
    if (order.userEmail !== email) throw new HttpErrors.Forbidden('Accesso negato.');
    return order;
  }
}
