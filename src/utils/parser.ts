import * as cheerio from 'cheerio';
import { Notice, NoticeAttachment, NoticeDetail, NoticeSource } from '../types';

/**
 * Clean up text content, removing excessive whitespace, tabs, and newlines
 */
export function cleanText(text?: string | null): string {
  if (!text) return '';
  return text.replace(/\s+/g, ' ').trim();
}

/**
 * Resolve relative or protocol-relative URLs against a base origin
 */
export function resolveUrl(href: string | undefined | null, baseUrl: string): string {
  if (!href) return '';
  const trimmed = href.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  try {
    const base = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
    return new URL(trimmed, base).toString();
  } catch {
    return trimmed;
  }
}

/**
 * Extract an ID from a notice link URL (e.g., https://iost.tu.edu.np/notices/14690 -> "14690")
 */
export function extractNoticeId(url: string, fallbackIdx = 0): string {
  const match = url.match(/\/notices?\/([0-9a-zA-Z_-]+)/i);
  if (match && match[1]) {
    return match[1];
  }
  const lastSegment = url.split('/').filter(Boolean).pop();
  if (lastSegment && lastSegment !== 'notices' && lastSegment !== 'notice') {
    return lastSegment;
  }
  return `notice-${fallbackIdx}`;
}

/**
 * Helper to determine if a URL points to a UI icon/template asset or irrelevant non-notice media
 * (e.g. logos, affiliated colleges banners, officer portraits, social icons)
 */
export function isIrrelevantAsset(url: string): boolean {
  if (!url) return true;
  const lower = url.toLowerCase();

  // 1. Logos and Brand Identity
  if (
    lower.includes('logo') ||
    lower.includes('tulogo') ||
    lower.includes('favicon') ||
    lower.includes('apple-touch-icon') ||
    lower.includes('safari-pinned-tab') ||
    lower.includes('site.webmanifest')
  ) {
    return true;
  }

  // 2. Affiliated Colleges / Promotional Banners / Campus Maps / Footer widgets
  if (
    lower.includes('affiliated') ||
    lower.includes('affiliatedcolleges') ||
    (lower.includes('colleges') && (lower.includes('.jpg') || lower.includes('.png'))) ||
    lower.includes('banner') ||
    lower.includes('slider') ||
    lower.includes('carousel') ||
    lower.includes('hero-bg') ||
    lower.includes('background')
  ) {
    return true;
  }

  // 3. Information Officers, Deans, Staff, and Personal Portraits
  if (
    lower.includes('officer') ||
    lower.includes('dean') ||
    lower.includes('director') ||
    lower.includes('chancellor') ||
    lower.includes('profile') ||
    lower.includes('avatar') ||
    lower.includes('staff') ||
    lower.includes('member')
  ) {
    return true;
  }

  // 4. UI Icons, Buttons, Social Media, Calendar, Flags, QR Codes
  if (
    lower.includes('calendar.png') ||
    lower.includes('not.png') ||
    lower.includes('facebook') ||
    lower.includes('twitter') ||
    lower.includes('linkedin') ||
    lower.includes('youtube') ||
    lower.includes('instagram') ||
    lower.includes('social') ||
    lower.includes('flag') ||
    lower.includes('qr_code') ||
    lower.includes('qrcode') ||
    lower.includes('barcode') ||
    lower.includes('spinner') ||
    lower.includes('loading') ||
    lower.includes('back-to-top') ||
    lower.includes('placeholder')
  ) {
    return true;
  }

  // 5. Template & Theme Assets
  if (
    lower.includes('/assets/temp1/') ||
    lower.includes('/assets/temp2/') ||
    lower.includes('/assets/theme/') ||
    lower.includes('/assets/img/') ||
    lower.includes('/assets/images/') ||
    lower.includes('bootstrap') ||
    lower.includes('fullcalendar') ||
    lower.includes('font-awesome') ||
    lower.includes('jquery')
  ) {
    return true;
  }

  // 6. Generic portal site-level media assets (TU CMS stores site icons/banners in /medias/)
  if (
    lower.includes('/medias/') &&
    (lower.includes('logo') ||
      lower.includes('affiliated') ||
      lower.includes('tulogo') ||
      lower.includes('icon') ||
      lower.includes('banner') ||
      lower.includes('temp') ||
      lower.includes('img'))
  ) {
    return true;
  }

  return false;
}

