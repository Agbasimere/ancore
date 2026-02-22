import { SmartAccountSchema } from '../smart-account';
import { SessionKeySchema, SessionPermission } from '../session-key';

describe('schemas', () => {
  test('SmartAccountSchema parses valid object', () => {
    const now = Date.now();
    const obj = {
      publicKey: 'G' + 'A'.repeat(55),
      contractId: 'C' + 'B'.repeat(55),
      nonce: 0,
      metadata: { name: 'Alice', createdAt: now },
    };
    const parsed = SmartAccountSchema.parse(obj);
    expect(parsed.publicKey).toBe(obj.publicKey);
  });

  test('SmartAccountSchema rejects invalid publicKey', () => {
    const obj = { publicKey: 'BAD', contractId: 'C1', nonce: 0 };
    expect(() => SmartAccountSchema.parse(obj)).toThrow();
  });

  test('SessionKeySchema parses valid key', () => {
    const key = {
      publicKey: 'G' + 'A'.repeat(55),
      permissions: [SessionPermission.SEND_PAYMENT],
      expiresAt: Date.now() + 1000,
    };
    const parsed = SessionKeySchema.parse(key);
    expect(parsed.permissions.length).toBeGreaterThan(0);
  });

  test('SessionKeySchema rejects bad permissions', () => {
    const key = {
      publicKey: 'G' + 'A'.repeat(55),
      permissions: [99],
      expiresAt: Date.now() + 1000,
    };
    expect(() => SessionKeySchema.parse(key)).toThrow();
  });
});
