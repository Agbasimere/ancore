# @ancore/core-sdk

Core SDK for building on Ancore - account abstraction and smart wallet functionality for Stellar/Soroban.

## Installation

```bash
npm install @ancore/core-sdk
# or
pnpm add @ancore/core-sdk
# or
yarn add @ancore/core-sdk
```

## Quick Start

```typescript
import { init, createAccount, createSession } from '@ancore/core-sdk';

// Initialize SDK
const ancore = init({ network: 'testnet' });

// Create a smart account
const account = await createAccount({
  owner: 'GABC...XYZ',
});

// Create a session key
const session = await createSession(account.address, {
  duration: 3600000, // 1 hour
  permissions: ['transfer', 'invoke'],
});
```

## Features

- **Smart Accounts**: Create and manage programmable accounts
- **Session Keys**: Time-limited signing permissions
- **Transaction Building**: Easy transaction construction
- **Type Safety**: Full TypeScript support

## Documentation

See the [docs](https://github.com/ancore-org/ancore/tree/main/docs) folder for full documentation.

## API Reference

### `init(config)`

Initialize the SDK with network configuration.

### `createAccount(options)`

Create a new smart account.

### `createSession(account, options)`

Create a session key for an account.

### `submitTransaction(tx)`

Submit a transaction to the network.

## License

Apache-2.0
