import type { Transaction } from '@stellar/stellar-sdk';
import { StellarClient } from '../client';
import { NetworkError, AccountNotFoundError, TransactionError } from '../errors';

const createMockTransaction = (): Transaction =>
  ({
    toXDR: () => 'xdr',
  }) as unknown as Transaction;

// Mock the stellar SDK
jest.mock('@stellar/stellar-sdk', () => {
  const mockLoadAccount = jest.fn();
  const mockSubmitTransaction = jest.fn();
  const mockGetHealth = jest.fn();

  return {
    rpc: {
      Server: jest.fn().mockImplementation(() => ({
        getHealth: mockGetHealth,
      })),
    },
    Horizon: {
      Server: jest.fn().mockImplementation(() => ({
        loadAccount: mockLoadAccount,
        submitTransaction: mockSubmitTransaction,
      })),
      HorizonApi: {
        SubmitTransactionResponse: class {},
      },
    },
    __mocks__: {
      mockLoadAccount,
      mockSubmitTransaction,
      mockGetHealth,
    },
  };
});

// Get mock functions
const stellarSdk = jest.requireMock('@stellar/stellar-sdk');
const { mockLoadAccount, mockSubmitTransaction, mockGetHealth } = stellarSdk.__mocks__;

// Mock fetch for friendbot
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('StellarClient', () => {
  let client: StellarClient;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    client = new StellarClient({
      network: 'testnet',
      retryOptions: { maxRetries: 1, baseDelayMs: 100 },
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('constructor', () => {
    it('should create client with testnet config', () => {
      const testnetClient = new StellarClient({ network: 'testnet' });
      expect(testnetClient.getNetwork()).toBe('testnet');
      expect(testnetClient.getNetworkPassphrase()).toBe('Test SDF Network ; September 2015');
    });

    it('should create client with mainnet config', () => {
      const mainnetClient = new StellarClient({ network: 'mainnet' });
      expect(mainnetClient.getNetwork()).toBe('mainnet');
      expect(mainnetClient.getNetworkPassphrase()).toBe(
        'Public Global Stellar Network ; September 2015'
      );
    });

    it('should create client with custom RPC URL', () => {
      const customClient = new StellarClient({
        network: 'testnet',
        rpcUrl: 'https://custom-rpc.example.com',
      });
      expect(customClient.getNetwork()).toBe('testnet');
    });

    it('should create client with custom network passphrase', () => {
      const customClient = new StellarClient({
        network: 'local',
        networkPassphrase: 'Custom Network',
      });
      expect(customClient.getNetworkPassphrase()).toBe('Custom Network');
    });
  });

  describe('getAccount', () => {
    it('should return account data on success', async () => {
      const mockAccount = {
        id: 'GABC123',
        balances: [{ asset_type: 'native', balance: '100' }],
      };
      mockLoadAccount.mockResolvedValueOnce(mockAccount);

      const result = await client.getAccount('GABC123');

      expect(result).toEqual(mockAccount);
      expect(mockLoadAccount).toHaveBeenCalledWith('GABC123');
    });

    it('should throw AccountNotFoundError when account does not exist', async () => {
      mockLoadAccount.mockRejectedValueOnce(new Error('Not Found'));

      await expect(client.getAccount('GNOTFOUND')).rejects.toThrow(AccountNotFoundError);
    });

    it('should throw NetworkError on network failure', async () => {
      mockLoadAccount.mockRejectedValue(new Error('Network timeout'));

      const promise = client.getAccount('GABC123');

      // Advance through retry
      for (let i = 0; i < 5; i++) {
        await Promise.resolve();
        jest.advanceTimersByTime(200);
      }

      await expect(promise).rejects.toThrow(NetworkError);
    });

    it('should rethrow NetworkError when retries exhausted', async () => {
      mockFetch.mockResolvedValue({ ok: false, status: 500 });

      const retryingClient = new StellarClient({
        network: 'testnet',
        retryOptions: { maxRetries: 1, baseDelayMs: 100 },
      });

      const promise = retryingClient.fundWithFriendbot('GABC123');

      for (let i = 0; i < 5; i++) {
        await Promise.resolve();
        jest.advanceTimersByTime(200);
      }

      await expect(promise).rejects.toThrow(NetworkError);
    });
  });

  describe('getBalances', () => {
    it('should return XLM balance', async () => {
      const mockAccount = {
        balances: [{ asset_type: 'native', balance: '100.5' }],
      };
      mockLoadAccount.mockResolvedValueOnce(mockAccount);

      const balances = await client.getBalances('GABC123');

      expect(balances).toEqual([{ asset: 'XLM', balance: '100.5', assetType: 'native' }]);
    });

    it('should return token balances', async () => {
      const mockAccount = {
        balances: [
          { asset_type: 'native', balance: '100' },
          {
            asset_type: 'credit_alphanum4',
            asset_code: 'USDC',
            asset_issuer: 'GISSUER',
            balance: '50',
          },
        ],
      };
      mockLoadAccount.mockResolvedValueOnce(mockAccount);

      const balances = await client.getBalances('GABC123');

      expect(balances).toHaveLength(2);
      expect(balances[0]).toEqual({
        asset: 'XLM',
        balance: '100',
        assetType: 'native',
      });
      expect(balances[1]).toEqual({
        asset: 'USDC:GISSUER',
        balance: '50',
        assetType: 'credit_alphanum4',
        assetCode: 'USDC',
        assetIssuer: 'GISSUER',
      });
    });
  });

  describe('submitTransaction', () => {
    it('should submit transaction successfully', async () => {
      const mockResponse = { hash: 'txhash123', successful: true };
      mockSubmitTransaction.mockResolvedValueOnce(mockResponse);

      const mockTransaction = createMockTransaction();
      const result = await client.submitTransaction(mockTransaction);

      expect(result).toEqual(mockResponse);
    });

    it('should throw TransactionError on submission failure', async () => {
      const errorResponse = {
        response: {
          data: {
            extras: {
              result_codes: { transaction: 'tx_failed' },
            },
          },
        },
      };
      mockSubmitTransaction.mockRejectedValue(errorResponse);

      const mockTransaction = createMockTransaction();
      const promise = client.submitTransaction(mockTransaction);

      // Advance through retry
      for (let i = 0; i < 5; i++) {
        await Promise.resolve();
        jest.advanceTimersByTime(200);
      }

      await expect(promise).rejects.toThrow(TransactionError);
    });

    it('should rethrow NetworkError after retries exhausted', async () => {
      mockSubmitTransaction.mockRejectedValue(new Error('network down'));

      const retryingClient = new StellarClient({
        network: 'testnet',
        retryOptions: { maxRetries: 1, baseDelayMs: 100 },
      });

      const mockTransaction = createMockTransaction();
      const promise = retryingClient.submitTransaction(mockTransaction);

      for (let i = 0; i < 5; i++) {
        await Promise.resolve();
        jest.advanceTimersByTime(200);
      }

      await expect(promise).rejects.toThrow(NetworkError);
    });
  });

  describe('fundWithFriendbot', () => {
    it('should fund account on testnet', async () => {
      mockFetch.mockResolvedValueOnce({ ok: true });

      const result = await client.fundWithFriendbot('GABC123');

      expect(result).toBe(true);
      expect(mockFetch).toHaveBeenCalledWith('https://friendbot.stellar.org?addr=GABC123');
    });

    it('should throw NetworkError when not on testnet', async () => {
      const mainnetClient = new StellarClient({ network: 'mainnet' });

      await expect(mainnetClient.fundWithFriendbot('GABC123')).rejects.toThrow(NetworkError);
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('should throw NetworkError on friendbot failure', async () => {
      mockFetch.mockResolvedValueOnce({ ok: false, status: 400 });

      const promise = client.fundWithFriendbot('GABC123');

      // Advance through retry
      for (let i = 0; i < 5; i++) {
        await Promise.resolve();
        jest.advanceTimersByTime(200);
      }

      await expect(promise).rejects.toThrow(NetworkError);
    });
  });

  describe('isHealthy', () => {
    it('should return true when network is healthy', async () => {
      mockGetHealth.mockResolvedValueOnce({ status: 'healthy' });

      const result = await client.isHealthy();

      expect(result).toBe(true);
    });

    it('should return false when network is unhealthy', async () => {
      mockGetHealth.mockRejectedValueOnce(new Error('Connection failed'));

      const result = await client.isHealthy();

      expect(result).toBe(false);
    });
  });
});

describe('Error classes', () => {
  it('NetworkError should have correct properties', () => {
    const cause = new Error('original');
    const error = new NetworkError('test', { cause, statusCode: 500 });

    expect(error.name).toBe('NetworkError');
    expect(error.message).toBe('test');
    expect(error.cause).toBe(cause);
    expect(error.statusCode).toBe(500);
  });

  it('AccountNotFoundError should include public key', () => {
    const error = new AccountNotFoundError('GABC123');

    expect(error.name).toBe('AccountNotFoundError');
    expect(error.publicKey).toBe('GABC123');
    expect(error.message).toContain('GABC123');
  });

  it('TransactionError should have result codes', () => {
    const error = new TransactionError('failed', {
      resultCode: 'tx_failed',
      resultXdr: 'xdr123',
    });

    expect(error.name).toBe('TransactionError');
    expect(error.resultCode).toBe('tx_failed');
    expect(error.resultXdr).toBe('xdr123');
  });
});
