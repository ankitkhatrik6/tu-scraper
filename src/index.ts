import { globalCache } from './cache';
import { InvalidSourceError, TuScrapperError } from './errors';
import { scrapeFoe, FOE_URL } from './sources/foe';
import { scrapeFohss, FOHSS_URL } from './sources/fohss';
import { scrapeFol, FOL_URL } from './sources/fol';
import { scrapeIaas, IAAS_URL } from './sources/iaas';
import { scrapeIoe, IOE_URL } from './sources/ioe';
import { scrapeIof, IOF_URL } from './sources/iof';
import { scrapeAc, AC_URL } from './sources/ac';
import { scrapeIost, IOST_URL } from './sources/iost';
import { Notice, NoticeAttachment, NoticeDetail, NoticeSource, ScrapeOptions, SourceMeta, SourceQuery } from './types';
import { fetchHtml } from './utils/http';
import { parseNoticeDetail } from './utils/parser';

// Re-export types, errors, cache, and utility helpers
export * from './types';
export * from './errors';
export * from './cache';
export * from './utils/parser';
export * from './utils/http';

/**
 * List of all supported Tribhuvan University notice source identifiers
 */
export const SOURCES: readonly NoticeSource[] = [
  'iost',
  'fohss',
  'ioe',
  'ac',
  'iaas',
  'iof',
  'foe',
  'fol',
] as const;

/**
 * Metadata and registry of supported TU institutions
 */
export const SOURCE_METADATA: Record<NoticeSource, SourceMeta> = {
  iost: {
    id: 'iost',
    code: 'IOST',
    name: 'Institute of Science and Technology',
    nepaliName: 'विज्ञान तथा प्रविधि अध्ययन संस्थान',
    url: IOST_URL,
    baseUrl: 'https://iost.tu.edu.np',
    category: 'Institute',
    location: 'Kirtipur, Kathmandu',
    verified: true,
    notes: 'Official science and technology dean office portal',
  },
  fohss: {
    id: 'fohss',
    code: 'FOHSS',
    name: 'Faculty of Humanities and Social Sciences',
    nepaliName: 'मानविकी तथा सामाजिक शास्त्र संकाय',
    url: FOHSS_URL,
    baseUrl: 'https://fohss.tu.edu.np',
    category: 'Faculty',
    location: 'Balkhu, Kathmandu',
    verified: true,
    notes: 'Official humanities & social sciences notices portal',
  },
  ioe: {
    id: 'ioe',
    code: 'IOE',
    name: 'Institute of Engineering',
    nepaliName: 'इन्जिनियरिङ अध्ययन संस्थान',
    url: IOE_URL,
    baseUrl: 'https://ioe.tu.edu.np',
    category: 'Institute',
    location: 'Pulchowk, Lalitpur',
    verified: true,
    notes: 'Official engineering notices and entrance announcements',
  },
  ac: {
    id: 'ac',
    code: 'AC',
    name: 'Amrit Science Campus',
    nepaliName: 'अमृत साइन्स क्याम्पस',
    url: AC_URL,
    baseUrl: 'https://ac.tu.edu.np',
    category: 'Campus',
    location: 'Lainchaur, Kathmandu',
    verified: true,
    notes: 'Official portal for Amrit Science Campus',
  },
  iaas: {
    id: 'iaas',
    code: 'IAAS',
    name: 'Institute of Agriculture and Animal Science',
    nepaliName: 'कृषि तथा पशु विज्ञान अध्ययन संस्थान',
    url: IAAS_URL,
    baseUrl: 'https://iaas.tu.edu.np',
    category: 'Institute',
    location: 'Kirtipur, Kathmandu',
    verified: true,
    notes: 'Official agricultural and veterinary sciences portal',
  },
  iof: {
    id: 'iof',
    code: 'IOF',
    name: 'Institute of Forestry',
    nepaliName: 'वन विज्ञान अध्ययन संस्थान',
    url: IOF_URL,
    baseUrl: 'https://iof.tu.edu.np',
    category: 'Institute',
    location: 'Kirtipur / Pokhara / Hetauda',
    verified: true,
    notes: 'Official forestry academic & examination notices',
  },
  foe: {
    id: 'foe',
    code: 'FOE',
    name: 'Faculty of Education',
    nepaliName: 'शिक्षा शास्त्र संकाय',
    url: FOE_URL,
    baseUrl: 'https://foe.tu.edu.np',
    category: 'Faculty',
    location: 'Balkhu, Kathmandu',
    verified: true,
    notes: 'Official education faculty & exam notices portal',
  },
  fol: {
    id: 'fol',
    code: 'FOL',
    name: 'Faculty of Law',
    nepaliName: 'कानून संकाय',
    url: FOL_URL,
    baseUrl: 'https://fol.tu.edu.np',
    category: 'Faculty',
    location: 'Balkhu, Kathmandu',
    verified: true,
    notes: 'Official law entrance, LL.B, B.A.LL.B & LL.M notices',
  },
};

