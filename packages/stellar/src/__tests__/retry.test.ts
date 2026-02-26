import { withRetry, calculateDelay } from '../retry';
import { RetryExhaustedError } from '../errors';

describe('calculateDelay', () => {
  it('should return base delay for first attempt with exponential backoff', () => {
    expect(calculateDelay(1, 1000, true)).toBe(1000);
  });

  it('should double delay for each subsequent attempt', () => {
    expect(calculateDelay(1, 1000, true)).toBe(1000);
    expect(calculateDelay(2, 1000, true)).toBe(2000);
    expect(calculateDelay(3, 1000, true)).toBe(4000);
  });

  it('should return constant delay when exponential is false', () => {
    expect(calculateDelay(1, 1000, false)).toBe(1000);
    expect(calculateDelay(2, 1000, false)).toBe(1000);
    expect(calculateDelay(3, 1000, false)).toBe(1000);
  });
});

describe('withRetry', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should return result on first successful attempt', async () => {
    const fn = jest.fn().mockResolvedValue('success');

    const resultPromise = withRetry(fn, { maxRetries: 3, baseDelayMs: 1000 });
    const result = await resultPromise;

    expect(result).toBe('success');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should retry on failure and succeed on subsequent attempt', async () => {
    const fn = jest.fn().mockRejectedValueOnce(new Error('fail')).mockResolvedValueOnce('success');

    const resultPromise = withRetry(fn, { maxRetries: 3, baseDelayMs: 100 });

    // First attempt fails immediately
    await Promise.resolve();

    // Advance timer for first retry delay (100ms)
    jest.advanceTimersByTime(100);

    const result = await resultPromise;

    expect(result).toBe('success');
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('should throw RetryExhaustedError after all retries fail', async () => {
    const error = new Error('persistent failure');
    const fn = jest.fn().mockRejectedValue(error);

    const resultPromise = withRetry(fn, { maxRetries: 3, baseDelayMs: 100 });

    // Advance through all retry delays
    for (let i = 0; i < 10; i++) {
      await Promise.resolve();
      jest.advanceTimersByTime(500);
    }

    await expect(resultPromise).rejects.toThrow(RetryExhaustedError);
    expect(fn).toHaveBeenCalledTimes(4); // 1 initial + 3 retries
  });

  it('should not retry if isRetryable returns false', async () => {
    const nonRetryableError = new Error('non-retryable');
    const fn = jest.fn().mockRejectedValue(nonRetryableError);

    const resultPromise = withRetry(fn, {
      maxRetries: 3,
      baseDelayMs: 100,
      isRetryable: (err) => err.message !== 'non-retryable',
    });

    await expect(resultPromise).rejects.toThrow('non-retryable');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should use default options when none provided', async () => {
    const fn = jest.fn().mockResolvedValue('success');

    const result = await withRetry(fn);

    expect(result).toBe('success');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should handle non-Error throws', async () => {
    const fn = jest.fn().mockRejectedValueOnce('string error').mockResolvedValueOnce('success');

    const resultPromise = withRetry(fn, { maxRetries: 3, baseDelayMs: 100 });

    await Promise.resolve();
    jest.advanceTimersByTime(100);

    const result = await resultPromise;

    expect(result).toBe('success');
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('should include last error in RetryExhaustedError', async () => {
    const lastError = new Error('last error');
    const fn = jest.fn().mockRejectedValue(lastError);

    const resultPromise = withRetry(fn, { maxRetries: 2, baseDelayMs: 100 });

    // Advance through all retry delays
    for (let i = 0; i < 10; i++) {
      await Promise.resolve();
      jest.advanceTimersByTime(500);
    }

    try {
      await resultPromise;
      throw new Error('Expected to throw');
    } catch (error) {
      expect(error).toBeInstanceOf(RetryExhaustedError);
      expect((error as RetryExhaustedError).lastError).toBe(lastError);
      expect((error as RetryExhaustedError).attempts).toBe(3);
    }
  });
});