/**
 * Backward compatibility alias for isIrrelevantAsset
 */
export function isUiAsset(url: string): boolean {
  return isIrrelevantAsset(url);
}

/**
 * Helper to determine if a URL or filename is an image scan/photo
 */
export function isImageUrl(url: string): boolean {
  if (isIrrelevantAsset(url)) return false;
  const lower = url.toLowerCase();
  return (
    lower.endsWith('.jpeg') ||
    lower.endsWith('.jpg') ||
    lower.endsWith('.png') ||
    lower.endsWith('.webp') ||
    lower.endsWith('.gif') ||
    lower.endsWith('.bmp') ||
    /\.(jpe?g|png|webp|gif|bmp)(\?.*)?$/i.test(lower) ||
    (lower.includes('portal.tu.edu.np/notice/') && /\.(jpe?g|png|webp)/i.test(lower))
  );
}

/**
 * Helper to determine if a URL is a PDF document
 */
export function isPdfUrl(url: string): boolean {
  if (isIrrelevantAsset(url)) return false;
  const lower = url.toLowerCase();
  return (
    lower.endsWith('.pdf') ||
    /\.pdf(\?.*)?$/i.test(lower) ||
    (lower.includes('/downloads/') && lower.includes('.pdf')) ||
    (lower.includes('portal.tu.edu.np/notice/') && lower.includes('.pdf'))
  );
}

/**
 * Extract filename from a URL
 */
export function extractFilename(url: string): string {
  try {
    const cleanUrl = url.split('?')[0].split('#')[0];
    const segment = cleanUrl.split('/').filter(Boolean).pop();
    return segment || 'attachment';
  } catch {
    return 'attachment';
  }
}

/**
 * Extract date string from container element if present
 */
export function extractDate($el: cheerio.Cheerio<any>): string | undefined {
  // Check for nep_date span or standard date containers
  const nepDate = cleanText($el.find('.nep_date, .date-nepali, .date-eng').first().text());
  if (nepDate && nepDate.length >= 8) {
    return nepDate;
  }

  const dateEl = cleanText($el.find('.date, .notice-date, time, small.text-muted, .created-at, .published-date').first().text());
  if (dateEl && dateEl.length >= 8) {
    return dateEl;
  }

  // Regex match for YYYY-MM-DD or YYYY/MM/DD or DD-MM-YYYY in element text
  const rawText = $el.text();
  const dateMatch = rawText.match(/\b(20\d{2}[-/.]\d{1,2}[-/.]\d{1,2})\b/);
  if (dateMatch) {
    return dateMatch[1];
  }

  return undefined;
}

/**
 * Extract PDF link from container if directly available
 */
export function extractPdf($el: cheerio.Cheerio<any>, baseUrl: string): string | undefined {
  const pdfLink = $el.find('a[href*=".pdf"], a[href*="/downloads/"], a[download*=".pdf"]').first().attr('href');
  if (pdfLink) {
    return resolveUrl(pdfLink, baseUrl);
  }
  return undefined;
}

/**
 * Extract all attachments (PDFs, images, documents) from a Cheerio container or document
 */
