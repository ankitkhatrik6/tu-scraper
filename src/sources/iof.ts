import { fetchHtml } from '../utils/http';
import { parseTuPortalNotices } from '../utils/parser';
import { Notice, ScrapeOptions } from '../types';

export const IOF_URL = 'https://iof.tu.edu.np/notices';
export const IOF_BASE_URL = 'https://iof.tu.edu.np';

/**
 * Scraper adapter for Institute of Forestry (IOF)
 * URL: https://iof.tu.edu.np/notices
 */
export async function scrapeIof(options?: ScrapeOptions): Promise<Notice[]> {
  const html = options?.htmlFixture || (await fetchHtml(IOF_URL, options));
  return parseTuPortalNotices(html, 'iof', IOF_BASE_URL);
}
