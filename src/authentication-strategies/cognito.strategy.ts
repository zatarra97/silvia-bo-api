import {AuthenticationStrategy} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {HttpErrors, Request} from '@loopback/rest';
import {UserProfile, securityId} from '@loopback/security';
import * as jwt from 'jsonwebtoken';
import * as jwksRsa from 'jwks-rsa';

export class CognitoAuthenticationStrategy implements AuthenticationStrategy {
  name = 'cognito';

  private jwksClient: jwksRsa.JwksClient;
  private cognitoIssuer: string;

  constructor() {
    if (!process.env.AWS_REGION || !process.env.COGNITO_USER_POOL_ID || !process.env.COGNITO_CLIENT_ID) {
      throw new Error('Cognito configuration is missing');
    }

    this.cognitoIssuer = `https://cognito-idp.${process.env.AWS_REGION}.amazonaws.com/${process.env.COGNITO_USER_POOL_ID}`;
    
    this.jwksClient = new jwksRsa.JwksClient({
      jwksUri: `${this.cognitoIssuer}/.well-known/jwks.json`,
      cache: true,
      rateLimit: true,
    });
  }

  async authenticate(request: Request): Promise<UserProfile> {
    const token = this.extractCredentials(request);
    const userProfile = await this.validateToken(token);
    return userProfile;
  }

  private extractCredentials(request: Request): string {
    if (!request.headers.authorization) {
      throw new HttpErrors.Unauthorized('Authorization header not found.');
    }

    const authHeaderValue = request.headers.authorization;

    if (!authHeaderValue.startsWith('Bearer')) {
      throw new HttpErrors.Unauthorized(
        'Authorization header is not of type Bearer.',
      );
    }

    const parts = authHeaderValue.split(' ');
    if (parts.length !== 2) {
      throw new HttpErrors.Unauthorized(
        `Authorization header value has too many parts. It must follow the pattern: 'Bearer xx.yy.zz' where xx.yy.zz is a valid JWT token.`,
      );
    }

    return parts[1];
  }

  private getSigningKey(header: jwt.JwtHeader): Promise<string> {
    return new Promise((resolve, reject) => {
      this.jwksClient.getSigningKey(header.kid, (err: any, key: any) => {
        if (err) {
          reject(err);
          return;
        }
        const signingKey = key?.getPublicKey();
        resolve(signingKey);
      });
    });
  }

  private async validateToken(token: string): Promise<UserProfile> {
    try {
      const decodedToken = jwt.decode(token, {complete: true});
      if (!decodedToken || !decodedToken.header) {
        throw new HttpErrors.Unauthorized('Invalid token structure');
      }

      const key = await this.getSigningKey(decodedToken.header);

      return new Promise((resolve, reject) => {
        jwt.verify(
          token,
          key,
          {
            issuer: this.cognitoIssuer,
            audience: process.env.COGNITO_CLIENT_ID,
            algorithms: ['RS256'],
          },
          (err, decoded) => {
            if (err) {
              console.error('Token verification error:', err);
              reject(new HttpErrors.Unauthorized('Invalid token'));
              return;
            }

            if (!decoded || typeof decoded !== 'object') {
              reject(new HttpErrors.Unauthorized('Invalid token payload'));
              return;
            }

            resolve({
              [securityId]: decoded.sub as string,
              id: decoded.sub as string,
              email: decoded.email as string,
              name: decoded.name as string,
              roles: decoded['cognito:groups'] as string[] || [],
            });
          },
        );
      });
    } catch (error) {
      console.error('Token validation error:', error);
      throw new HttpErrors.Unauthorized('Invalid token');
    }
  }
} 