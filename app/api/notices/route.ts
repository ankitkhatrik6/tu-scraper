import { NextRequest, NextResponse } from 'next/server';
import {
  getNotices,
  getLatest,
  searchNotices,
  getNoticeDetail,
  enrichNoticesWithAttachments,
  isValidSource,
  SourceQuery,
  NoticeSource,
} from '@/src/index';

export async function GET(req: NextRequest) {
  const startTime = Date.now();
  const searchParams = req.nextUrl.searchParams;

  const source = (searchParams.get('source') || 'all') as SourceQuery;
  const query = searchParams.get('query') || '';
  const url = searchParams.get('url') || '';
  const id = searchParams.get('id') || '';
  const action = searchParams.get('action') || 'notices'; // 'notices' | 'latest' | 'search' | 'detail'
  const enrich = searchParams.get('enrich') !== 'false'; // defaults to true for rich real-time UI
  const bypassCache = searchParams.get('bypassCache') === 'true';
  const timeout = parseInt(searchParams.get('timeout') || '12000', 10);

  if (action !== 'detail' && !isValidSource(source)) {
    return NextResponse.json(
      {
        success: false,
        error: `Invalid source "${source}". Allowed values: iost, fohss, ioe, iom, iaas, iof, foe, fol, all`,
      },
      { status: 400 }
    );
  }

  try {
    const options = {
      timeout,
      bypassCache,
    };

    let result: any;

    if (action === 'detail') {
      const targetUrlOrId = url || id;
      if (!targetUrlOrId) {
        return NextResponse.json(
          { success: false, error: 'Missing required "url" or "id" parameter for detail action.' },
          { status: 400 }
        );
      }
      result = await getNoticeDetail(targetUrlOrId, source !== 'all' ? (source as NoticeSource) : undefined, options);
    } else if (action === 'latest') {
      result = await getLatest(source, options);
    } else if (query.trim().length > 0 || action === 'search') {
      const rawNotices = await searchNotices(query, source, options);
      result = enrich ? await enrichNoticesWithAttachments(rawNotices, options, 10) : rawNotices;
    } else {
      const rawNotices = await getNotices(source, options);
      // For real-time notice list, enrich the notices so PDF and scanned image links are directly available
      result = enrich ? await enrichNoticesWithAttachments(rawNotices, options, 15) : rawNotices;
    }

    const durationMs = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      source,
      action,
      query: query || undefined,
      url: url || undefined,
      mode: 'live',
      count: Array.isArray(result) ? result.length : result ? 1 : 0,
      durationMs,
      data: result,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    const durationMs = Date.now() - startTime;
    return NextResponse.json(
      {
        success: false,
        source,
        error: error.message || 'Real-time live scraping failed',
        errorName: error.name || 'TuScrapperError',
        durationMs,
      },
      { status: 500 }
    );
  }
}

