import { fetchHtml } from '../utils/http';
import { parseTuPortalNotices } from '../utils/parser';
import { Notice, ScrapeOptions } from '../types';

export const IOE_URL = 'https://ioe.tu.edu.np/notices';
export const IOE_BASE_URL = 'https://ioe.tu.edu.np';

/**
 * Scraper adapter for Institute of Engineering (IOE)
 * URL: https://ioe.tu.edu.np/notices
 */
export async function scrapeIoe(options?: ScrapeOptions): Promise<Notice[]> {
  const html = options?.htmlFixture || (await fetchHtml(IOE_URL, options));
  return parseTuPortalNotices(html, 'ioe', IOE_BASE_URL);
}
