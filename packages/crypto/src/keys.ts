/**
 * Key generation and management
 */

export interface KeyPair {
  publicKey: Uint8Array;
  privateKey: Uint8Array;
}

export async function generateKeyPair(): Promise<KeyPair> {
  // TODO: Implement using @noble/ed25519
  return {
    publicKey: new Uint8Array(32),
    privateKey: new Uint8Array(32),
  };
}

export function derivePublicKey(privateKey: Uint8Array): Uint8Array {
  // TODO: Implement public key derivation
  return new Uint8Array(32);
}