export function extractAttachments(
  $container: cheerio.Cheerio<any>,
  baseUrl: string,
  $doc?: cheerio.CheerioAPI
): NoticeAttachment[] {
  const attachments: NoticeAttachment[] = [];
  const seenUrls = new Set<string>();
  const $ = $doc || cheerio.load($container.html() || '');

  // Strategy 1: Table-based download wrapper (.download-wrapper, .inner-downloads, table)
  $container.find('.download-wrapper table tbody tr, .inner-downloads table tbody tr, table.table-hover tbody tr, .table tbody tr').each((_, el) => {
    const $tr = $(el);
    // Ignore header rows
    if ($tr.find('th').length > 0 && $tr.find('td').length === 0) return;

    const tds = $tr.find('td');
    if (tds.length >= 2) {
      const name = cleanText(tds.eq(0).text()) || cleanText(tds.eq(1).text());
      const typeStr = cleanText(tds.eq(1).text()) || cleanText(tds.eq(2).text());
      const $a = $tr.find('a[href]').first();
      const href = $a.attr('href') || $tr.find('a').attr('href');
      if (href) {
        const fullUrl = resolveUrl(href, baseUrl);
        if (!seenUrls.has(fullUrl) && !isIrrelevantAsset(fullUrl)) {
          seenUrls.add(fullUrl);
          const ext = typeStr.toLowerCase() || extractFilename(fullUrl).split('.').pop()?.toLowerCase() || 'unknown';
          let type: NoticeAttachment['type'] = 'link';
          if (ext.includes('pdf') || isPdfUrl(fullUrl)) type = 'pdf';
          else if (ext.includes('jp') || ext.includes('png') || ext.includes('image') || isImageUrl(fullUrl)) type = 'image';
          else if (ext.includes('doc')) type = 'doc';

          attachments.push({
            type,
            url: fullUrl,
            filename: extractFilename(fullUrl),
            title: name || undefined,
            fileType: ext,
          });
        }
      }
    }
  });

  // Strategy 2: Direct download anchors within notice content
  $container
    .find('.inner-downloads a[href], .download-wrapper a[href], .ck-table a[href], .detail-content a[href], .notice-content a[href], .post-content a[href], article a[href], a[download], a[href*="portal.tu.edu.np/notice/"], a[href*="/downloads/"]')
    .each((_, el) => {
      const $a = $(el);
      // Skip if inside non-notice containers
      if ($a.closest('header, nav, footer, aside, .sidebar, .info-officer, .f-links, .navbar, .social-media-icons, .widget, .card-title, .foter-bottom').length > 0) {
        return;
      }

      const href = $a.attr('href');
      if (!href) return;

      const fullUrl = resolveUrl(href, baseUrl);
      if (seenUrls.has(fullUrl) || isIrrelevantAsset(fullUrl)) return;

      const linkText = cleanText($a.text());
      const isDownload = $a.attr('download') !== undefined;
      const isPortalNoticeMedia = fullUrl.includes('portal.tu.edu.np/notice/');

      if (isPdfUrl(fullUrl)) {
        seenUrls.add(fullUrl);
        attachments.push({
          type: 'pdf',
          url: fullUrl,
          filename: extractFilename(fullUrl),
          title: linkText || undefined,
          fileType: 'pdf',
        });
      } else if (isImageUrl(fullUrl) || (isPortalNoticeMedia && /\.(jpe?g|png|webp)/i.test(fullUrl))) {
        seenUrls.add(fullUrl);
        const ext = fullUrl.split('.').pop()?.toLowerCase() || 'jpeg';
        attachments.push({
          type: 'image',
          url: fullUrl,
          filename: extractFilename(fullUrl),
          title: linkText || undefined,
          fileType: ext,
        });
      } else if (isDownload || isPortalNoticeMedia) {
        seenUrls.add(fullUrl);
        attachments.push({
          type: 'link',
          url: fullUrl,
          filename: extractFilename(fullUrl),
          title: linkText || undefined,
        });
      }
    });

  // Strategy 3: Scanned notice images embedded in content body
  $container
    .find('.ck-table img, .detail-content img, .post-content img, .notice-content img, .notice-detail img, .inner-downloads img, article img, .download-wrapper img, .detail-page-inner img')
    .each((_, el) => {
      const $img = $(el);
      // Skip if inside non-notice containers (header, footer, sidebar, info officer, navbar)
      if ($img.closest('header, nav, footer, aside, .sidebar, .info-officer, .f-links, .navbar, .widget, .foter-bottom').length > 0) {
        return;
      }

      const src = $img.attr('src') || $img.attr('data-src');
      if (!src) return;

      const fullUrl = resolveUrl(src, baseUrl);
      if (!seenUrls.has(fullUrl) && !isIrrelevantAsset(fullUrl) && isImageUrl(fullUrl)) {
        seenUrls.add(fullUrl);
        const ext = fullUrl.split('.').pop()?.toLowerCase() || 'jpeg';
        attachments.push({
          type: 'image',
          url: fullUrl,
          filename: extractFilename(fullUrl),
          title: $img.attr('alt') ? cleanText($img.attr('alt')) : undefined,
          fileType: ext,
        });
      }
    });

  return attachments;
}

