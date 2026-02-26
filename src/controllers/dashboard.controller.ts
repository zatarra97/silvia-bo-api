import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {get, response} from '@loopback/rest';
import {SecurityBindings, UserProfile} from '@loopback/security';

export class DashboardController {
  @authenticate('cognito')
  @get('/dashboard')
  @response(200, {
    description: 'Dashboard status',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            success: {type: 'boolean'},
          },
        },
      },
    },
  })
  async getDashboard(
    @inject(SecurityBindings.USER) currentUser: UserProfile,
  ): Promise<{success: boolean}> {
    return {success: true};
  }
}
