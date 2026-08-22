import { NetworkError, TimeoutError } from '../errors';
import { ScrapeOptions } from '../types';

const DEFAULT_TIMEOUT = 10000;
const DEFAULT_USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 (TU-Scraper/1.0.0; +https://github.com/ankitkhatrik6/tu-scraper)';

/**
 * Robust HTTP GET fetcher with timeout and descriptive error mapping
 */
export async function fetchHtml(url: string, options?: ScrapeOptions): Promise<string> {
  const timeoutMs = options?.timeout ?? DEFAULT_TIMEOUT;
  const userAgent = options?.userAgent ?? DEFAULT_USER_AGENT;

  let controller: AbortController | null = null;
  let timeoutId: NodeJS.Timeout | null = null;

  try {
    controller = new AbortController();
    timeoutId = setTimeout(() => {
      controller?.abort();
    }, timeoutMs);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': userAgent,
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9,ne;q=0.8',
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
      },
      signal: controller.signal,
    });

    if (timeoutId) clearTimeout(timeoutId);

    if (!response.ok) {
      throw new NetworkError(url, `Received status code ${response.status} (${response.statusText})`, response.status);
    }

    const html = await response.text();
    return html;
  } catch (error: unknown) {
    if (timeoutId) clearTimeout(timeoutId);

    if (error instanceof NetworkError || error instanceof TimeoutError) {
      throw error;
    }

    const err = error as Error;
    if (err.name === 'AbortError' || err.message?.includes('aborted') || err.message?.includes('timeout')) {
      throw new TimeoutError(url, timeoutMs);
    }

    throw new NetworkError(url, err.message || 'Unknown network error', undefined, err);
  }
}
