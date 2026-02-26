/**
 * Wallet state and storage types for the extension wallet.
 */

import { z } from 'zod';

/**
 * WalletState represents the lock state of the wallet.
 * - 'uninitialized': Wallet has not been set up yet
 * - 'locked': Wallet is initialized but currently locked (requires password/biometric)
 * - 'unlocked': Wallet is unlocked and ready to sign transactions
 */
export type WalletState = 'uninitialized' | 'locked' | 'unlocked';

/**
 * StorageKey enum provides typed keys for chrome.storage API access.
 * Ensures type safety when reading/writing wallet state and data.
 */
export enum StorageKey {
  // Core wallet state
  WALLET_STATE = 'walletState',
  ACCOUNTS = 'accounts',
  CURRENT_ACCOUNT_ID = 'currentAccountId',

  // Session and security
  SESSION_KEYS = 'sessionKeys',
  SETTINGS = 'settings',
  PASSWORD_HASH = 'passwordHash',

  // Transaction history
  TRANSACTIONS = 'transactions',
  PENDING_OPERATIONS = 'pendingOperations',

  // Network configuration
  NETWORK = 'network',
}

export const WalletStateSchema = z.enum(['uninitialized', 'locked', 'unlocked']);

export type WalletStateFromSchema = z.infer<typeof WalletStateSchema>;
