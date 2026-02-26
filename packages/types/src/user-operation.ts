/**
 * User operation types for smart account transactions.
 * Represents an operation to be executed via the Soroban contract.
 */

import { z } from 'zod';
import { Operation } from '@stellar/stellar-sdk';

/**
 * UserOperation represents a smart account operation to be executed via the contract.
 * This is the primary abstraction for operations within the account abstraction layer.
 *
 * Fields:
 * - `id`: Unique identifier for this operation
 * - `type`: Operation type (e.g., 'payment', 'invoke', 'manage_data')
 * - `operation`: The underlying Stellar Operation object
 * - `gasLimit`: Maximum gas units to consume (for future use with fee abstraction)
 * - `createdAt`: Unix timestamp (ms) when the operation was created
 */
export interface UserOperation {
  id: string;
  type: string;
  operation: Operation;
  gasLimit?: number;
  createdAt: number;
}

/**
 * TransactionResult represents the result of submitting a transaction.
 * Contains status, hash, ledger, and optional error information.
 *
 * Fields:
 * - `status`: Result status ('success', 'failure', 'pending')
 * - `hash`: Transaction hash (if available)
 * - `ledger`: Ledger sequence number (if confirmed)
 * - `error`: Error message (if failed)
 * - `timestamp`: Unix timestamp (ms) when the result was recorded
 */
export interface TransactionResult {
  status: 'success' | 'failure' | 'pending';
  hash?: string;
  ledger?: number;
  error?: string;
  timestamp: number;
}

export const UserOperationSchema = z.object({
  id: z.string().min(1),
  type: z.string().min(1),
  operation: z.object({}).passthrough(), // Operation object is complex, validate loosely
  gasLimit: z.number().int().positive().optional(),
  createdAt: z.number().int().nonnegative(),
});

export const TransactionResultSchema = z.object({
  status: z.enum(['success', 'failure', 'pending']),
  hash: z.string().optional(),
  ledger: z.number().int().positive().optional(),
  error: z.string().optional(),
  timestamp: z.number().int().nonnegative(),
});

export type UserOperationFromSchema = z.infer<typeof UserOperationSchema>;
export type TransactionResultFromSchema = z.infer<typeof TransactionResultSchema>;
