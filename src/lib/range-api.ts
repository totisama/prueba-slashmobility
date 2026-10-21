import { z } from 'zod';

type RangeLimits = z.infer<typeof rangeLimitsSchema>;

const MOCK_API_URL = 'https://6ad91f1ef89c5702ed9a76bd.mockapi.io/api';

const rangeLimitsSchema = z
  .object({
    min: z.number(),
    max: z.number(),
  })
  .refine(({ min, max }) => min < max);

const rangeValuesSchema = z.object({
  rangeValues: z.array(z.number()).min(1),
});

export async function loadRangeLimits(): Promise<RangeLimits | null> {
  try {
    const response = await fetch(`${MOCK_API_URL}/continuous-range/1`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Failed to load range limits');
    }

    const data: unknown = await response.json();
    const result = rangeLimitsSchema.safeParse(data);

    return result.success ? result.data : null;
  } catch {
    return null;
  }
}

export async function loadRangeValues(): Promise<number[] | null> {
  try {
    const response = await fetch(`${MOCK_API_URL}/fixed-range/1`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Failed to load range values');
    }

    const data: unknown = await response.json();
    const result = rangeValuesSchema.safeParse(data);

    return result.success ? result.data.rangeValues : null;
  } catch {
    return null;
  }
}
