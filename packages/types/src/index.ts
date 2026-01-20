/**
 * Shared TypeScript types for Ancore
 */

export interface Address {
  value: string;
}

export interface PublicKey {
  value: string;
}

export interface Signature {
  r: string;
  s: string;
  v: number;
}

export type Network = 'testnet' | 'mainnet' | 'local';

export interface NetworkConfig {
  network: Network;
  rpcUrl?: string;
  networkPassphrase?: string;
}