/**
 * Mapping of source IDs to scraper functions
 */
const SCRAPER_MAP: Record<NoticeSource, (options?: ScrapeOptions) => Promise<Notice[]>> = {
  iost: scrapeIost,
  fohss: scrapeFohss,
  ioe: scrapeIoe,
  ac: scrapeAc,
  iaas: scrapeIaas,
  iof: scrapeIof,
  foe: scrapeFoe,
  fol: scrapeFol,
};

/**
 * Validates if the given string is a valid TU Notice source identifier (excluding 'all')
 */
export function isNoticeSource(source: string): source is NoticeSource {
  return SOURCES.includes(source as NoticeSource);
}

/**
 * Validates if the given string is a valid TU Notice source identifier or "all"
 */
export function isValidSource(source: string): source is SourceQuery {
  return source === 'all' || SOURCES.includes(source as NoticeSource);
}

/**
 * Clear the internal in-memory cache
 */
export function clearCache(): void {
  globalCache.clear();
}

/**
 * Fetch official Tribhuvan University notices from a specific source or from all 8 sources.
 *
 * @param source "iost" | "fohss" | "ioe" | "ac" | "iaas" | "iof" | "foe" | "fol" | "all"
 * @param options Optional scrape settings (timeout, cache bypass, user-agent)
 * @returns Array of normalized Notice objects
 * @throws {InvalidSourceError} if an unrecognized source is provided
 */
export async function getNotices(source: SourceQuery, options?: ScrapeOptions): Promise<Notice[]> {
  if (!isValidSource(source)) {
    throw new InvalidSourceError(source as string);
  }

  const cacheKey = `notices:${source}`;
  if (!options?.bypassCache && !options?.htmlFixture) {
    const cached = globalCache.get(cacheKey);
    if (cached) {
      return cached;
    }
  }

  // Handle "all" source aggregation
  if (source === 'all') {
    const results = await Promise.allSettled(
      SOURCES.map(async (src) => {
        const scraper = SCRAPER_MAP[src];
        return scraper(options);
      })
    );

    const combinedNotices: Notice[] = [];
    const errors: { source: NoticeSource; error: string }[] = [];

    results.forEach((res, index) => {
      const srcName = SOURCES[index];
      if (res.status === 'fulfilled') {
        combinedNotices.push(...res.value);
      } else {
        const errMessage = res.reason instanceof Error ? res.reason.message : String(res.reason);
        errors.push({ source: srcName, error: errMessage });
      }
    });

    if (!options?.bypassCache && !options?.htmlFixture) {
      globalCache.set(cacheKey, combinedNotices);
    }

    return combinedNotices;
  }

  // Single source scraping
  const scraper = SCRAPER_MAP[source];
  if (!scraper) {
    throw new InvalidSourceError(source);
  }

  const notices = await scraper(options);

  if (!options?.bypassCache && !options?.htmlFixture) {
    globalCache.set(cacheKey, notices);
  }

  return notices;
}

/**
 * Fetch the latest single notice from a source or across all sources.
 * If available, returns enriched detail with scanned images and PDF attachments.
 *
 * @param source "iost" | "fohss" | "ioe" | "ac" | "iaas" | "iof" | "foe" | "fol" | "all"
 * @param options Optional scrape settings
 * @returns The most recent Notice/NoticeDetail or null if no notices exist
 */
export async function getLatest(source: SourceQuery, options?: ScrapeOptions): Promise<Notice | NoticeDetail | null> {
  const notices = await getNotices(source, options);
  if (notices.length === 0) return null;
  const first = notices[0];
  try {
    const detail = await getNoticeDetail(first.url, first.source, options);
    return detail;
  } catch {
    return first;
  }
}

