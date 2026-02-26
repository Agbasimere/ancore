/**
 * Runtime type guards for custom types in this package.
 */

import { SmartAccount } from './smart-account';
import { SessionKey } from './session-key';
import { UserOperation, TransactionResult } from './user-operation';
import { WalletState } from './wallet';

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

/**
 * Type guard for UserOperation.
 */
export function isUserOperation(value: unknown): value is UserOperation {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.id === 'string' &&
    typeof v.type === 'string' &&
    typeof v.operation === 'object' &&
    v.operation !== null &&
    typeof v.createdAt === 'number'
  );
}

/**
 * Type guard for TransactionResult.
 */
export function isTransactionResult(value: unknown): value is TransactionResult {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.status === 'string' &&
    ['success', 'failure', 'pending'].includes(v.status as string) &&
    typeof v.timestamp === 'number' &&
    (v.hash === undefined || typeof v.hash === 'string') &&
    (v.ledger === undefined || typeof v.ledger === 'number') &&
    (v.error === undefined || typeof v.error === 'string')
  );
}

/**
 * Type guard for WalletState.
 */
export function isWalletState(value: unknown): value is WalletState {
  return typeof value === 'string' && ['uninitialized', 'locked', 'unlocked'].includes(value);
}
