/**
 * Session key types matching Soroban contract session key structure.
 */

import { z } from 'zod';

/** Permission types allowed for a session key. This maps to the contract's Vec<u32> permissions. */
export enum SessionPermission {
  SEND_PAYMENT = 0,
  MANAGE_DATA = 1,
  INVOKE_CONTRACT = 2,
}

/**
 * SessionKey describes a delegated key with limited permissions and expiration.
 * Soroban mapping example:
 * - `public_key` -> G... address
 * - `permissions` -> Vec<u32> where each u32 maps to a permission enum
 * - `expires_at` -> u64 expiration timestamp
 */
export interface SessionKey {
  publicKey: string;
  permissions: SessionPermission[];
  expiresAt: number; // unix ms
  label?: string;
}

export const SessionKeySchema = z.object({
  publicKey: z.string().regex(/^G[A-Z0-9]{55}$/),
  permissions: z.array(z.nativeEnum(SessionPermission)),
  expiresAt: z.number().int().positive(),
  label: z.string().optional(),
});

export type SessionKeyFromSchema = z.infer<typeof SessionKeySchema>;
