import { isError } from "lodash";

interface TryRetryErrorInfo {
    // Current try count
    currentTry: number;
  
    // Max try count
    maxTries: number;
  
    // Error that was thrown
    error: Error;
  }

interface TryRetryOptions {
    // Retry status message (defaults to the error thrown)
    retryMessage?: string;
    // Maximum amount of times to try (defaults to Infinity)
    maxTries?: number;
    // Delay (in MS) between subsequent retries (after failing) (defaults to this.config.retryDelay)
    delay?: number;
    // Called after an error has occured
    onError?: (info: TryRetryErrorInfo) => Promise<void> | void;
  }

export async function tryRetry<F extends (...args: any[]) => any>(
    fn: F,
    opts?: TryRetryOptions
  ): Promise<F extends (...args: any[]) => PromiseLike<infer R> ? R : ReturnType<F>> {
    /* eslint-disable @typescript-eslint/no-unsafe-assignment */
    /* eslint-disable @typescript-eslint/no-unsafe-return */
    /* eslint-disable @typescript-eslint/no-unsafe-member-access */
    /* eslint-disable @typescript-eslint/restrict-template-expressions */
    const maxRetry = opts?.maxTries ?? Infinity;
    const retryMessage = opts?.retryMessage;
    const delay = opts?.delay ?? 1000;

    let error: any;
    for (let i = 1; i <= maxRetry; i++) {
     

    //   console.log(`Trying method ${i}/${maxRetry}`);
      try {
        const val = await Promise.resolve(fn());

        return val;
      } catch (err: any) {
        error = err;
        if (opts?.onError) {
          await Promise.resolve(
            opts.onError({ currentTry: i, maxTries: maxRetry, error: isError(err) ? err : error })
          );
        }
        // if (i !== maxRetry) {
        //   console.log(`Sleeping for ${delay}ms before retrying`);
        // }
      }
    }
    console.log(`Method failed all ${maxRetry} tries`);
    throw error;
    /* eslint-enable */
  }