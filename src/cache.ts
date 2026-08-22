import { Notice } from './types';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

export class MemoryCache<T = any> {
  private cache = new Map<string, CacheEntry<T>>();
  private defaultTtlMs: number;

  constructor(defaultTtlMs = 5 * 60 * 1000) {
    this.defaultTtlMs = defaultTtlMs;
  }

  public get<R = T>(key: string): R | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const isExpired = Date.now() - entry.timestamp > this.defaultTtlMs;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as unknown as R;
  }

  public set(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  public has(key: string): boolean {
    return this.get(key) !== null;
  }

  public clear(): void {
    this.cache.clear();
  }

  public delete(key: string): boolean {
    return this.cache.delete(key);
  }

  public size(): number {
    return this.cache.size;
  }
}

export const globalCache = new MemoryCache<any>();
