import { afterEach, describe, expect, test, vi } from 'vitest';
import { loadRangeLimits, loadRangeValues } from '../range-api';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('loadRangeLimits', () => {
  test('returns the limits from a valid response', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ min: 1, max: 100 }),
    });
    vi.stubGlobal('fetch', fetchMock);

    expect(await loadRangeLimits()).toEqual({ min: 1, max: 100 });
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/continuous-range/1'),
      { cache: 'no-store' },
    );
  });

  test.each([
    { min: '1', max: 100 },
    { min: 100, max: 1 },
  ])('returns null when the limits are invalid', async (data) => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue({ ok: true, json: async () => data });
    vi.stubGlobal('fetch', fetchMock);

    expect(await loadRangeLimits()).toBeNull();
  });

  test('returns null when the HTTP response is not successful', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: false });
    vi.stubGlobal('fetch', fetchMock);

    expect(await loadRangeLimits()).toBeNull();
  });

  test('returns null when the request fails', async () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error('Network error'));
    vi.stubGlobal('fetch', fetchMock);

    expect(await loadRangeLimits()).toBeNull();
  });
});

describe('loadRangeValues', () => {
  test('returns the values from a valid response', async () => {
    const values = [1.99, 5.99, 10.99, 30.99, 50.99, 70.99];
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ rangeValues: values }),
    });
    vi.stubGlobal('fetch', fetchMock);

    expect(await loadRangeValues()).toEqual(values);
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/fixed-range/1'),
      { cache: 'no-store' },
    );
  });

  test.each([{ rangeValues: [] }, { rangeValues: [1.99, '5.99'] }])(
    'returns null when the values are invalid',
    async (data) => {
      const fetchMock = vi
        .fn()
        .mockResolvedValue({ ok: true, json: async () => data });
      vi.stubGlobal('fetch', fetchMock);

      expect(await loadRangeValues()).toBeNull();
    },
  );

  test('returns null when the HTTP response is not successful', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: false });
    vi.stubGlobal('fetch', fetchMock);

    expect(await loadRangeValues()).toBeNull();
  });

  test('returns null when the request fails', async () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error('Network error'));
    vi.stubGlobal('fetch', fetchMock);

    expect(await loadRangeValues()).toBeNull();
  });
});
