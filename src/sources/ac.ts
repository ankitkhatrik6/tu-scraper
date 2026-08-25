import { fetchHtml } from '../utils/http';
import { parseTuPortalNotices } from '../utils/parser';
import { Notice, ScrapeOptions } from '../types';

export const AC_URL = 'https://ac.tu.edu.np/notices';
export const AC_BASE_URL = 'https://ac.tu.edu.np';

/**
 * Scraper adapter for Amrit Science Campus (AC)
 * URL: https://ac.tu.edu.np/notices
 */
export async function scrapeAc(options?: ScrapeOptions): Promise<Notice[]> {
  const html = options?.htmlFixture || (await fetchHtml(AC_URL, options));
  return parseTuPortalNotices(html, 'ac', AC_BASE_URL);
}
