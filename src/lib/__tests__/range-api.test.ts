import { afterEach, describe, expect, test, vi } from 'vitest';
import { loadRangeLimits, loadRangeValues } from '../range-api';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('loadRangeLimits', () => {
  test('returns limits from a valid response with a timeout signal', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ min: 1, max: 100 }),
    });
    vi.stubGlobal('fetch', fetchMock);

    expect(await loadRangeLimits()).toEqual({
      data: { min: 1, max: 100 },
      error: null,
    });
    expect(fetchMock.mock.calls[0][0]).toContain('/continuous-range/1');
    expect(fetchMock.mock.calls[0][1].cache).toBe('no-store');
    expect(fetchMock.mock.calls[0][1].signal).toBeInstanceOf(AbortSignal);
  });

  test.each([
    { min: '1', max: 100 },
    { min: 100, max: 1 },
  ])('returns an error when the limits are invalid', async (data) => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue({ ok: true, json: async () => data });
    vi.stubGlobal('fetch', fetchMock);

    expect((await loadRangeLimits()).data).toBeNull();
  });

  test('retries when the HTTP response is not successful', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: false, status: 500 });
    vi.stubGlobal('fetch', fetchMock);

    const result = await loadRangeLimits();

    expect(result.data).toBeNull();
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  test('preserves the request error after retrying', async () => {
    const networkError = new Error('Network error');
    const fetchMock = vi.fn().mockRejectedValue(networkError);
    vi.stubGlobal('fetch', fetchMock);

    const result = await loadRangeLimits();

    expect(result.data).toBeNull();
    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(result.error?.cause).toHaveProperty(
      'message',
      'Request failed after three attempts.',
    );
    expect(result.error?.cause).toHaveProperty('cause', networkError);
  });

  test('returns data when the retry succeeds', async () => {
    const fetchMock = vi
      .fn()
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValue({
        ok: true,
        json: async () => ({ min: 1, max: 100 }),
      });
    vi.stubGlobal('fetch', fetchMock);

    expect((await loadRangeLimits()).data).toEqual({ min: 1, max: 100 });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});

describe('loadRangeValues', () => {
  test('returns values from a valid response with a timeout signal', async () => {
    const values = [1.99, 5.99, 10.99, 30.99, 50.99, 70.99];
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ rangeValues: values }),
    });
    vi.stubGlobal('fetch', fetchMock);

    expect(await loadRangeValues()).toEqual({ data: values, error: null });
    expect(fetchMock.mock.calls[0][0]).toContain('/fixed-range/1');
    expect(fetchMock.mock.calls[0][1].cache).toBe('no-store');
    expect(fetchMock.mock.calls[0][1].signal).toBeInstanceOf(AbortSignal);
  });

  test.each([
    { rangeValues: [] },
    { rangeValues: [1.99] },
    { rangeValues: [1.99, '5.99'] },
    { rangeValues: [1.99, 10.99, 5.99] },
    { rangeValues: [1.99, 1.99] },
  ])('returns an error when the values are not a valid range', async (data) => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue({ ok: true, json: async () => data });
    vi.stubGlobal('fetch', fetchMock);

    expect((await loadRangeValues()).data).toBeNull();
  });

  test('retries when the HTTP response is not successful', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: false, status: 500 });
    vi.stubGlobal('fetch', fetchMock);

    const result = await loadRangeValues();

    expect(result.data).toBeNull();
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  test('returns an error when the request fails', async () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error('Network error'));
    vi.stubGlobal('fetch', fetchMock);

    expect((await loadRangeValues()).data).toBeNull();
  });
});
