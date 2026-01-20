/**
 * Ancore Core SDK
 * 
 * Main entry point for the Ancore SDK.
 * Provides account abstraction and smart wallet functionality for Stellar/Soroban.
 * 
 * @packageDocumentation
 */

export const VERSION = '0.1.0';

/**
 * Initialize the Ancore SDK
 * 
 * @param config - Configuration options
 * @returns SDK instance
 */
export function init(config: { network: 'testnet' | 'mainnet' }) {
  return {
    version: VERSION,
    network: config.network,
  };
}

// Re-export from submodules
export * from './account';
export * from './session';
export * from './transactions';
