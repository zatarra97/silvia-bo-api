import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {get, response} from '@loopback/rest';
import {SecurityBindings, UserProfile} from '@loopback/security';
import {ServiceRepository} from '../repositories';
import {requireUser} from '../utils/authorization';

export interface PublicService {
  publicId: string;
  name: string;
  description: string;
  orientation: 'vertical' | 'horizontal' | 'both';
  priceVertical?: number;
  priceHorizontal?: number;
  priceBoth?: number;
  durationDescription?: string;
  minDuration?: number;
  maxDuration?: number;
}

@authenticate('cognito')
export class UserServiceController {
  constructor(
    @repository(ServiceRepository)
    public serviceRepository: ServiceRepository,
  ) {}

  @get('/user/services')
  @response(200, {
    description: 'Lista dei servizi disponibili',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: {type: 'object'},
        },
      },
    },
  })
  async findPublic(
    @inject(SecurityBindings.USER) currentUser: UserProfile,
  ): Promise<PublicService[]> {
    requireUser(currentUser);
    const services = await this.serviceRepository.find({
      fields: {
        id: false,
        publicId: true,
        name: true,
        description: true,
        orientation: true,
        priceVertical: true,
        priceHorizontal: true,
        priceBoth: true,
        durationDescription: true,
        minDuration: true,
        maxDuration: true,
        additionalOptions: false,
        createdAt: false,
        updatedAt: false,
      },
    });
    return services.filter(s => !!s.publicId) as unknown as PublicService[];
  }
}
