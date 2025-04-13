import {AuthenticationStrategy} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import {securityId, UserProfile} from '@loopback/security';
import {Request} from 'express';
import * as jwt from 'jsonwebtoken';
import * as jwksRsa from 'jwks-rsa';

// Questa classe implementa la strategia di autenticazione per Amazon Cognito
export class CognitoAuthenticationStrategy implements AuthenticationStrategy {
  name = 'cognito';

  // Il costruttore inietta le configurazioni di Cognito necessarie
  constructor(
    @inject('cognito.region')
    private cognitoRegion: string,
    @inject('cognito.userPoolId')
    private cognitoUserPoolId: string,
    @inject('cognito.appClientId')
    private cognitoAppClientId: string,
  ) { }

  // Metodo principale per autenticare una richiesta
  async authenticate(request: Request): Promise<UserProfile | undefined> {
    // Estrae il token JWT dalla richiesta
    const token = this.extractCredentials(request);
    // Verifica il token e ottiene le informazioni dell'utente
    const userInfo = await this.verifyToken(token);
    return this.convertToUserProfile(userInfo);
  }

  // Estrae il token JWT dall'header di autorizzazione della richiesta
  extractCredentials(request: Request): string {
    // Verifica la presenza dell'header di autorizzazione
    if (!request.headers.authorization) {
      throw new HttpErrors.Unauthorized('Authorization header not found.');
    }

    const authHeaderValue = request.headers.authorization;

    // Verifica che l'header inizi con "Bearer"
    if (!authHeaderValue.startsWith('Bearer')) {
      throw new HttpErrors.Unauthorized(
        'Authorization header is not of type "Bearer".',
      );
    }

    // Divide l'header in parti e verifica il formato corretto
    const parts = authHeaderValue.split(' ');
    if (parts.length !== 2) {
      throw new HttpErrors.Unauthorized(
        `Authorization header value has too many parts. It must follow the pattern: 'Bearer xx.yy.zz' where xx.yy.zz is a valid JWT token.`,
      );
    }
    // Estrae il token
    const token = parts[1];

    return token;
  }

  // Verifica la validità del token JWT
  async verifyToken(token: string): Promise<any> {
    // Verifica che le configurazioni di Cognito siano presenti
    if (!process.env.COGNITO_REGION || !process.env.COGNITO_USER_POOL_ID) {
      throw new Error('Cognito configuration is missing');
    }

    // Costruisce l'URL dell'issuer Cognito
    const cognitoIssuer = `https://cognito-idp.${process.env.COGNITO_REGION}.amazonaws.com/${process.env.COGNITO_USER_POOL_ID}`;

    // Crea un client JWKS per recuperare le chiavi pubbliche di Cognito
    const client = new jwksRsa.JwksClient({
      jwksUri: `${cognitoIssuer}/.well-known/jwks.json`,
    });

    // Funzione per ottenere la chiave di firma corretta basata sull'header del token
    function getKey(header: jwt.JwtHeader, callback: jwt.SigningKeyCallback) {
      client.getSigningKey(header.kid, (err: any, key: any) => {
        const signingKey = key?.getPublicKey();
        callback(err, signingKey);
      });
    }

    // Verifica il token JWT
    return new Promise((resolve, reject) => {
      jwt.verify(
        token,
        getKey,
        {
          issuer: cognitoIssuer,  // Verifica che l'issuer sia corretto
          audience: this.cognitoAppClientId,  // Verifica che l'audience sia corretta
          algorithms: ['RS256'],  // Usa solo l'algoritmo RS256
        },
        (err, decoded) => {
          if (err) {
            console.error(err);
            reject(new HttpErrors.Unauthorized('Invalid token'));
          } else {
            // Se la verifica ha successo, restituisce le informazioni dell'utente
            resolve(decoded);
          }
        },
      );
    });
  }

  private convertToUserProfile(decodedToken: any): UserProfile {
    //console.log('[DEBUG] Token decodificato:', JSON.stringify(decodedToken, null, 2));

    // Per Cognito, l'email potrebbe essere in diversi campi
    const email = decodedToken.email || decodedToken['cognito:email'] || decodedToken.username;

    if (!email) {
      console.error('[ERROR] Campi disponibili nel token:', Object.keys(decodedToken));
      throw new HttpErrors.Unauthorized('Email not found in token');
    }

    return {
      [securityId]: decodedToken.sub,
      email: email,
      name: decodedToken.name || '',
    };
  }
}
