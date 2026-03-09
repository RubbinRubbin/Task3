interface RetryOptions {
  maxAttempts: number;
  baseDelayMs: number;
}

const RETRYABLE_STATUS_CODES = [429, 500, 502, 503];

export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = { maxAttempts: 3, baseDelayMs: 1000 }
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= options.maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error: unknown) {
      lastError = error;

      const status = (error as { status?: number }).status;
      const isRetryable = status !== undefined && RETRYABLE_STATUS_CODES.includes(status);

      if (!isRetryable || attempt === options.maxAttempts) {
        throw error;
      }

      // Exponential backoff with jitter
      const delay = options.baseDelayMs * Math.pow(2, attempt - 1) + Math.random() * 500;
      console.warn(`⚠️ Attempt ${attempt} failed (status ${status}), retrying in ${Math.round(delay)}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}
