/**
 * Runtime type guards for custom types in this package.
 */

import { SmartAccount } from './smart-account';
import { SessionKey } from './session-key';

export function isSmartAccount(value: unknown): value is SmartAccount {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.publicKey === 'string' &&
    typeof v.contractId === 'string' &&
    typeof v.nonce === 'number'
  );
}

export function isSessionKey(value: unknown): value is SessionKey {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.publicKey === 'string' &&
    Array.isArray(v.permissions) &&
    typeof v.expiresAt === 'number'
  );
}

export function isValidPermission(value: unknown): boolean {
  if (typeof value !== 'number') return false;
  return [0, 1, 2].includes(value);
}