/**
 * Universal parser for TU portal structures (Bootstrap + temp2.css / Young Minds CMS)
 */
export function parseTuPortalNotices(
  html: string,
  source: NoticeSource,
  baseUrl: string
): Notice[] {
  const $ = cheerio.load(html);
  const notices: Notice[] = [];
  const seenUrls = new Set<string>();

  // Strategy 1: Look for .recent-post-wrapper elements (the main notice cards in temp2.css)
  $('.recent-post-wrapper').each((i, el) => {
    const $item = $(el);
    const $link = $item.find('.detail a, a').first();
    const href = $link.attr('href');
    if (!href) return;

    const fullUrl = resolveUrl(href, baseUrl);
    const title = cleanText($item.find('h5, h4, h6, .detail').first().text()) || cleanText($link.text());

    if (!title || title.toLowerCase() === 'notices' || title.toLowerCase() === 'info') return;

    const date = extractDate($item);
    const attachments = extractAttachments($item, baseUrl, $);
    const pdfs = attachments.filter((a) => a.type === 'pdf').map((a) => a.url);
    const directPdf = extractPdf($item, baseUrl);
    if (directPdf && !pdfs.includes(directPdf)) {
      pdfs.unshift(directPdf);
    }
    const images = attachments.filter((a) => a.type === 'image').map((a) => a.url);
    const id = extractNoticeId(fullUrl, i + 1);

    if (!seenUrls.has(fullUrl)) {
      seenUrls.add(fullUrl);
      notices.push({
        id,
        title,
        source,
        ...(date ? { date } : {}),
        url: fullUrl,
        ...(pdfs.length > 0 ? { pdf: pdfs[0], pdfs } : {}),
        ...(images.length > 0 ? { image: images[0], images } : {}),
        ...(attachments.length > 0 ? { attachments } : {}),
      });
    }
  });

  // Strategy 2: Look for table rows if table-based layout is used
  if (notices.length === 0) {
    $('table tbody tr, table tr').each((i, el) => {
      const $row = $(el);
      const $link = $row.find('a[href*="/notices/"], a').first();
      const href = $link.attr('href');
      if (!href) return;

      const fullUrl = resolveUrl(href, baseUrl);
      const title = cleanText($link.text()) || cleanText($row.find('td').eq(1).text());

      if (!title || title.toLowerCase() === 'notices') return;

      const date = extractDate($row);
      const attachments = extractAttachments($row, baseUrl, $);
      const pdfs = attachments.filter((a) => a.type === 'pdf').map((a) => a.url);
      const directPdf = extractPdf($row, baseUrl);
      if (directPdf && !pdfs.includes(directPdf)) {
        pdfs.unshift(directPdf);
      }
      const images = attachments.filter((a) => a.type === 'image').map((a) => a.url);
      const id = extractNoticeId(fullUrl, i + 1);

      if (!seenUrls.has(fullUrl)) {
        seenUrls.add(fullUrl);
        notices.push({
          id,
          title,
          source,
          ...(date ? { date } : {}),
          url: fullUrl,
          ...(pdfs.length > 0 ? { pdf: pdfs[0], pdfs } : {}),
          ...(images.length > 0 ? { image: images[0], images } : {}),
          ...(attachments.length > 0 ? { attachments } : {}),
        });
      }
    });
  }

  // Strategy 3: Look for any content notice links matching /notices/<id>
  if (notices.length === 0) {
    $('a[href*="/notices/"]').each((i, el) => {
      const $link = $(el);
      const href = $link.attr('href');
      if (!href || href === '/notices' || href.endsWith('/notices/')) return;

      const fullUrl = resolveUrl(href, baseUrl);
      let title = cleanText($link.find('h5, h4, h6').first().text()) || cleanText($link.text());

      if (!title || title.length < 3 || title.toLowerCase() === 'notices' || title.toLowerCase() === 'info') return;

      const container = $link.closest('li, .card, .item, div.row > div, .border');
      const date = container.length ? extractDate(container) : undefined;
      const attachments = container.length ? extractAttachments(container, baseUrl, $) : [];
      const pdfs = attachments.filter((a) => a.type === 'pdf').map((a) => a.url);
      const directPdf = container.length ? extractPdf(container, baseUrl) : undefined;
      if (directPdf && !pdfs.includes(directPdf)) {
        pdfs.unshift(directPdf);
      }
      const images = attachments.filter((a) => a.type === 'image').map((a) => a.url);
      const id = extractNoticeId(fullUrl, i + 1);

      if (!seenUrls.has(fullUrl)) {
        seenUrls.add(fullUrl);
        notices.push({
          id,
          title,
          source,
          ...(date ? { date } : {}),
          url: fullUrl,
          ...(pdfs.length > 0 ? { pdf: pdfs[0], pdfs } : {}),
          ...(images.length > 0 ? { image: images[0], images } : {}),
          ...(attachments.length > 0 ? { attachments } : {}),
        });
      }
    });
  }

  return notices;
}

