# Getting Started with Ancore

Welcome to Ancore! This guide will help you get started with building on the Ancore platform.

## What is Ancore?

Ancore is an open-source account abstraction and financial UX layer for the Stellar network. It enables:

- **Smart Accounts**: Programmable accounts with custom validation logic
- **Session Keys**: Seamless UX with time-limited signing permissions
- **Social Recovery**: Recover your account without seed phrases
- **Invoice System**: Native request-to-pay functionality

## Installation

### For End Users

**Browser Extension** (Coming Soon)
- Install from Chrome Web Store
- Install from Firefox Add-ons

**Mobile App** (Coming Soon)
- Download from App Store (iOS)
- Download from Google Play (Android)

### For Developers

Install the Ancore SDK:

```bash
npm install @ancore/core-sdk
# or
pnpm add @ancore/core-sdk
# or
yarn add @ancore/core-sdk
```

## Quick Start

### 1. Initialize the SDK

```typescript
import { init } from '@ancore/core-sdk';

const ancore = init({
  network: 'testnet', // or 'mainnet'
});
```

### 2. Create a Smart Account

```typescript
import { createAccount } from '@ancore/core-sdk';

const account = await createAccount({
  owner: 'GABC...XYZ', // Your Stellar address
});

console.log('Account created:', account.address);
```

### 3. Create a Session Key

```typescript
import { createSession } from '@ancore/core-sdk';

const session = await createSession(account.address, {
  duration: 3600000, // 1 hour in milliseconds
  permissions: [
    'transfer', // Can send payments
    'invoke',   // Can invoke contracts
  ],
});
```

### 4. Send a Transaction

```typescript
import { submitTransaction } from '@ancore/core-sdk';

const tx = await submitTransaction({
  from: account.address,
  to: 'GDEF...XYZ',
  amount: '100', // XLM
});

console.log('Transaction hash:', tx.hash);
```

## Next Steps

### Learn the Basics

- [Core Concepts](./CONCEPTS.md)
- [Account Model](./architecture/ACCOUNT_MODEL.md)
- [Session Keys](./architecture/SESSION_KEYS.md)

### Build Something

- [Tutorial: Build a Simple Wallet](./tutorials/SIMPLE_WALLET.md)
- [Tutorial: Add Session Keys](./tutorials/SESSION_KEYS.md)
- [Tutorial: Social Recovery](./tutorials/SOCIAL_RECOVERY.md)

### Dive Deeper

- [Architecture Overview](./architecture/OVERVIEW.md)
- [API Reference](./api/REFERENCE.md)
- [Smart Contract Guide](./contracts/GUIDE.md)

## Examples

Check out example applications in the `examples/` directory:

- `examples/simple-wallet` - Basic wallet implementation
- `examples/session-keys` - Session key integration
- `examples/social-recovery` - Social recovery setup

## Community

- **Telegram**: [https://t.me/+OqlAx-gQx3M4YzJk](https://t.me/+OqlAx-gQx3M4YzJk)

## Contributing

We welcome contributions! See [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines.

## Support

- **GitHub Issues**: [github.com/ancore-org/ancore/issues](https://github.com/ancore-org/ancore/issues)
- **Telegram**: [https://t.me/+OqlAx-gQx3M4YzJk](https://t.me/+OqlAx-gQx3M4YzJk)

## License

- **SDK & Contracts**: Apache-2.0
- **Applications**: MIT

See [LICENSE](../LICENSE) for details.

---

**Ready to build?** Head to the [tutorials](./tutorials/) to start building with Ancore!
