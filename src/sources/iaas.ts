import { fetchHtml } from '../utils/http';
import { parseTuPortalNotices } from '../utils/parser';
import { Notice, ScrapeOptions } from '../types';

export const IAAS_URL = 'https://iaas.tu.edu.np/notices';
export const IAAS_BASE_URL = 'https://iaas.tu.edu.np';

/**
 * Scraper adapter for Institute of Agriculture and Animal Science (IAAS)
 * URL: https://iaas.tu.edu.np/notices
 */
export async function scrapeIaas(options?: ScrapeOptions): Promise<Notice[]> {
  const html = options?.htmlFixture || (await fetchHtml(IAAS_URL, options));
  return parseTuPortalNotices(html, 'iaas', IAAS_BASE_URL);
}
