import { fetchHtml } from '../utils/http';
import { parseTuPortalNotices } from '../utils/parser';
import { Notice, ScrapeOptions } from '../types';

export const FOHSS_URL = 'https://fohss.tu.edu.np/notices';
export const FOHSS_BASE_URL = 'https://fohss.tu.edu.np';

/**
 * Scraper adapter for Faculty of Humanities and Social Sciences (FOHSS)
 * URL: https://fohss.tu.edu.np/notices
 */
export async function scrapeFohss(options?: ScrapeOptions): Promise<Notice[]> {
  const html = options?.htmlFixture || (await fetchHtml(FOHSS_URL, options));
  return parseTuPortalNotices(html, 'fohss', FOHSS_BASE_URL);
}
