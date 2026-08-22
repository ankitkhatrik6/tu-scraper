import { fetchHtml } from '../utils/http';
import { parseTuPortalNotices } from '../utils/parser';
import { Notice, ScrapeOptions } from '../types';

export const IOM_URL = 'https://iom.tu.edu.np/notices';
export const IOM_BASE_URL = 'https://iom.tu.edu.np';

/**
 * Scraper adapter for Institute of Medicine (IOM)
 * URL: https://iom.tu.edu.np/notices
 */
export async function scrapeIom(options?: ScrapeOptions): Promise<Notice[]> {
  const html = options?.htmlFixture || (await fetchHtml(IOM_URL, options));
  return parseTuPortalNotices(html, 'iom', IOM_BASE_URL);
}
