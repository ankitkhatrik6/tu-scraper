'use client';
/* eslint-disable @next/next/no-img-element */

import React, { useState, useEffect } from 'react';
import {
  Play,
  Search,
  RefreshCw,
  Copy,
  Check,
  ExternalLink,
  FileText,
  Clock,
  Code2,
  Table as TableIcon,
  LayoutGrid,
  AlertCircle,
  Download,
  Filter,
  Image as ImageIcon,
  X,
  Maximize2,
  Paperclip,
} from 'lucide-react';
import { Notice, NoticeDetail, NoticeSource, SourceQuery, NoticeAttachment } from '@/src/types';
import { isIrrelevantAsset } from '@/src/utils/parser';

interface PlaygroundProps {
  darkMode: boolean;
  initialSource?: SourceQuery;
}

const SOURCE_OPTIONS: { id: SourceQuery; name: string; category: string }[] = [
  { id: 'all', name: 'All 8 Sources Combined', category: 'Aggregation' },
  { id: 'iost', name: 'IOST - Institute of Science and Technology', category: 'Institute' },
  { id: 'fohss', name: 'FOHSS - Faculty of Humanities & Social Sciences', category: 'Faculty' },
  { id: 'ioe', name: 'IOE - Institute of Engineering', category: 'Institute' },
  { id: 'iom', name: 'IOM - Institute of Medicine', category: 'Institute' },
  { id: 'iaas', name: 'IAAS - Institute of Agriculture & Animal Science', category: 'Institute' },
  { id: 'iof', name: 'IOF - Institute of Forestry', category: 'Institute' },
  { id: 'foe', name: 'FOE - Faculty of Education', category: 'Faculty' },
  { id: 'fol', name: 'FOL - Faculty of Law', category: 'Faculty' },
];

function isImageUrl(url?: string): boolean {
  if (!url || isIrrelevantAsset(url)) return false;
  return /\.(jpe?g|png|webp|gif|bmp|svg)($|\?)/i.test(url) || url.includes('/uploads/images/') || url.includes('/storage/images/');
}

function isPdfUrl(url?: string): boolean {
  if (!url || isIrrelevantAsset(url)) return false;
  return /\.pdf($|\?)/i.test(url) || url.includes('/download/pdf') || url.includes('/pdf/');
}

export function hasNoticePdf(notice: Notice): boolean {
  if (notice.pdf) return true;
  if (notice.pdfs && notice.pdfs.length > 0) return true;
  if (notice.attachments && notice.attachments.some((a) => a.type === 'pdf' || isPdfUrl(a.url) || (a.fileType && a.fileType.toLowerCase().includes('pdf')))) {
    return true;
  }
  if (isPdfUrl(notice.url)) return true;
  return false;
}

export function hasNoticeImage(notice: Notice): boolean {
  if (notice.image) return true;
  if (notice.images && notice.images.length > 0) return true;
  if (
    notice.attachments &&
    notice.attachments.some((a) => a.type === 'image' || isImageUrl(a.url) || (a.fileType && /\.(jpe?g|png|webp)/i.test(a.fileType)))
  ) {
    return true;
  }
  if (isImageUrl(notice.url)) return true;
  return false;
}

export function hasAnyNoticeAttachment(notice: Notice): boolean {
  return hasNoticePdf(notice) || hasNoticeImage(notice) || Boolean(notice.attachments && notice.attachments.length > 0);
}

export function getNoticePrimaryPdf(notice: Notice): string | undefined {
  if (notice.pdf) return notice.pdf;
  if (notice.pdfs && notice.pdfs.length > 0) return notice.pdfs[0];
  const attPdf = notice.attachments?.find(
    (a) => a.type === 'pdf' || isPdfUrl(a.url) || (a.fileType && a.fileType.toLowerCase().includes('pdf'))
  );
  return attPdf?.url;
}

export function getNoticePrimaryImage(notice: Notice): string | undefined {
  if (notice.image) return notice.image;
  if (notice.images && notice.images.length > 0) return notice.images[0];
  const attImg = notice.attachments?.find(
    (a) => a.type === 'image' || isImageUrl(a.url) || (a.fileType && /\.(jpe?g|png|webp)/i.test(a.fileType))
  );
  return attImg?.url;
}

export function getNoticeAllAttachments(notice: Notice): NoticeAttachment[] {
  const map = new Map<string, NoticeAttachment>();

  (notice.attachments || []).forEach((att) => {
    if (att.url) map.set(att.url, att);
  });

  if (notice.pdf && !map.has(notice.pdf)) {
    map.set(notice.pdf, {
      type: 'pdf',
      url: notice.pdf,
      filename: notice.pdf.split('/').pop()?.split('?')[0] || 'document.pdf',
      fileType: 'pdf',
    });
  }

  if (notice.pdfs) {
    notice.pdfs.forEach((p) => {
      if (p && !map.has(p)) {
        map.set(p, {
          type: 'pdf',
          url: p,
          filename: p.split('/').pop()?.split('?')[0] || 'document.pdf',
          fileType: 'pdf',
        });
      }
    });
  }

  if (notice.image && !map.has(notice.image)) {
    map.set(notice.image, {
      type: 'image',
      url: notice.image,
      filename: notice.image.split('/').pop()?.split('?')[0] || 'notice-scan.jpeg',
      fileType: 'image',
    });
  }

  if (notice.images) {
    notice.images.forEach((img) => {
      if (img && !map.has(img)) {
        map.set(img, {
          type: 'image',
          url: img,
          filename: img.split('/').pop()?.split('?')[0] || 'notice-scan.jpeg',
          fileType: 'image',
        });
      }
    });
  }

  return Array.from(map.values());
}