/**
 * Deep-fetches attachments (PDFs, scanned images, documents) for a list of notices in parallel.
 *
 * @param notices List of Notice objects
 * @param options Scrape settings
 * @param maxItems Maximum items to deep-inspect (default 12)
 * @returns Enriched list of notices with images, pdfs, and attachments populated
 */
export async function enrichNoticesWithAttachments(
  notices: Notice[],
  options?: ScrapeOptions,
  maxItems = 12
): Promise<Notice[]> {
  const itemsToEnrich = notices.slice(0, maxItems);
  const remaining = notices.slice(maxItems);

  const enrichedItems = await Promise.all(
    itemsToEnrich.map(async (notice) => {
      if (notice.pdf || notice.image || (notice.attachments && notice.attachments.length > 0)) {
        return notice;
      }
      try {
        const detail = await getNoticeDetail(notice.url, notice.source, options);
        return {
          ...notice,
          ...(detail.date && !notice.date ? { date: detail.date } : {}),
          ...(detail.pdf ? { pdf: detail.pdf } : {}),
          ...(detail.pdfs ? { pdfs: detail.pdfs } : {}),
          ...(detail.image ? { image: detail.image } : {}),
          ...(detail.images ? { images: detail.images } : {}),
          ...(detail.attachments ? { attachments: detail.attachments } : {}),
          ...(detail.content ? { content: detail.content } : {}),
        };
      } catch {
        return notice;
      }
    })
  );

  return [...enrichedItems, ...remaining];
}

/**
 * Search notices by title match across a specified source or all 8 sources.
 *
 * @param query Search keyword (case-insensitive substring match)
 * @param source Optional source identifier (defaults to "all")
 * @param options Optional scrape settings
 * @returns Filtered array of Notice objects matching the query
 */
export async function searchNotices(
  query: string,
  source: SourceQuery = 'all',
  options?: ScrapeOptions
): Promise<Notice[]> {
  if (!query || typeof query !== 'string') {
    return [];
  }

  const notices = await getNotices(source, options);
  const normalizedQuery = query.toLowerCase().trim();

  return notices.filter((notice) => {
    const titleMatch = notice.title.toLowerCase().includes(normalizedQuery);
    const idMatch = notice.id.toLowerCase().includes(normalizedQuery);
    return titleMatch || idMatch;
  });
}

/**
 * Fetch and extract deep details, attachments (PDFs, images, documents), and content for a specific TU notice.
 *
 * @param urlOrId Full notice URL (e.g. "https://iost.tu.edu.np/notices/14690") or notice ID
 * @param source Optional source identifier if urlOrId is just an ID (e.g. "iost")
 * @param options Optional scrape settings
 * @returns NoticeDetail object with content, attachments, pdfs, and image scans
 */
export async function getNoticeDetail(
  urlOrId: string,
  source?: string,
  options?: ScrapeOptions
): Promise<NoticeDetail> {
  let fullUrl = urlOrId.trim();
  let determinedSource: NoticeSource = (source && isNoticeSource(source) ? source : 'iost');

  // If passed just a numeric/alphanumeric ID (not a URL)
  if (!fullUrl.startsWith('http://') && !fullUrl.startsWith('https://')) {
    if (!source || !isNoticeSource(source)) {
      throw new InvalidSourceError(source || 'missing or invalid source');
    }
    const meta = SOURCE_METADATA[source];
    fullUrl = `${meta.baseUrl}/notices/${fullUrl}`;
    determinedSource = source;
  } else {
    // Detect source from URL hostname
    for (const src of SOURCES) {
      if (fullUrl.includes(`${src}.tu.edu.np`)) {
        determinedSource = src;
        break;
      }
    }
  }

  const cacheKey = `detail:${fullUrl}`;
  if (!options?.bypassCache && !options?.htmlFixture) {
    const cached = globalCache.get(cacheKey);
    if (cached) {
      return cached as unknown as NoticeDetail;
    }
  }

  const meta = SOURCE_METADATA[determinedSource] || { baseUrl: 'https://iost.tu.edu.np' };
  const html = options?.htmlFixture || (await fetchHtml(fullUrl, options));
  const detail = parseNoticeDetail(html, fullUrl, determinedSource, meta.baseUrl);

  if (!options?.bypassCache && !options?.htmlFixture) {
    globalCache.set(cacheKey, detail as any);
  }

  return detail;
}

