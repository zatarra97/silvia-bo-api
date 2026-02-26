import {HttpErrors} from '@loopback/rest';
import {UserProfile} from '@loopback/security';

export function requireAdmin(user: UserProfile): void {
  const groups: string[] = (user as any).groups ?? [];
  if (!groups.includes('Admin')) {
    throw new HttpErrors.Forbidden('Accesso riservato agli amministratori.');
  }
}
