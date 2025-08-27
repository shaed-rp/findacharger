import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchWithRetry, fetchJson, createUrl } from './fetcher';

// Mock fetch globally
global.fetch = vi.fn();

describe('fetcher', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchWithRetry', () => {
    it('should make a successful request on first try', async () => {
      const mockResponse = { ok: true, status: 200 };
      (global.fetch as any).mockResolvedValueOnce(mockResponse);

      const result = await fetchWithRetry('https://api.example.com/test');

      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(result).toBe(mockResponse);
    });

    it('should retry on network errors', async () => {
      const mockResponse = { ok: true, status: 200 };
      (global.fetch as any)
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce(mockResponse);

      const result = await fetchWithRetry('https://api.example.com/test', { retries: 1 });

      expect(global.fetch).toHaveBeenCalledTimes(2);
      expect(result).toBe(mockResponse);
    });

    it('should not retry on 4xx errors', async () => {
      const errorResponse = { ok: false, status: 400, statusText: 'Bad Request' };
      (global.fetch as any).mockResolvedValueOnce(errorResponse);

      await expect(fetchWithRetry('https://api.example.com/test')).rejects.toThrow('HTTP 400: Bad Request');
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it('should retry on 5xx errors', async () => {
      const errorResponse = { ok: false, status: 500, statusText: 'Internal Server Error' };
      const successResponse = { ok: true, status: 200 };
      (global.fetch as any)
        .mockResolvedValueOnce(errorResponse)
        .mockResolvedValueOnce(successResponse);

      const result = await fetchWithRetry('https://api.example.com/test', { retries: 1 });

      expect(global.fetch).toHaveBeenCalledTimes(2);
      expect(result).toBe(successResponse);
    });

    it('should respect timeout', async () => {
      (global.fetch as any).mockImplementation(() => 
        new Promise(resolve => setTimeout(resolve, 100))
      );

      await expect(fetchWithRetry('https://api.example.com/test', { timeout: 50 }))
        .rejects.toThrow();
    });
  });

  describe('fetchJson', () => {
    it('should parse JSON response', async () => {
      const mockData = { test: 'data' };
      const mockResponse = {
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue(mockData),
      };
      (global.fetch as any).mockResolvedValueOnce(mockResponse);

      const result = await fetchJson('https://api.example.com/test');

      expect(result).toEqual(mockData);
      expect(mockResponse.json).toHaveBeenCalled();
    });

    it('should throw error on JSON parse failure', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        json: vi.fn().mockRejectedValue(new Error('Invalid JSON')),
      };
      (global.fetch as any).mockResolvedValueOnce(mockResponse);

      await expect(fetchJson('https://api.example.com/test'))
        .rejects.toThrow('Failed to parse JSON response');
    });
  });

  describe('createUrl', () => {
    it('should create URL with query parameters', () => {
      const baseUrl = 'https://api.example.com/test';
      const params = {
        key: 'value',
        number: 123,
        array: ['a', 'b'],
        empty: '',
        null: null,
        undefined: undefined,
      };

      const result = createUrl(baseUrl, params);

      expect(result).toBe('https://api.example.com/test?key=value&number=123&array=a&array=b');
    });

    it('should handle empty parameters', () => {
      const baseUrl = 'https://api.example.com/test';
      const result = createUrl(baseUrl, {});

      expect(result).toBe('https://api.example.com/test');
    });

    it('should handle URL with existing query parameters', () => {
      const baseUrl = 'https://api.example.com/test?existing=value';
      const params = { new: 'param' };

      const result = createUrl(baseUrl, params);

      expect(result).toBe('https://api.example.com/test?existing=value&new=param');
    });
  });
});
