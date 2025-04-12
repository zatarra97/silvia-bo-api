import {Entity, model, property} from '@loopback/repository';

export const ROLE_TABLE_NAME = 'role';

@model({
  name: ROLE_TABLE_NAME
})
export class Role extends Entity {
  // Costante per il nome della tabella da usare per le query dirette nei controller
  public static readonly TABLE_NAME: string = ROLE_TABLE_NAME;

  // Definizione centralizzata dei nomi delle colonne
  public static readonly COLUMNS = {
    ID: 'id',
    KEY: 'key',
    NAME: 'name',
    DESCRIPTION: 'description',
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
      maxLength: 1,
    },
  })
  key: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      maxLength: 50,
    },
  })
  name: string;

  @property({
    type: 'string',
    jsonSchema: {
      nullable: true,
      maxLength: 255,
    },
  })
  description?: string;

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

  constructor(data?: Partial<Role>) {
    super(data);
  }
}

export interface RoleRelations {
  // describe navigational properties here
}

export type RoleWithRelations = Role & RoleRelations;
