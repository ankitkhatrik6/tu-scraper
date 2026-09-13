import { fetchHtml } from '../utils/http';
import { parseTuCentralNotices } from '../utils/parser';
import { Notice, ScrapeOptions } from '../types';

export const TU_URL = 'https://tu.edu.np/notices';
export const TU_BASE_URL = 'https://tu.edu.np';

/**
 * Scraper adapter for the official Tribhuvan University central office (TU) notice portal.
 * URL: https://tu.edu.np/notices
 */
export async function scrapeTu(options?: ScrapeOptions): Promise<Notice[]> {
  const html = options?.htmlFixture || (await fetchHtml(TU_URL, options));
  return parseTuCentralNotices(html, 'tu', TU_BASE_URL);
}