import { fetchHtml } from '../utils/http';
import { parseTuPortalNotices } from '../utils/parser';
import { Notice, ScrapeOptions } from '../types';

export const IOST_URL = 'https://iost.tu.edu.np/notices';
export const IOST_BASE_URL = 'https://iost.tu.edu.np';

/**
 * Scraper adapter for Institute of Science and Technology (IOST)
 * URL: https://iost.tu.edu.np/notices
 */
export async function scrapeIost(options?: ScrapeOptions): Promise<Notice[]> {
  const html = options?.htmlFixture || (await fetchHtml(IOST_URL, options));
  return parseTuPortalNotices(html, 'iost', IOST_BASE_URL);
}
