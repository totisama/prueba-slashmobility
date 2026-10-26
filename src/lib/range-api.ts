import { z } from 'zod';

type RangeLimits = z.infer<typeof rangeLimitsSchema>;
type LoadResult<T> =
  | {
      data: T;
      error: null;
    }
  | {
      data: null;
      error: Error;
    };

const MOCK_API_URL = 'https://6ad91f1ef89c5702ed9a76bd.mockapi.io/api';
const REQUEST_TIMEOUT_MS = 5_000;
const MAX_REQUEST_ATTEMPTS = 3;

const rangeLimitsSchema = z
  .object({
    min: z.number(),
    max: z.number(),
  })
  .refine(({ min, max }) => min < max);

const rangeValuesSchema = z.object({
  rangeValues: z
    .array(z.number())
    .min(2)
    .refine((values) =>
      values.every((value, index) => index === 0 || value > values[index - 1]),
    ),
});

async function fetchWithRetry(url: string): Promise<Response> {
  let lastError: unknown;

  for (let attempt = 0; attempt < MAX_REQUEST_ATTEMPTS; attempt += 1) {
    try {
      const response = await fetch(url, {
        cache: 'no-store',
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}.`);
      }

      return response;
    } catch (error) {
      lastError = error;
    }
  }

  throw new Error('Request failed after three attempts.', { cause: lastError });
}

async function loadRangeData<T>(
  url: string,
  schema: z.ZodType<T>,
): Promise<LoadResult<T>> {
  try {
    const response = await fetchWithRetry(url);
    const data: unknown = await response.json();
    const result = schema.safeParse(data);

    if (!result.success) {
      return {
        data: null,
        error: new Error('Received invalid range data.'),
      };
    }

    return { data: result.data, error: null };
  } catch (error) {
    return {
      data: null,
      error: new Error('Unable to load range data.', { cause: error }),
    };
  }
}

export async function loadRangeLimits(): Promise<LoadResult<RangeLimits>> {
  return loadRangeData(`${MOCK_API_URL}/continuous-range/1`, rangeLimitsSchema);
}

export async function loadRangeValues(): Promise<LoadResult<number[]>> {
  const result = await loadRangeData(
    `${MOCK_API_URL}/fixed-range/1`,
    rangeValuesSchema,
  );

  if (result.error) {
    return result;
  }

  return { data: result.data.rangeValues, error: null };
}
