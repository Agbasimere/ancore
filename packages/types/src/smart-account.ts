/**
 * Smart account types for Soroban-based account abstraction.
 * These extend the Stellar model with contract-related fields.
 */

import { z } from 'zod';

/**
 * Metadata used by wallets for display purposes.
 * Maps to off-chain metadata for a Soroban account wrapper.
 */
export interface AccountMetadata {
  /** User-friendly name for the account */
  name: string;
  /** Optional icon URL or data URI */
  icon?: string;
  /** Unix timestamp (ms) when the account was created locally */
  createdAt: number;
}

/**
 * SmartAccount represents an account abstraction instance backed by a
 * Soroban contract. Fields map to contract instance id + public key + nonce.
 *
 * Soroban mapping (example):
 * - `public_key` -> Stellar account public key (G...)
 * - `contract_id` -> Contract instance id (C... or hex)
 * - `nonce` -> u64 nonce stored in contract for replay protection
 */
export interface SmartAccount {
  publicKey: string; // G... address
  contractId: string; // contract instance id
  nonce: number; // contract nonce for replay protection
  metadata?: AccountMetadata;
}

export const AccountMetadataSchema = z.object({
  name: z.string(),
  icon: z.string().optional(),
  createdAt: z.number().int(),
});

export const SmartAccountSchema = z.object({
  publicKey: z.string().regex(/^G[A-Z0-9]{55}$/),
  contractId: z.string(),
  nonce: z.number().int().nonnegative(),
  metadata: AccountMetadataSchema.optional(),
});

export type SmartAccountFromSchema = z.infer<typeof SmartAccountSchema>;
