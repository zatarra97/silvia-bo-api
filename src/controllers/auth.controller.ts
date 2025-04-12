import {inject} from '@loopback/core';
import {post, requestBody, HttpErrors} from '@loopback/rest';
import {repository} from '@loopback/repository';
import {UserRepository} from '../repositories';
import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  InitiateAuthCommandInput,
} from '@aws-sdk/client-cognito-identity-provider';

export class AuthController {
  private cognitoClient: CognitoIdentityProviderClient;

  constructor(
    @repository(UserRepository)
    private userRepository: UserRepository,
  ) {
    if (!process.env.COGNITO_REGION || !process.env.COGNITO_APP_CLIENT_ID) {
      throw new Error('Cognito configuration is missing');
    }

    this.cognitoClient = new CognitoIdentityProviderClient({
      region: process.env.COGNITO_REGION,
    });
  }

  @post('/auth/login')
  async login(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['username', 'password'],
            properties: {
              username: {
                type: 'string',
              },
              password: {
                type: 'string',
                minLength: 8,
              },
            },
          },
        },
      },
    })
    credentials: {
      username: string;
      password: string;
    },
  ) {
    try {
      const params: InitiateAuthCommandInput = {
        AuthFlow: 'USER_PASSWORD_AUTH',
        ClientId: process.env.COGNITO_APP_CLIENT_ID,
        AuthParameters: {
          USERNAME: credentials.username,
          PASSWORD: credentials.password,
        },
      };

      console.log('Attempting Cognito authentication with params:', {
        ...params,
        AuthParameters: {
          USERNAME: credentials.username,
          PASSWORD: '********'
        }
      });

      const command = new InitiateAuthCommand(params);
      
      try {
        const response = await this.cognitoClient.send(command);
        console.log('Cognito response:', response);

        if (!response.AuthenticationResult?.AccessToken) {
          throw new HttpErrors.Unauthorized('Authentication failed');
        }

        // Cerca l'utente nel database locale usando lo username
        const users = await this.userRepository.find({
          where: {email: credentials.username},
          include: ['role'],
        });

        if (!users || users.length === 0) {
          throw new HttpErrors.Unauthorized('User not found in the system');
        }

        const user = users[0];

        return {
          accessToken: response.AuthenticationResult.AccessToken,
          tokenType: response.AuthenticationResult.TokenType,
          expiresIn: response.AuthenticationResult.ExpiresIn,
          user: {
            name: user.name,
            surname: user.surname,
            email: user.email,
            roleKey: user.role?.key ?? '',
          },
        };
      } catch (cognitoError: any) {
        console.error('Cognito authentication error:', cognitoError);
        
        if (cognitoError.name === 'NotAuthorizedException') {
          throw new HttpErrors.Unauthorized('Invalid credentials');
        } else if (cognitoError.name === 'UserNotFoundException') {
          throw new HttpErrors.Unauthorized('User not found in Cognito');
        } else {
          console.error('Detailed Cognito error:', cognitoError);
          throw new HttpErrors.InternalServerError('Authentication service error');
        }
      }
    } catch (error) {
      if (error instanceof HttpErrors.HttpError) {
        throw error;
      }
      console.error('Authentication error:', error);
      throw new HttpErrors.InternalServerError('Authentication failed');
    }
  }
} 