/**
 * Deep parse an individual TU notice detail page HTML
 */
export function parseNoticeDetail(
  html: string,
  url: string,
  source: NoticeSource,
  baseUrl: string
): NoticeDetail {
  const $ = cheerio.load(html);
  const id = extractNoticeId(url);

  // Extract Title from heading, breadcrumbs, or page title
  const title =
    cleanText($('h4.title, .notice-title, .section-title h3, h3.title, .detail h5, .card-title, h2, h3, h4').first().text()) ||
    cleanText($('title').text().replace(/[-|].*$/, '')) ||
    'Tribhuvan University Notice';

  // Extract Dates
  const nepaliDate = cleanText($('.nep_date, .date-nepali').first().text()) || undefined;
  const englishDate = cleanText($('.date-eng, .english-date').first().text()) || undefined;
  const generalDate = nepaliDate || englishDate || extractDate($('body'));

  // Extract body content
  const content =
    cleanText($('.ck-table, .detail-content, .post-content, .notice-content, .inner-downloads, .detail-page-inner').first().text()) ||
    undefined;

  // Clone document and strip site chrome (header, footer, nav, sidebar, info-officer, widgets)
  const $contentDoc = cheerio.load(html);
  $contentDoc('header, nav, footer, aside, .sidebar, .right-sidebar, .left-sidebar, .widget, .widget-area, .quick-links, .affiliated-colleges, .slider, .carousel, .navbar, .top-header, .main-header, .footer-wrapper, .site-header, .info-officer, .f-links, #header, #footer, #sidebar, #nav, .scroll-news, .back-to-top, .social-media-icons, .foter-bottom').remove();

  // Find notice container
  const $mainContent = $contentDoc('.detail-page-inner, .detail-page, .detail-content, .notice-detail, .post-content, .notice-content, .inner-downloads, .download-wrapper, article, main').first();
  const $targetContainer = $mainContent.length > 0 ? $mainContent : $contentDoc('body');

  // Extract attachments (tables, download buttons, portal image scans, PDFs)
  const attachments = extractAttachments($targetContainer, baseUrl, $contentDoc);
  const pdfs = attachments.filter((a) => a.type === 'pdf').map((a) => a.url);
  const directPdf = extractPdf($targetContainer, baseUrl);
  if (directPdf && !pdfs.includes(directPdf) && !isIrrelevantAsset(directPdf)) {
    pdfs.unshift(directPdf);
  }
  const images = attachments.filter((a) => a.type === 'image').map((a) => a.url);

  return {
    id,
    title,
    source,
    url,
    ...(generalDate ? { date: generalDate } : {}),
    ...(nepaliDate ? { nepaliDate } : {}),
    ...(englishDate ? { englishDate } : {}),
    ...(content ? { content } : {}),
    ...(pdfs.length > 0 ? { pdf: pdfs[0], pdfs } : {}),
    ...(images.length > 0 ? { image: images[0], images } : {}),
    ...(attachments.length > 0 ? { attachments } : {}),
  };
}

