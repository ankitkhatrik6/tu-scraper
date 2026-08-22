import { fetchHtml } from '../utils/http';
import { parseTuPortalNotices } from '../utils/parser';
import { Notice, ScrapeOptions } from '../types';

export const FOL_URL = 'https://fol.tu.edu.np/notices';
export const FOL_BASE_URL = 'https://fol.tu.edu.np';

/**
 * Scraper adapter for Faculty of Law (FOL)
 * URL: https://fol.tu.edu.np/notices
 */
export async function scrapeFol(options?: ScrapeOptions): Promise<Notice[]> {
  const html = options?.htmlFixture || (await fetchHtml(FOL_URL, options));
  return parseTuPortalNotices(html, 'fol', FOL_BASE_URL);
}
