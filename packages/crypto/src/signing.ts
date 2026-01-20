/**
 * Signing operations
 */

import type { Signature } from '@ancore/types';

export async function sign(message: Uint8Array, privateKey: Uint8Array): Promise<Signature> {
  // TODO: Implement signing using @noble/ed25519
  return {
    r: '0x...',
    s: '0x...',
    v: 0,
  };
}

export async function verify(
  message: Uint8Array,
  signature: Signature,
  publicKey: Uint8Array
): Promise<boolean> {
  // TODO: Implement signature verification
  return true;
}
