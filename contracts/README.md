# Ancore Smart Contracts

Soroban smart contracts for the Ancore account abstraction system.

## Structure

```
contracts/
├── account/              # Core account contract
├── validation-modules/   # Pluggable validation logic
├── invoice/              # Invoice system contracts
└── upgrade/              # Upgrade mechanisms
```

## Security

⚠️ **CRITICAL**: All contracts in this directory are security-critical.

### Review Requirements

Changes to contracts require:

1. Core team approval
2. Security team review
3. Comprehensive test coverage
4. Security audit before mainnet deployment

See [SECURITY.md](../SECURITY.md) for the vulnerability disclosure process.

## Development

### Prerequisites

- Rust toolchain (1.74.0+)
- Soroban CLI: `cargo install --locked soroban-cli`
- wasm32-unknown-unknown target: `rustup target add wasm32-unknown-unknown`

### Building All Contracts

From the workspace root:

```bash
cd contracts
cargo build --target wasm32-unknown-unknown --release
```

Or using soroban-cli:

```bash
soroban contract build
```

### Testing

```bash
cargo test
```

Run tests with output:

```bash
cargo test -- --nocapture
```

### Optimized Builds

For production deployment:

```bash
cargo build --target wasm32-unknown-unknown --release
soroban contract optimize --wasm target/wasm32-unknown-unknown/release/*.wasm
```

## Contract Stability

### Immutability Policy

- Deployed contracts are **immutable** once audited
- Upgrades must go through proxy pattern
- Breaking changes require new contract deployment
- No forced upgrades - users opt-in

### Upgrade Path

1. Deploy new contract version
2. Announce upgrade window
3. Users upgrade voluntarily
4. Old contracts remain functional

## Architecture

### Account Contract

The core contract that represents a smart account:

- Stores owner address
- Validates transactions
- Executes operations
- Manages session keys

### Validation Modules

Pluggable signature validation:

- Ed25519 validation (native Stellar)
- Multi-signature
- WebAuthn support
- Custom validation logic

### Invoice System

Request-to-pay functionality:

- Create invoices
- Pay invoices
- Recurring payments
- QR code generation

### Upgrade Mechanisms

Safe upgrade patterns:

- Proxy pattern
- Data migration
- Backwards compatibility

## Testing Strategy

### Unit Tests

Each contract has comprehensive unit tests using `soroban-sdk` test utilities.

```rust
#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::{Env, testutils::Address as _};

    #[test]
    fn test_initialize() {
        // Test implementation
    }
}
```

### Integration Tests

Cross-contract integration tests in workspace root.

### Fuzzing

Use `cargo-fuzz` for fuzzing critical validation logic.

## Deployment

### Testnet

Deploy to Stellar Testnet using soroban-cli:

```bash
# Install CLI
cargo install --locked soroban-cli

# Configure network
soroban network add \
  --global testnet \
  --rpc-url https://soroban-testnet.stellar.org:443 \
  --network-passphrase "Test SDF Network ; September 2015"

# Generate identity
soroban keys generate --global alice --network testnet

# Fund account
soroban keys fund alice --network testnet

# Build contract
cd contracts/account
soroban contract build

# Deploy
soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/ancore_account.wasm \
  --source alice \
  --network testnet
```

### Mainnet

⚠️ Mainnet deployment requires:

- External security audit
- Bug bounty program
- Comprehensive testing
- Community review period

See `docs/contracts/DEPLOYMENT.md` for detailed mainnet procedures.

## Gas Optimization

Contracts are optimized for efficiency:

- Minimal storage usage
- Efficient data structures
- Optimized WASM compilation
- Batch operations where possible

## Soroban SDK Version

Current SDK version: **21.7.0**

Update all contracts when upgrading:

```bash
cargo update -p soroban-sdk
```

## Resources

- [Soroban Documentation](https://soroban.stellar.org/)
- [Soroban SDK Docs](https://docs.rs/soroban-sdk/)
- [Stellar Documentation](https://developers.stellar.org/)
- [Soroban Examples](https://github.com/stellar/soroban-examples)

## Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md) for contribution guidelines.

**Important**: Contract changes require RFC and security review.

## License

Apache-2.0

---

**Audit Status**: Not yet audited - DO NOT use in production
