import { fetchHtml } from '../utils/http';
import { parseTuPortalNotices } from '../utils/parser';
import { Notice, ScrapeOptions } from '../types';

export const FOE_URL = 'https://foe.tu.edu.np/notices';
export const FOE_BASE_URL = 'https://foe.tu.edu.np';

/**
 * Scraper adapter for Faculty of Education (FOE)
 * URL: https://foe.tu.edu.np/notices
 */
export async function scrapeFoe(options?: ScrapeOptions): Promise<Notice[]> {
  const html = options?.htmlFixture || (await fetchHtml(FOE_URL, options));
  return parseTuPortalNotices(html, 'foe', FOE_BASE_URL);
}
