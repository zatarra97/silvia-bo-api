import {
  AUTHENTICATION_STRATEGY_NOT_FOUND,
  AuthenticationStrategy,
} from '@loopback/authentication';
import {HttpErrors, Request} from '@loopback/rest';
import {UserProfile, securityId} from '@loopback/security';
import * as jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';

export class CognitoAuthenticationStrategy implements AuthenticationStrategy {
  name = 'cognito';

  private client: jwksClient.JwksClient;
  private issuer: string;

  constructor() {
    const region = process.env.COGNITO_REGION;
    const userPoolId = process.env.COGNITO_USER_POOL_ID;

    if (!region || !userPoolId) {
      throw new Error(
        'COGNITO_REGION e COGNITO_USER_POOL_ID devono essere configurati nel file .env',
      );
    }

    this.issuer = `https://cognito-idp.${region}.amazonaws.com/${userPoolId}`;

    this.client = jwksClient({
      jwksUri: `${this.issuer}/.well-known/jwks.json`,
      cache: true,
      cacheMaxEntries: 5,
      cacheMaxAge: 10 * 60 * 1000, // 10 minuti
    });
  }

  async authenticate(request: Request): Promise<UserProfile | undefined> {
    const authHeader = request.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      throw new HttpErrors.Unauthorized('Token di autenticazione mancante');
    }

    const token = authHeader.slice(7);

    try {
      const decoded = jwt.decode(token, {complete: true});

      if (!decoded || typeof decoded === 'string' || !decoded.header.kid) {
        throw new HttpErrors.Unauthorized('Token non valido');
      }

      const signingKey = await this.client.getSigningKey(decoded.header.kid);
      const publicKey = signingKey.getPublicKey();

      const payload = jwt.verify(token, publicKey, {
        algorithms: ['RS256'],
        issuer: this.issuer,
      }) as jwt.JwtPayload;

      return {
        [securityId]: payload.sub ?? '',
        email: payload.email ?? payload['cognito:username'] ?? '',
        groups: (payload['cognito:groups'] as string[]) ?? [],
      };
    } catch (err: unknown) {
      if (err instanceof HttpErrors.HttpError) throw err;

      const error = err as {name?: string; message?: string};

      if (error.name === 'TokenExpiredError') {
        throw new HttpErrors.Unauthorized('Token scaduto');
      }
      if (error.name === 'JsonWebTokenError') {
        throw new HttpErrors.Unauthorized('Token non valido');
      }
      if (error.name === 'NotBeforeError') {
        throw new HttpErrors.Unauthorized('Token non ancora valido');
      }

      throw new HttpErrors.Unauthorized('Errore di autenticazione');
    }
  }
}

// Riexport per comodità
export {AUTHENTICATION_STRATEGY_NOT_FOUND};
