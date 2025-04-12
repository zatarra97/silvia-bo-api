import {belongsTo, Entity, model, property} from '@loopback/repository';
import {Role} from './role.model';

export const USER_TABLE_NAME = 'user';

@model({
  name: USER_TABLE_NAME
})
export class User extends Entity {
  // Costante per il nome della tabella da usare per le query dirette nei controller
  public static readonly TABLE_NAME: string = USER_TABLE_NAME;

  // Definizione centralizzata dei nomi delle colonne
  public static readonly COLUMNS = {
    ID: 'id',
    NAME: 'name',
    SURNAME: 'surname',
    EMAIL: 'email',
    NUMBER: 'number',
    COGNITO_USER_ID: 'cognitoUserId',
    ROLE_ID: 'roleId',
    CREATED_AT: 'createdAt',
    UPDATED_AT: 'updatedAt'
  };

  @property({
    type: 'number',
    id: true,
    generated: true,
    jsonSchema: {
      type: 'number',
      unsigned: true,
    }
  })
  id: number;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      maxLength: 100,
    },
  })
  name: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      maxLength: 100,
    },
  })
  surname: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      maxLength: 100,
      format: 'email',
    },
  })
  email: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      maxLength: 20,
      pattern: '^\\+?[0-9\\s-()]+$',
    },
  })
  number: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      maxLength: 36,
    },
  })
  cognitoUserId: string;

  @belongsTo(() => Role)
  roleId: number;

  @property({
    type: 'date',
    default: () => new Date(),
  })
  createdAt: string;

  @property({
    type: 'date',
    default: () => new Date(),
  })
  updatedAt: string;

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  role?: Role;
}

export type UserWithRelations = User & UserRelations;
