/**
 * Re-export commonly used types from @stellar/stellar-sdk.
 * We DO NOT redefine SDK types — we re-export them so consumers
 * can import them from @ancore/types alongside our custom types.
 */
export {
  Keypair,
  Account as StellarAccount,
  Transaction,
  TransactionBuilder,
  Operation,
  Memo,
  MemoText,
  Networks,
  Asset,
} from '@stellar/stellar-sdk';

export type { StrKey } from '@stellar/stellar-sdk';