export function Playground({ darkMode, initialSource = 'iost' }: PlaygroundProps) {
  const [source, setSource] = useState<SourceQuery>(initialSource);
  const [action, setAction] = useState<'notices' | 'latest' | 'search' | 'detail'>('notices');
  const [query, setQuery] = useState('');
  const [detailUrl, setDetailUrl] = useState('https://iost.tu.edu.np/notices/14690');
  const [bypassCache, setBypassCache] = useState(false);
  const [timeoutMs, setTimeoutMs] = useState(12000);

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Notice[]>([]);
  const [latestSingle, setLatestSingle] = useState<Notice | null>(null);
  const [detailResult, setDetailResult] = useState<NoticeDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [errorName, setErrorName] = useState<string | null>(null);
  const [durationMs, setDurationMs] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'cards' | 'table' | 'json'>('cards');
  const [copiedJson, setCopiedJson] = useState(false);
  const [attachmentFilter, setAttachmentFilter] = useState<'all' | 'pdf' | 'image' | 'any'>('all');

  // Modal inspector state
  const [selectedNotice, setSelectedNotice] = useState<Notice | NoticeDetail | null>(null);
  const [inspectLoading, setInspectLoading] = useState(false);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  const executeScrape = async () => {
    setLoading(true);
    setError(null);
    setErrorName(null);
    const start = Date.now();

    try {
      const params = new URLSearchParams({
        source,
        action,
        bypassCache: String(bypassCache),
        timeout: String(timeoutMs),
        enrich: 'true',
      });

      if (query.trim() && action === 'search') {
        params.set('query', query.trim());
      }

      if (action === 'detail') {
        params.set('url', detailUrl.trim());
      }

      const res = await fetch(`/api/notices?${params.toString()}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || 'Failed to fetch real-time notices');
        setErrorName(data.errorName || 'TuScrapperError');
        setResults([]);
        setLatestSingle(null);
        setDetailResult(null);
      } else {
        if (action === 'latest') {
          setLatestSingle(data.data);
          setResults(data.data ? [data.data] : []);
          setDetailResult(null);
        } else if (action === 'detail') {
          setDetailResult(data.data);
          setLatestSingle(null);
          setResults(data.data ? [data.data] : []);
        } else {
          setResults(Array.isArray(data.data) ? data.data : []);
          setLatestSingle(null);
          setDetailResult(null);
        }
      }
      setDurationMs(data.durationMs ?? Date.now() - start);
    } catch (err: any) {
      setError(err.message || 'Network request error');
      setErrorName('NetworkError');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const inspectNotice = async (notice: Notice) => {
    setSelectedNotice(notice);
    setInspectLoading(true);
    try {
      const res = await fetch(
        `/api/notices?action=detail&url=${encodeURIComponent(notice.url)}&source=${notice.source}`
      );
      const data = await res.json();
      if (data.success && data.data) {
        const enrichedNotice = { ...data.data, title: notice.title || data.data.title };
        setSelectedNotice(enrichedNotice);
        // Also enrich this notice in the results list so PDF and image indicators update
        setResults((prev) =>
          prev.map((item) =>
            item.url === notice.url || (item.id === notice.id && item.source === notice.source)
              ? { ...item, ...enrichedNotice, title: item.title }
              : item
          )
        );
      }
    } catch (err) {
      console.error('Failed to load notice detail', err);
    } finally {
      setInspectLoading(false);
    }
  };

  const deepScanAllNotices = async () => {
    if (results.length === 0 || inspectLoading) return;
    setInspectLoading(true);
    try {
      const updated = await Promise.all(
        results.slice(0, 15).map(async (n) => {
          if (n.pdf || n.image || (n.attachments && n.attachments.length > 0)) {
            return n;
          }
          try {
            const res = await fetch(
              `/api/notices?action=detail&url=${encodeURIComponent(n.url)}&source=${n.source}`
            );
            const data = await res.json();
            if (data.success && data.data) {
              return { ...n, ...data.data };
            }
          } catch {}
          return n;
        })
      );
      setResults((prev) => [...updated, ...prev.slice(15)]);
    } finally {
      setInspectLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const fetchInitial = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/notices?source=${source}&action=notices&bypassCache=false&timeout=12000&enrich=true`);
        const data = await res.json();
        if (isMounted) {
          if (data.success && Array.isArray(data.data)) {
            setResults(data.data);
            setDurationMs(data.durationMs || 150);
          } else {
            setError(data.error || 'Failed to fetch notices');
          }
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || 'Fetch failed');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    if (action === 'notices') {
      fetchInitial();
    }
    return () => {
      isMounted = false;
    };
  }, [source, action]);

  const copyJson = () => {
    const payload = action === 'latest' ? latestSingle : action === 'detail' ? detailResult : results;
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  const getSourceBadgeColor = (src: NoticeSource) => {
    switch (src) {
      case 'iost':
        return darkMode ? 'bg-blue-900/40 text-blue-300 border-blue-700/50' : 'bg-blue-50 text-blue-700 border-blue-200';
      case 'ioe':
        return darkMode ? 'bg-orange-900/40 text-orange-300 border-orange-700/50' : 'bg-orange-50 text-orange-700 border-orange-200';
      case 'iom':
        return darkMode ? 'bg-red-900/40 text-red-300 border-red-700/50' : 'bg-red-50 text-red-700 border-red-200';
      case 'fohss':
        return darkMode ? 'bg-purple-900/40 text-purple-300 border-purple-700/50' : 'bg-purple-50 text-purple-700 border-purple-200';
      case 'iaas':
        return darkMode ? 'bg-emerald-900/40 text-emerald-300 border-emerald-700/50' : 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'iof':
        return darkMode ? 'bg-green-900/40 text-green-300 border-green-700/50' : 'bg-green-50 text-green-700 border-green-200';
      case 'foe':
        return darkMode ? 'bg-amber-900/40 text-amber-300 border-amber-700/50' : 'bg-amber-50 text-amber-700 border-amber-200';
      case 'fol':
        return darkMode ? 'bg-indigo-900/40 text-indigo-300 border-indigo-700/50' : 'bg-indigo-50 text-indigo-700 border-indigo-200';
      default:
        return darkMode ? 'bg-neutral-800 text-neutral-300 border-neutral-700' : 'bg-neutral-100 text-neutral-700 border-neutral-300';
    }
  };

  const pdfCount = results.filter(hasNoticePdf).length;
  const imageCount = results.filter(hasNoticeImage).length;
  const anyAttachedCount = results.filter(hasAnyNoticeAttachment).length;

  const filteredResults = results.filter((notice) => {
    if (attachmentFilter === 'pdf') return hasNoticePdf(notice);
    if (attachmentFilter === 'image') return hasNoticeImage(notice);
    if (attachmentFilter === 'any') return hasAnyNoticeAttachment(notice);
    return true;
  });

  return (
    <div id="live-playground" className="space-y-6">
      {/* Control Panel Card */}
      <div
        className={`rounded-md border p-4 sm:p-5 ${
          darkMode ? 'bg-[#161b22] border-[#30363d]' : 'bg-white border-[#d0d7de]'
        }`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
          <div>
            <h2 className="text-base font-semibold flex items-center gap-2">
              <Play className="w-4 h-4 text-green-500 fill-current" />
              <span>Interactive Scraper Console</span>
            </h2>
            <p className={`text-xs mt-1 ${darkMode ? 'text-[#7d8590]' : 'text-[#656d76]'}`}>
              Execute <code className="font-mono text-[11px]">getNotices()</code>,{' '}
              <code className="font-mono text-[11px]">getLatest()</code>,{' '}
              <code className="font-mono text-[11px]">searchNotices()</code>, or{' '}
              <code className="font-mono text-[11px]">getNoticeDetail()</code> directly against official TU portal endpoints.
            </p>
          </div>

          {/* Action Tabs */}
          <div
            className={`flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none p-0.5 rounded-lg border self-start max-w-full ${
              darkMode ? 'bg-[#0d1117] border-[#30363d]' : 'bg-[#f6f8fa] border-[#d0d7de]'
            }`}
          >
            <button
              onClick={() => setAction('notices')}
              className={`px-2.5 sm:px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                action === 'notices'
                  ? darkMode
                    ? 'bg-[#21262d] text-white shadow-xs'
                    : 'bg-white text-neutral-900 shadow-xs'
                  : darkMode
                  ? 'text-[#7d8590] hover:text-white'
                  : 'text-[#656d76] hover:text-neutral-900'
              }`}
            >
              getNotices()
            </button>
            <button
              onClick={() => setAction('latest')}
              className={`px-2.5 sm:px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                action === 'latest'
                  ? darkMode
                    ? 'bg-[#21262d] text-white shadow-xs'
                    : 'bg-white text-neutral-900 shadow-xs'
                  : darkMode
                  ? 'text-[#7d8590] hover:text-white'
                  : 'text-[#656d76] hover:text-neutral-900'
              }`}
            >
              getLatest()
            </button>
            <button
              onClick={() => setAction('search')}
              className={`px-2.5 sm:px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                action === 'search'
                  ? darkMode
                    ? 'bg-[#21262d] text-white shadow-xs'
                    : 'bg-white text-neutral-900 shadow-xs'
                  : darkMode
                  ? 'text-[#7d8590] hover:text-white'
                  : 'text-[#656d76] hover:text-neutral-900'
              }`}
            >
              searchNotices()
            </button>
            <button
              onClick={() => setAction('detail')}
              className={`px-2.5 sm:px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors flex items-center gap-1 ${
                action === 'detail'
                  ? darkMode
                    ? 'bg-[#21262d] text-white shadow-xs'
                    : 'bg-white text-neutral-900 shadow-xs'
                  : darkMode
                  ? 'text-[#7d8590] hover:text-white'
                  : 'text-[#656d76] hover:text-neutral-900'
              }`}
            >
              <Paperclip className="w-3 h-3 text-blue-400" />
              <span>getNoticeDetail()</span>
            </button>
          </div>
        </div>

        {/* Inputs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          {/* Source Selector */}
          <div>
            <label className={`block text-xs font-medium mb-1.5 ${darkMode ? 'text-[#e6edf3]' : 'text-[#1f2328]'}`}>
              Source Faculty / Institute:
            </label>
            <select
              id="playground-source-select"
              value={source}
              onChange={(e) => setSource(e.target.value as SourceQuery)}
              className={`w-full text-xs rounded border px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                darkMode ? 'bg-[#0d1117] border-[#30363d] text-[#c9d1d9]' : 'bg-[#f6f8fa] border-[#d0d7de] text-[#24292f]'
              }`}
            >
              {SOURCE_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  [{opt.id.toUpperCase()}] {opt.name}
                </option>
              ))}
            </select>
          </div>

          {/* Conditional Query or Detail URL */}
          {action === 'search' ? (
            <div>
              <label className={`block text-xs font-medium mb-1.5 ${darkMode ? 'text-[#e6edf3]' : 'text-[#1f2328]'}`}>
                Search Keyword / Subject:
              </label>
              <div className="relative">
                <input
                  id="playground-search-input"
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g. Exam, Admission, Result, B.Sc"
                  onKeyDown={(e) => e.key === 'Enter' && executeScrape()}
                  className={`w-full text-xs rounded border pl-7 pr-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                    darkMode ? 'bg-[#0d1117] border-[#30363d] text-[#c9d1d9]' : 'bg-[#f6f8fa] border-[#d0d7de] text-[#24292f]'
                  }`}
                />
                <Search className="w-3.5 h-3.5 absolute left-2 top-2 text-neutral-400" />
              </div>
            </div>
          ) : action === 'detail' ? (
            <div className="lg:col-span-2">
              <label className={`block text-xs font-medium mb-1.5 ${darkMode ? 'text-[#e6edf3]' : 'text-[#1f2328]'}`}>
                Notice URL or ID (Scrapes PDFs & Image attachments):
              </label>
              <div className="relative">
                <input
                  id="playground-detail-url-input"
                  type="text"
                  value={detailUrl}
                  onChange={(e) => setDetailUrl(e.target.value)}
                  placeholder="https://iost.tu.edu.np/notices/14690 or 14690"
                  onKeyDown={(e) => e.key === 'Enter' && executeScrape()}
                  className={`w-full text-xs rounded border pl-7 pr-2.5 py-1.5 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                    darkMode ? 'bg-[#0d1117] border-[#30363d] text-[#c9d1d9]' : 'bg-[#f6f8fa] border-[#d0d7de] text-[#24292f]'
                  }`}
                />
                <Paperclip className="w-3.5 h-3.5 absolute left-2 top-2 text-neutral-400" />
              </div>
            </div>
          ) : (
            <div>
              <label className={`block text-xs font-medium mb-1.5 ${darkMode ? 'text-[#e6edf3]' : 'text-[#1f2328]'}`}>
                Timeout Limit:
              </label>
              <select
                value={timeoutMs}
                onChange={(e) => setTimeoutMs(Number(e.target.value))}
                className={`w-full text-xs rounded border px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                  darkMode ? 'bg-[#0d1117] border-[#30363d] text-[#c9d1d9]' : 'bg-[#f6f8fa] border-[#d0d7de] text-[#24292f]'
                }`}
              >
                <option value={8000}>8,000 ms (Fast)</option>
                <option value={12000}>12,000 ms (Standard)</option>
                <option value={20000}>20,000 ms (High latency)</option>
              </select>
            </div>
          )}

          {/* Cache Setting */}
          {action !== 'detail' && (
            <div>
              <label className={`block text-xs font-medium mb-1.5 ${darkMode ? 'text-[#e6edf3]' : 'text-[#1f2328]'}`}>
                Cache Behavior:
              </label>
              <div className="flex items-center gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={bypassCache}
                    onChange={(e) => setBypassCache(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>Bypass Cache (Force Live Fetch)</span>
                </label>
              </div>
            </div>
          )}

          {/* Action Trigger Button */}
          <div className="flex items-end">
            <button
              id="playground-execute-btn"
              onClick={executeScrape}
              disabled={loading}
              className="w-full bg-[#1f883d] hover:bg-[#1a7f37] text-white text-xs font-medium py-1.5 px-3 rounded flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Scraping TU Portals...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Run Scraper</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Results Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Output</span>
          {results.length > 0 && (
            <span
              className={`text-xs px-2 py-0.5 rounded font-mono ${
                darkMode ? 'bg-[#21262d] text-[#c9d1d9]' : 'bg-[#eef1f4] text-[#24292f]'
              }`}
            >
              {filteredResults.length} of {results.length} notice{results.length !== 1 ? 's' : ''} shown
            </span>
          )}
          {durationMs !== null && (
            <span className="text-xs text-neutral-400 flex items-center gap-1 font-mono">
              <Clock className="w-3 h-3" />
              {durationMs}ms
            </span>
          )}
        </div>

        {/* View mode toggle + Attachment filter */}
        <div className="flex flex-wrap items-center gap-2">
          {results.length > 0 && (
            <div
              className={`inline-flex p-0.5 rounded border text-xs ${
                darkMode ? 'bg-[#161b22] border-[#30363d]' : 'bg-[#f6f8fa] border-[#d0d7de]'
              }`}
            >
              <button
                onClick={() => setAttachmentFilter('all')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  attachmentFilter === 'all'
                    ? darkMode
                      ? 'bg-[#21262d] text-white shadow-xs'
                      : 'bg-white text-neutral-900 shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-300'
                }`}
              >
                All ({results.length})
              </button>
              <button
                onClick={() => setAttachmentFilter('pdf')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium flex items-center gap-1 transition-colors ${
                  attachmentFilter === 'pdf'
                    ? darkMode
                      ? 'bg-[#21262d] text-white shadow-xs'
                      : 'bg-white text-neutral-900 shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-300'
                }`}
              >
                <FileText className="w-3 h-3 text-red-400" />
                <span>PDFs ({pdfCount})</span>
              </button>
              <button
                onClick={() => setAttachmentFilter('image')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium flex items-center gap-1 transition-colors ${
                  attachmentFilter === 'image'
                    ? darkMode
                      ? 'bg-[#21262d] text-white shadow-xs'
                      : 'bg-white text-neutral-900 shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-300'
                }`}
              >
                <ImageIcon className="w-3 h-3 text-blue-400" />
                <span>Images ({imageCount})</span>
              </button>
              <button
                onClick={() => setAttachmentFilter('any')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  attachmentFilter === 'any'
                    ? darkMode
                      ? 'bg-[#21262d] text-white shadow-xs'
                      : 'bg-white text-neutral-900 shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-300'
                }`}
              >
                Attached Only ({anyAttachedCount})
              </button>
            </div>
          )}

          <div
            className={`inline-flex p-0.5 rounded border ${
              darkMode ? 'bg-[#161b22] border-[#30363d]' : 'bg-[#f6f8fa] border-[#d0d7de]'
            }`}
          >
            <button
              onClick={() => setViewMode('cards')}
              title="Cards View"
              className={`p-1 rounded ${
                viewMode === 'cards'
                  ? darkMode
                    ? 'bg-[#21262d] text-white'
                    : 'bg-white text-neutral-900 shadow-xs'
                  : 'text-neutral-400 hover:text-neutral-600'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              title="Table View"
              className={`p-1 rounded ${
                viewMode === 'table'
                  ? darkMode
                    ? 'bg-[#21262d] text-white'
                    : 'bg-white text-neutral-900 shadow-xs'
                  : 'text-neutral-400 hover:text-neutral-600'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('json')}
              title="Raw JSON View"
              className={`p-1 rounded ${
                viewMode === 'json'
                  ? darkMode
                    ? 'bg-[#21262d] text-white'
                    : 'bg-white text-neutral-900 shadow-xs'
                  : 'text-neutral-400 hover:text-neutral-600'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={copyJson}
            disabled={results.length === 0}
            className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded border transition-colors disabled:opacity-40 ${
              darkMode
                ? 'bg-[#21262d] border-[#30363d] text-[#c9d1d9] hover:bg-[#30363d]'
                : 'bg-white border-[#d0d7de] text-[#24292f] hover:bg-[#f3f4f6]'
            }`}
          >
            {copiedJson ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedJson ? 'Copied!' : 'Copy JSON'}</span>
          </button>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="rounded-md border border-red-500/30 bg-red-500/10 p-4 text-xs">
          <div className="flex items-center gap-2 font-semibold text-red-500">
            <AlertCircle className="w-4 h-4" />
            <span>
              {errorName || 'Error'}: {error}
            </span>
          </div>
          <p className="mt-1 text-neutral-500">
            The requested TU source portal may be experiencing network latency or server load. Click &quot;Run Scraper&quot; to retry live fetch.
          </p>
        </div>
      )}

      {/* Empty Filter State */}
      {!loading && !error && results.length > 0 && filteredResults.length === 0 && (
        <div
          className={`rounded-md border p-8 text-center ${
            darkMode ? 'bg-[#161b22] border-[#30363d]' : 'bg-white border-[#d0d7de]'
          }`}
        >
          <Filter className="w-8 h-8 mx-auto text-neutral-400 mb-2" />
          <h3 className="text-sm font-semibold mb-1">No notices match &quot;{attachmentFilter}&quot; filter</h3>
          <p className={`text-xs max-w-md mx-auto mb-4 ${darkMode ? 'text-[#7d8590]' : 'text-[#656d76]'}`}>
            None of the currently loaded {results.length} notices contain{' '}
            {attachmentFilter === 'pdf' ? 'PDFs' : attachmentFilter === 'image' ? 'scanned images' : 'attachments'}. You can inspect any notice or run a deep scan across all notices.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => setAttachmentFilter('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded border transition-colors ${
                darkMode ? 'bg-[#21262d] border-[#30363d] hover:bg-[#30363d]' : 'bg-white border-[#d0d7de] hover:bg-[#f6f8fa]'
              }`}
            >
              Show All Notices ({results.length})
            </button>
            <button
              onClick={deepScanAllNotices}
              disabled={inspectLoading}
              className="px-3 py-1.5 text-xs font-medium rounded bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              {inspectLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Paperclip className="w-3.5 h-3.5" />}
              <span>Deep Scan All Notice Attachments</span>
            </button>
          </div>
        </div>
      )}

      {/* 1. CARDS VIEW */}
      {!loading && !error && filteredResults.length > 0 && viewMode === 'cards' && (
        <div className="space-y-3">
          {filteredResults.map((notice, idx) => {
            const hasPdf = hasNoticePdf(notice);
            const hasImage = hasNoticeImage(notice);
            const primaryPdf = getNoticePrimaryPdf(notice);
            const primaryImage = getNoticePrimaryImage(notice);
            const allAtts = getNoticeAllAttachments(notice);

            return (
              <div
                key={`${notice.source}-${notice.id}-${idx}`}
                className={`rounded-md border p-4 sm:p-5 transition-all hover:border-neutral-400 dark:hover:border-neutral-600 ${
                  darkMode ? 'bg-[#161b22] border-[#30363d]' : 'bg-white border-[#d0d7de]'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`text-[11px] font-mono font-semibold uppercase px-2 py-0.5 rounded border ${getSourceBadgeColor(
                        notice.source
                      )}`}
                    >
                      {notice.source}
                    </span>
                    <span className="text-xs font-mono text-neutral-400">#{notice.id}</span>
                    {notice.date && (
                      <span className="text-xs text-neutral-400 flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3" />
                        {notice.date}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* Image attachment badge */}
                    {hasImage && primaryImage && (
                      <button
                        onClick={() => setZoomedImage(primaryImage)}
                        className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded border font-medium transition-colors ${
                          darkMode
                            ? 'bg-blue-950/40 border-blue-800/50 text-blue-300 hover:bg-blue-900/60'
                            : 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100'
                        }`}
                      >
                        <ImageIcon className="w-3 h-3" />
                        <span>Scanned Image</span>
                      </button>
                    )}

                    {/* PDF attachment badge */}
                    {hasPdf && primaryPdf && (
                      <a
                        href={primaryPdf}
                        target="_blank"
                        rel="noreferrer"
                        className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded border font-medium transition-colors ${
                          darkMode
                            ? 'bg-[#21262d] border-[#30363d] text-[#58a6ff] hover:bg-[#30363d]'
                            : 'bg-[#ddf4ff] border-[#54aeff]/30 text-[#0969da] hover:bg-[#b6e3ff]'
                        }`}
                      >
                        <Download className="w-3 h-3" />
                        <span>PDF Document</span>
                      </a>
                    )}

                    {/* Inspect Details button */}
                    <button
                      onClick={() => inspectNotice(notice)}
                      className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded border font-medium transition-colors ${
                        darkMode
                          ? 'bg-[#21262d] border-[#30363d] text-[#c9d1d9] hover:bg-[#30363d]'
                          : 'bg-white border-[#d0d7de] text-[#24292f] hover:bg-[#f3f4f6]'
                      }`}
                    >
                      <Paperclip className="w-3 h-3 text-neutral-400" />
                      <span>Inspect Details</span>
                    </button>

                    <a
                      href={notice.url}
                      target="_blank"
                      rel="noreferrer"
                      className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded border transition-colors ${
                        darkMode
                          ? 'border-[#30363d] text-neutral-400 hover:text-white'
                          : 'border-[#d0d7de] text-neutral-600 hover:text-black'
                      }`}
                    >
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                <h4
                  className={`text-sm sm:text-base font-semibold leading-snug mt-1 cursor-pointer hover:text-blue-500 transition-colors ${
                    darkMode ? 'text-[#e6edf3]' : 'text-[#1f2328]'
                  }`}
                  onClick={() => inspectNotice(notice)}
                >
                  {notice.title}
                </h4>

                {/* Attachments List preview */}
                {allAtts.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-neutral-200 dark:border-neutral-800 flex flex-wrap gap-2 items-center">
                    <span className="text-[11px] font-mono text-neutral-500 uppercase">Attached Files:</span>
                    {allAtts.map((att, attIdx) => (
                      <a
                        key={attIdx}
                        href={att.url}
                        target="_blank"
                        rel="noreferrer"
                        className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded border font-mono transition-colors ${
                          att.type === 'pdf'
                            ? 'border-red-500/30 text-red-500 bg-red-500/5 hover:bg-red-500/10'
                            : att.type === 'image'
                            ? 'border-blue-500/30 text-blue-500 bg-blue-500/5 hover:bg-blue-500/10'
                            : 'border-neutral-500/30 text-neutral-400 hover:text-neutral-200'
                        }`}
                      >
                        {att.type === 'pdf' ? (
                          <FileText className="w-2.5 h-2.5" />
                        ) : att.type === 'image' ? (
                          <ImageIcon className="w-2.5 h-2.5" />
                        ) : (
                          <Paperclip className="w-2.5 h-2.5" />
                        )}
                        <span>{att.filename || 'attachment'}</span>
                      </a>
                    ))}
                  </div>
                )}

                <div
                  className={`mt-2 pt-2 border-t text-[11px] font-mono truncate ${
                    darkMode ? 'border-[#21262d] text-[#7d8590]' : 'border-[#eaeef2] text-[#656d76]'
                  }`}
                >
                  URL: {notice.url}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 2. TABLE VIEW */}
      {!loading && !error && filteredResults.length > 0 && viewMode === 'table' && (
        <div
          className={`rounded-md border overflow-x-auto ${
            darkMode ? 'bg-[#0d1117] border-[#30363d]' : 'bg-white border-[#d0d7de]'
          }`}
        >
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr
                className={`border-b font-mono ${
                  darkMode ? 'bg-[#161b22] border-[#30363d] text-[#7d8590]' : 'bg-[#f6f8fa] border-[#d0d7de] text-[#656d76]'
                }`}
              >
                <th className="px-3.5 py-2.5 font-semibold">Source</th>
                <th className="px-3.5 py-2.5 font-semibold">ID</th>
                <th className="px-3.5 py-2.5 font-semibold min-w-[300px]">Notice Title</th>
                <th className="px-3.5 py-2.5 font-semibold">Published Date</th>
                <th className="px-3.5 py-2.5 font-semibold">Attachments</th>
                <th className="px-3.5 py-2.5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800 font-sans">
              {filteredResults.map((n, idx) => {
                const hasPdf = hasNoticePdf(n);
                const hasImage = hasNoticeImage(n);
                const primaryPdf = getNoticePrimaryPdf(n);
                const primaryImage = getNoticePrimaryImage(n);

                return (
                  <tr
                    key={`${n.source}-${n.id}-${idx}`}
                    className={`transition-colors ${darkMode ? 'hover:bg-[#161b22]' : 'hover:bg-[#f6f8fa]'}`}
                  >
                    <td className="px-3.5 py-2.5 whitespace-nowrap">
                      <span
                        className={`text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded border ${getSourceBadgeColor(
                          n.source
                        )}`}
                      >
                        {n.source}
                      </span>
                    </td>
                    <td className="px-3.5 py-2.5 font-mono text-[11px] text-neutral-400 whitespace-nowrap">{n.id}</td>
                    <td
                      className="px-3.5 py-2.5 font-medium cursor-pointer hover:text-blue-500"
                      onClick={() => inspectNotice(n)}
                    >
                      {n.title}
                    </td>
                    <td className="px-3.5 py-2.5 font-mono whitespace-nowrap text-neutral-400">{n.date || '—'}</td>
                    <td className="px-3.5 py-2.5 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        {hasPdf && primaryPdf && (
                          <a
                            href={primaryPdf}
                            target="_blank"
                            rel="noreferrer"
                            className="text-red-500 hover:underline flex items-center gap-1 font-mono text-[11px]"
                          >
                            <FileText className="w-3 h-3" />
                            PDF
                          </a>
                        )}
                        {hasImage && primaryImage && (
                          <button
                            onClick={() => setZoomedImage(primaryImage)}
                            className="text-blue-500 hover:underline flex items-center gap-1 font-mono text-[11px]"
                          >
                            <ImageIcon className="w-3 h-3" />
                            Image
                          </button>
                        )}
                        {!hasPdf && !hasImage && <span className="text-neutral-400">—</span>}
                      </div>
                    </td>
                    <td className="px-3.5 py-2.5 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => inspectNotice(n)}
                          className="text-xs text-blue-500 hover:underline font-medium"
                        >
                          Inspect
                        </button>
                        <a href={n.url} target="_blank" rel="noreferrer" className="text-neutral-400 hover:text-blue-500">
                          <ExternalLink className="w-3.5 h-3.5 inline" />
                        </a>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* 3. RAW JSON VIEW */}
      {!loading && !error && filteredResults.length > 0 && viewMode === 'json' && (
        <div
          className={`rounded-md border overflow-hidden font-mono text-xs ${
            darkMode ? 'bg-[#0d1117] border-[#30363d]' : 'bg-[#f6f8fa] border-[#d0d7de]'
          }`}
        >
          <div
            className={`flex items-center justify-between px-3 py-2 border-b text-[11px] ${
              darkMode ? 'bg-[#161b22] border-[#30363d] text-[#7d8590]' : 'bg-white border-[#d0d7de] text-[#656d76]'
            }`}
          >
            <span>JSON Payload ({action})</span>
            <span>{filteredResults.length} records</span>
          </div>
          <pre
            className={`p-4 overflow-x-auto max-h-[500px] leading-relaxed ${
              darkMode ? 'text-[#e6edf3]' : 'text-[#24292f]'
            }`}
          >
            {JSON.stringify(action === 'latest' ? latestSingle : action === 'detail' ? detailResult : results, null, 2)}
          </pre>
        </div>
      )}

      {/* NOTICE DETAIL & ATTACHMENT INSPECTOR MODAL */}
      {selectedNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div
            className={`w-full max-w-3xl rounded-lg border shadow-2xl overflow-hidden max-h-[90vh] flex flex-col ${
              darkMode ? 'bg-[#161b22] border-[#30363d] text-[#c9d1d9]' : 'bg-white border-[#d0d7de] text-[#24292f]'
            }`}
          >
            {/* Modal Header */}
            <div
              className={`p-4 border-b flex items-center justify-between ${
                darkMode ? 'bg-[#0d1117] border-[#30363d]' : 'bg-[#f6f8fa] border-[#d0d7de]'
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded border ${getSourceBadgeColor(
                    selectedNotice.source
                  )}`}
                >
                  {selectedNotice.source}
                </span>
                <span className="text-xs font-mono text-neutral-400">Notice ID: {selectedNotice.id}</span>
              </div>
              <button
                onClick={() => setSelectedNotice(null)}
                className="p-1 rounded-md text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-5">
              <div>
                <h3
                  className={`text-base sm:text-lg font-semibold leading-snug ${
                    darkMode ? 'text-white' : 'text-neutral-900'
                  }`}
                >
                  {selectedNotice.title}
                </h3>
                <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-neutral-400">
                  {selectedNotice.date && (
                    <span className="flex items-center gap-1 font-mono">
                      <Clock className="w-3.5 h-3.5" />
                      Date: {selectedNotice.date}
                    </span>
                  )}
                  {(selectedNotice as NoticeDetail).nepaliDate && (
                    <span className="font-mono">BS: {(selectedNotice as NoticeDetail).nepaliDate}</span>
                  )}
                  {(selectedNotice as NoticeDetail).englishDate && (
                    <span className="font-mono">AD: {(selectedNotice as NoticeDetail).englishDate}</span>
                  )}
                </div>
              </div>

              {inspectLoading && (
                <div className="py-8 flex flex-col items-center justify-center gap-2 text-neutral-400">
                  <RefreshCw className="w-6 h-6 animate-spin text-blue-500" />
                  <span className="text-xs font-mono">Deep inspecting notice detail & extracting media attachments...</span>
                </div>
              )}

              {/* Scanned Image Attachments Gallery */}
              {(selectedNotice.image ||
                selectedNotice.images ||
                selectedNotice.attachments?.some((a) => a.type === 'image' || isImageUrl(a.url))) && (
                <div
                  className={`p-4 rounded-md border ${
                    darkMode ? 'bg-[#0d1117] border-blue-900/40' : 'bg-blue-50/50 border-blue-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 text-blue-500">
                      <ImageIcon className="w-4 h-4" />
                      <span>Attached Notice Scanned Images / Photos</span>
                    </h4>
                    <span className="text-[11px] font-mono text-neutral-400">
                      {(
                        selectedNotice.images?.length ||
                        (selectedNotice.image ? 1 : 0) ||
                        selectedNotice.attachments?.filter((a) => a.type === 'image' || isImageUrl(a.url)).length ||
                        0
                      )}{' '}
                      file(s)
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(
                      selectedNotice.images ||
                      (selectedNotice.image ? [selectedNotice.image] : []) ||
                      selectedNotice.attachments?.filter((a) => a.type === 'image' || isImageUrl(a.url)).map((a) => a.url) ||
                      []
                    ).map((imgUrl, i) => (
                      <div
                        key={i}
                        className={`rounded border overflow-hidden group relative ${
                          darkMode ? 'bg-[#161b22] border-[#30363d]' : 'bg-white border-[#d0d7de]'
                        }`}
                      >
                        <div
                          className="h-44 w-full bg-neutral-950 flex items-center justify-center overflow-hidden cursor-pointer"
                          onClick={() => setZoomedImage(imgUrl)}
                        >
                          <img
                            src={imgUrl}
                            alt="Notice scan"
                            className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <div className="p-2.5 flex items-center justify-between text-xs border-t border-neutral-200 dark:border-neutral-800">
                          <span className="font-mono text-[11px] truncate max-w-[180px]">
                            {imgUrl.split('/').pop()}
                          </span>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => setZoomedImage(imgUrl)}
                              className="p-1 text-neutral-400 hover:text-blue-500"
                              title="Zoom Scan"
                            >
                              <Maximize2 className="w-3.5 h-3.5" />
                            </button>
                            <a
                              href={imgUrl}
                              target="_blank"
                              rel="noreferrer"
                              download
                              className="p-1 text-neutral-400 hover:text-blue-500"
                              title="Download Image"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* All Extracted Attachments (PDFs, Docs, Tables) */}
              {getNoticeAllAttachments(selectedNotice).length > 0 && (
                <div
                  className={`p-4 rounded-md border ${
                    darkMode ? 'bg-[#0d1117] border-[#30363d]' : 'bg-[#f6f8fa] border-[#d0d7de]'
                  }`}
                >
                  <h4 className="text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5 text-neutral-400">
                    <Paperclip className="w-3.5 h-3.5" />
                    <span>Downloadable Files & Attachments ({getNoticeAllAttachments(selectedNotice).length})</span>
                  </h4>
                  <div className="space-y-1.5">
                    {getNoticeAllAttachments(selectedNotice).map((att, i) => (
                      <div
                        key={i}
                        className={`p-2 rounded border flex items-center justify-between text-xs ${
                          darkMode ? 'bg-[#161b22] border-[#30363d]' : 'bg-white border-[#d0d7de]'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate pr-2">
                          {att.type === 'pdf' ? (
                            <FileText className="w-4 h-4 text-red-500 shrink-0" />
                          ) : att.type === 'image' ? (
                            <ImageIcon className="w-4 h-4 text-blue-500 shrink-0" />
                          ) : (
                            <Paperclip className="w-4 h-4 text-neutral-400 shrink-0" />
                          )}
                          <span className="font-mono text-[11px] truncate">{att.filename}</span>
                          <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-neutral-500/10 text-neutral-400">
                            {att.type}
                          </span>
                        </div>
                        <a
                          href={att.url}
                          target="_blank"
                          rel="noreferrer"
                          download
                          className="px-2 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-medium flex items-center gap-1 transition-colors shrink-0"
                        >
                          <Download className="w-3 h-3" />
                          <span>Download</span>
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Text content if parsed */}
              {(selectedNotice as NoticeDetail).content && (
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider mb-2 text-neutral-400">Notice Body Text</h4>
                  <div
                    className={`p-3 rounded border font-mono text-xs whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto ${
                      darkMode ? 'bg-[#0d1117] border-[#30363d]' : 'bg-[#f6f8fa] border-[#d0d7de]'
                    }`}
                  >
                    {(selectedNotice as NoticeDetail).content}
                  </div>
                </div>
              )}

              {/* Notice Metadata */}
              <div
                className={`p-3 rounded border text-xs font-mono space-y-1 ${
                  darkMode ? 'bg-[#0d1117] border-[#30363d] text-neutral-400' : 'bg-[#f6f8fa] border-[#d0d7de] text-neutral-600'
                }`}
              >
                <div>Direct Portal URL: {selectedNotice.url}</div>
                <div>Source Code: {selectedNotice.source.toUpperCase()}</div>
              </div>
            </div>

            {/* Modal Footer */}
            <div
              className={`p-3 border-t flex items-center justify-between text-xs ${
                darkMode ? 'bg-[#0d1117] border-[#30363d]' : 'bg-[#f6f8fa] border-[#d0d7de]'
              }`}
            >
              <a
                href={selectedNotice.url}
                target="_blank"
                rel="noreferrer"
                className="text-blue-500 hover:underline flex items-center gap-1 font-medium"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open in Official Portal</span>
              </a>
              <button
                onClick={() => setSelectedNotice(null)}
                className={`px-3 py-1 rounded border transition-colors ${
                  darkMode ? 'bg-[#21262d] border-[#30363d] text-white hover:bg-[#30363d]' : 'bg-white border-[#d0d7de] hover:bg-[#f6f8fa]'
                }`}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FULLSCREEN IMAGE ZOOM MODAL */}
      {zoomedImage && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn"
          onClick={() => setZoomedImage(null)}
        >
          <div className="relative max-w-5xl max-h-[90vh] flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <div className="absolute top-2 right-2 flex items-center gap-2 z-10">
              <a
                href={zoomedImage}
                target="_blank"
                rel="noreferrer"
                download
                className="p-2 rounded bg-neutral-900/80 border border-neutral-700 text-white hover:bg-neutral-800 transition-colors"
                title="Download Image Scan"
              >
                <Download className="w-4 h-4" />
              </a>
              <button
                onClick={() => setZoomedImage(null)}
                className="p-2 rounded bg-neutral-900/80 border border-neutral-700 text-white hover:bg-neutral-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <img
              src={zoomedImage}
              alt="Zoomed notice attachment"
              className="max-h-[85vh] max-w-full rounded shadow-2xl object-contain border border-neutral-800"
            />
            <div className="mt-2 text-center text-xs font-mono text-neutral-400 truncate max-w-lg">
              {zoomedImage}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
