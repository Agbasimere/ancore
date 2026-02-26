# @ancore/types

This package provides shared TypeScript types for Ancore and extends the
Stellar SDK with account abstraction types used by Soroban-backed smart
accounts and session keys.

Key points:

- Re-exports common `@stellar/stellar-sdk` types so consumers can import
  everything from `@ancore/types`.
- Adds `SmartAccount` and `SessionKey` types that complement Soroban
  contract structures.
- Includes runtime Zod schemas and lightweight type guards for validation.

Use the Stellar SDK types for standard operations (`Transaction`, `Keypair`, etc.)
and the custom types in this package for account abstraction specific data.
