#![no_std]

//! # Ancore Account Contract
//!
//! Core smart account contract implementing account abstraction for Stellar/Soroban.
//!
//! ## Security
//! This contract is security-critical and must be audited before mainnet deployment.
//!
//! ## Features
//! - Signature validation
//! - Session key support
//! - Upgradeable via proxy pattern
//! - Multi-signature support

use soroban_sdk::{
    contract, contractimpl, contracttype, Address, BytesN, Env, Symbol, Val, Vec,
};

/// Structured errors for the account contract (replaces raw panics).
#[contracttype]
#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub enum ContractError {
    NotInitialized = 1,
    InvalidNonce = 2,
    Unauthorized = 3,
    AlreadyInitialized = 4,
}

impl ContractError {
    pub fn message(&self) -> &'static str {
        match self {
            ContractError::NotInitialized => "Not initialized",
            ContractError::InvalidNonce => "Invalid nonce",
            ContractError::Unauthorized => "Unauthorized",
            ContractError::AlreadyInitialized => "Already initialized",
        }
    }
}

#[contracttype]
#[derive(Clone)]
pub struct SessionKey {
    pub public_key: BytesN<32>,
    pub expires_at: u64,
    pub permissions: Vec<u32>,
}

#[contracttype]
pub enum DataKey {
    Owner,
    Nonce,
    SessionKey(BytesN<32>),
}

#[contract]
pub struct AncoreAccount;

#[contractimpl]
impl AncoreAccount {
    /// Initialize the account with an owner
    pub fn initialize(env: Env, owner: Address) {
        if env.storage().instance().has(&DataKey::Owner) {
            panic!("{}", ContractError::AlreadyInitialized.message());
        }

        env.storage().instance().set(&DataKey::Owner, &owner);
        env.storage().instance().set(&DataKey::Nonce, &0u64);
    }

    /// Get the account owner
    pub fn get_owner(env: Env) -> Address {
        env.storage()
            .instance()
            .get(&DataKey::Owner)
            .unwrap_or_else(|| panic!("{}", ContractError::NotInitialized.message()))
    }

    /// Get the current nonce
    pub fn get_nonce(env: Env) -> u64 {
        env.storage()
            .instance()
            .get(&DataKey::Nonce)
            .unwrap_or(0)
    }

    /// Execute a transaction: validate nonce, perform cross-contract call, increment nonce.
    ///
    /// # Security
    /// - Caller must be owner (session key auth not yet wired)
    /// - `expected_nonce` must match current nonce (replay protection)
    /// - Nonce is incremented only after a successful invocation
    pub fn execute(
        env: Env,
        to: Address,
        function: Symbol,
        args: Vec<Val>,
        expected_nonce: u64,
    ) -> Val {
        let owner = Self::get_owner(env.clone());
        owner.require_auth();

        let current_nonce = Self::get_nonce(env.clone());
        if current_nonce != expected_nonce {
            panic!("{}", ContractError::InvalidNonce.message());
        }

        let result = env.invoke_contract::<Val>(&to, &function, args);

        env.storage()
            .instance()
            .set(&DataKey::Nonce, &(current_nonce + 1));

        result
    }

    /// Add a session key
    pub fn add_session_key(
        env: Env,
        public_key: BytesN<32>,
        expires_at: u64,
        permissions: Vec<u32>,
    ) {
        let owner = Self::get_owner(env.clone());
        owner.require_auth();

        let session_key = SessionKey {
            public_key: public_key.clone(),
            expires_at,
            permissions,
        };

        env.storage()
            .persistent()
            .set(&DataKey::SessionKey(public_key), &session_key);
    }

    /// Revoke a session key
    pub fn revoke_session_key(env: Env, public_key: BytesN<32>) {
        let owner = Self::get_owner(env.clone());
        owner.require_auth();

        env.storage()
            .persistent()
            .remove(&DataKey::SessionKey(public_key));
    }

    /// Get a session key
    pub fn get_session_key(env: Env, public_key: BytesN<32>) -> Option<SessionKey> {
        env.storage()
            .persistent()
            .get(&DataKey::SessionKey(public_key))
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::{testutils::Address as _, Address, Env};

    #[test]
    fn test_initialize() {
        let env = Env::default();
        let contract_id = env.register_contract(None, AncoreAccount);
        let client = AncoreAccountClient::new(&env, &contract_id);

        let owner = Address::generate(&env);
        client.initialize(&owner);

        assert_eq!(client.get_owner(), owner);
        assert_eq!(client.get_nonce(), 0);
    }

    #[test]
    fn test_add_session_key() {
        let env = Env::default();
        let contract_id = env.register_contract(None, AncoreAccount);
        let client = AncoreAccountClient::new(&env, &contract_id);

        let owner = Address::generate(&env);
        client.initialize(&owner);

        env.mock_all_auths();

        let session_pk = BytesN::from_array(&env, &[1u8; 32]);
        let expires_at = 1000u64;
        let permissions = Vec::new(&env);

        client.add_session_key(&session_pk, &expires_at, &permissions);

        let session_key = client.get_session_key(&session_pk);
        assert!(session_key.is_some());
    }

    #[test]
    #[should_panic(expected = "Already initialized")]
    fn test_double_initialize() {
        let env = Env::default();
        let contract_id = env.register_contract(None, AncoreAccount);
        let client = AncoreAccountClient::new(&env, &contract_id);

        let owner = Address::generate(&env);
        client.initialize(&owner);
        client.initialize(&owner); // Should panic
    }

    #[test]
    #[should_panic(expected = "Invalid nonce")]
    fn test_execute_rejects_invalid_nonce() {
        let env = Env::default();
        let contract_id = env.register_contract(None, AncoreAccount);
        let client = AncoreAccountClient::new(&env, &contract_id);

        let owner = Address::generate(&env);
        client.initialize(&owner);

        env.mock_all_auths();

        let to = Address::generate(&env);
        let function = soroban_sdk::symbol_short!("transfer");
        let args = Vec::new(&env);

        // Current nonce is 0; passing expected_nonce = 1 should panic Invalid nonce
        client.execute(&to, &function, &args, &1u64);
    }

    #[test]
    fn test_execute_validates_nonce_then_increments() {
        let env = Env::default();
        let contract_id = env.register_contract(None, AncoreAccount);
        let client = AncoreAccountClient::new(&env, &contract_id);

        let owner = Address::generate(&env);
        client.initialize(&owner);

        assert_eq!(client.get_nonce(), 0);

        env.mock_all_auths();

        // Deploy a trivial contract that returns a Val so we can invoke it
        let callee_id = env.register_contract(None, AncoreAccount);
        let to = callee_id;
        let function = soroban_sdk::symbol_short!("get_nonce");
        let args = Vec::new(&env);

        // Execute with expected_nonce = 0 (matches current); invokes get_nonce on callee
        let _result = client.execute(&to, &function, &args, &0u64);

        assert_eq!(client.get_nonce(), 1);
    }
}
