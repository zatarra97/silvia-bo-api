import {
  AdminDisableUserCommand,
  AdminEnableUserCommand,
  CognitoIdentityProviderClient,
  ListUsersCommand,
  ListUsersInGroupCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {HttpErrors, get, param, post, response} from '@loopback/rest';
import {SecurityBindings, UserProfile} from '@loopback/security';
import {requireAdmin} from '../utils/authorization';

const cognitoClient = new CognitoIdentityProviderClient({
  region: process.env.COGNITO_REGION,
  ...(process.env.AWS_ACCESS_KEY_ID
    ? {
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
        },
      }
    : {}),
});

const USER_POOL_ID = process.env.COGNITO_USER_POOL_ID!;

export interface CognitoUserRecord {
  username: string;
  email: string;
  name?: string;
  phone?: string;
  enabled: boolean;
  status: string;
  createdAt?: Date;
  lastAccessAt?: Date;
  isAdmin: boolean;
}

@authenticate('cognito')
export class AdminUserController {
  // ── GET /admin/users ─────────────────────────────────────────────────────
  @get('/admin/users')
  @response(200, {
    description: 'Lista utenti Cognito',
    content: {'application/json': {schema: {type: 'array', items: {type: 'object'}}}},
  })
  async listUsers(
    @inject(SecurityBindings.USER) currentUser: UserProfile,
    @param.query.string('email') emailFilter?: string,
  ): Promise<CognitoUserRecord[]> {
    requireAdmin(currentUser);

    // Carica la lista degli admin per marcarli
    const adminUsernames = new Set<string>();
    try {
      const adminRes = await cognitoClient.send(
        new ListUsersInGroupCommand({UserPoolId: USER_POOL_ID, GroupName: 'Admin'}),
      );
      for (const u of adminRes.Users ?? []) {
        if (u.Username) adminUsernames.add(u.Username);
      }
    } catch {
      // se il gruppo non esiste o non è accessibile, si continua senza dati admin
    }

    // Filtro opzionale per email (sintassi Cognito)
    const filter = emailFilter?.trim()
      ? `email ^= "${emailFilter.trim()}"`
      : undefined;

    const res = await cognitoClient.send(
      new ListUsersCommand({UserPoolId: USER_POOL_ID, Filter: filter, Limit: 60}),
    );

    return (res.Users ?? []).map(u => {
      const attrs = Object.fromEntries(
        (u.Attributes ?? []).map(a => [a.Name!, a.Value ?? '']),
      );
      return {
        username: u.Username ?? '',
        email: attrs['email'] ?? '',
        name: attrs['name'] || undefined,
        phone: attrs['phone_number'] || undefined,
        enabled: u.Enabled ?? true,
        status: u.UserStatus ?? '',
        createdAt: u.UserCreateDate,
        lastAccessAt: u.UserLastModifiedDate,
        isAdmin: adminUsernames.has(u.Username ?? ''),
      };
    });
  }

  // ── POST /admin/users/:username/disable ──────────────────────────────────
  @post('/admin/users/{username}/disable')
  @response(204, {description: 'Utente disabilitato'})
  async disableUser(
    @inject(SecurityBindings.USER) currentUser: UserProfile,
    @param.path.string('username') username: string,
  ): Promise<void> {
    requireAdmin(currentUser);
    // Impedisce all'admin di disabilitare se stesso
    const selfEmail: string = (currentUser as any).email ?? '';
    if (selfEmail && selfEmail === username) {
      throw new HttpErrors.UnprocessableEntity(
        'Non puoi disabilitare il tuo stesso account.',
      );
    }
    try {
      await cognitoClient.send(
        new AdminDisableUserCommand({UserPoolId: USER_POOL_ID, Username: username}),
      );
    } catch (err: any) {
      if (err.name === 'UserNotFoundException')
        throw new HttpErrors.NotFound('Utente non trovato.');
      throw new HttpErrors.InternalServerError('Errore durante la disabilitazione.');
    }
  }

  // ── POST /admin/users/:username/enable ───────────────────────────────────
  @post('/admin/users/{username}/enable')
  @response(204, {description: 'Utente abilitato'})
  async enableUser(
    @inject(SecurityBindings.USER) currentUser: UserProfile,
    @param.path.string('username') username: string,
  ): Promise<void> {
    requireAdmin(currentUser);
    try {
      await cognitoClient.send(
        new AdminEnableUserCommand({UserPoolId: USER_POOL_ID, Username: username}),
      );
    } catch (err: any) {
      if (err.name === 'UserNotFoundException')
        throw new HttpErrors.NotFound('Utente non trovato.');
      throw new HttpErrors.InternalServerError("Errore durante l'abilitazione.");
    }
  }
}
