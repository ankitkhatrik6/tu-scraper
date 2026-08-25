'use client';

import React, { useState } from 'react';
import {
  BookOpen,
  Code2,
  Copy,
  Check,
  FileCode,
  ShieldAlert,
  Layers,
  FileText,
  Image as ImageIcon,
} from 'lucide-react';

interface ApiReferenceProps {
  darkMode: boolean;
  focusedSection?: string;
}

export function ApiReference({ darkMode, focusedSection }: ApiReferenceProps) {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const copyCode = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <div id="api-reference-view" className="space-y-8 max-w-4xl w-full min-w-0 font-sans pb-12">
      {/* Intro */}
      <div className="pb-4 border-b border-neutral-200 dark:border-neutral-800 space-y-3">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-500 shrink-0" />
          <h2 className={`text-xl sm:text-2xl font-bold tracking-tight ${darkMode ? 'text-white' : 'text-[#1f2328]'}`}>
            API Reference
          </h2>
        </div>
        <p
          className={`text-xs sm:text-sm leading-relaxed ${
            darkMode ? 'text-[#c9d1d9]' : 'text-[#656d76]'
          }`}
        >
          Comprehensive signatures, parameter tables, response schemas, and TypeScript interfaces for{' '}
          <code className="font-mono text-blue-500 bg-blue-500/10 px-1 py-0.5 rounded">tu-scraper</code>.
        </p>

        {/* Quick Jump Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none pt-1">
          {[
            { id: 'api-get-notices', label: 'getNotices' },
            { id: 'api-get-latest', label: 'getLatest' },
            { id: 'api-search-notices', label: 'searchNotices' },
            { id: 'api-notice-detail', label: 'getNoticeDetail' },
            { id: 'api-types-interfaces', label: 'Types & Interfaces' },
            { id: 'api-errors', label: 'Errors' },
          ].map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`text-[11px] font-mono px-2.5 py-1 rounded-md border whitespace-nowrap transition-colors ${
                darkMode
                  ? 'bg-[#161b22] border-[#30363d] text-[#58a6ff] hover:bg-[#21262d]'
                  : 'bg-[#f6f8fa] border-[#d0d7de] text-[#0969da] hover:bg-[#eff1f3]'
              }`}
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>

      {/* 1. getNotices */}
      <section
        id="api-get-notices"
        className={`space-y-3 p-4 rounded-lg border transition-all ${
          focusedSection === 'get-notices'
            ? darkMode
              ? 'border-blue-500/80 bg-blue-950/10 ring-1 ring-blue-500/50'
              : 'border-blue-500/80 bg-blue-50/50 ring-1 ring-blue-500/50'
            : darkMode
            ? 'border-transparent'
            : 'border-transparent'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
          <h3 className="text-sm sm:text-base font-mono font-bold text-blue-500 break-all sm:break-normal">
            getNotices(source, options?)
          </h3>
          <span
            className={`self-start sm:self-auto text-[11px] sm:text-xs px-2 py-0.5 rounded font-mono shrink-0 ${
              darkMode ? 'bg-[#21262d] text-[#7d8590]' : 'bg-[#f6f8fa] text-[#656d76]'
            }`}
          >
            Promise&lt;Notice[]&gt;
          </span>
        </div>

        <p className={`text-xs sm:text-sm leading-relaxed ${darkMode ? 'text-[#c9d1d9]' : 'text-[#24292f]'}`}>
          Fetches all published notices from the specified faculty or institution. Passing <code className="font-mono text-blue-500 font-semibold">&quot;all&quot;</code> concurrently queries all 8 portals with resilience via <code className="font-mono">Promise.allSettled</code>.
        </p>

        {/* Arguments Table with responsive scroll */}
        <div
          className={`rounded-md border overflow-x-auto text-xs ${
            darkMode ? 'bg-[#0d1117] border-[#30363d]' : 'bg-white border-[#d0d7de]'
          }`}
        >
          <table className="w-full min-w-[500px] text-left">
            <thead className={`border-b ${darkMode ? 'bg-[#161b22] text-[#7d8590]' : 'bg-[#f6f8fa] text-[#656d76]'}`}>
              <tr>
                <th className="px-3 py-2 font-semibold">Parameter</th>
                <th className="px-3 py-2 font-semibold">Type</th>
                <th className="px-3 py-2 font-semibold">Required</th>
                <th className="px-3 py-2 font-semibold">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800 font-mono text-[11px]">
              <tr className="border-b border-white/5 bg-white/5 transition-colors">
                <td className="px-3 py-2 font-mono text-sm text-green-400">source</td>
                <td className="px-3 py-2 text-neutral-400">&quot;iost&quot; | &quot;fohss&quot; | &quot;ioe&quot; | &quot;ac&quot; | &quot;iaas&quot; | &quot;iof&quot; | &quot;foe&quot; | &quot;fol&quot; | &quot;all&quot;</td>
                <td className="px-3 py-2 text-red-500 font-sans font-semibold">Yes</td>
                <td className="px-3 py-2 font-sans text-neutral-400">Target institution or &quot;all&quot;</td>
              </tr>
              <tr>
                <td className="px-3 py-2 text-blue-500 font-bold">options</td>
                <td className="px-3 py-2 text-neutral-400">ScrapeOptions</td>
                <td className="px-3 py-2 font-sans text-neutral-400">No</td>
                <td className="px-3 py-2 font-sans text-neutral-400">Optional timeout, cache bypass, and fixture data</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Code Example */}
        <div
          className={`rounded-md border p-3 font-mono text-xs relative overflow-hidden ${
            darkMode ? 'bg-[#010409] border-[#30363d] text-[#e6edf3]' : 'bg-[#f6f8fa] border-[#d0d7de] text-[#1f2328]'
          }`}
        >
          <button
            onClick={() => copyCode('getNotices', `import { getNotices } from "tu-scraper";\nconst notices = await getNotices("iost");`)}
            className="absolute right-2 top-2 p-1.5 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 transition-colors"
            title="Copy code"
            aria-label="Copy code"
          >
            {copiedSection === 'getNotices' ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          <pre className="overflow-x-auto max-w-full text-[11px] sm:text-xs leading-relaxed pr-8">{`import { getNotices } from "tu-scraper";

// Fetch notices from Institute of Science & Technology
const notices = await getNotices("iost");

// Or aggregate across all 8 faculties
const allNotices = await getNotices("all", { timeout: 12000, bypassCache: true });`}</pre>
        </div>
      </section>

      {/* 2. getLatest */}
      <section
        id="api-get-latest"
        className={`space-y-3 p-4 rounded-lg border transition-all ${
          focusedSection === 'get-latest'
            ? darkMode
              ? 'border-blue-500/80 bg-blue-950/10 ring-1 ring-blue-500/50'
              : 'border-blue-500/80 bg-blue-50/50 ring-1 ring-blue-500/50'
            : 'border-transparent'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
          <h3 className="text-sm sm:text-base font-mono font-bold text-blue-500 break-all sm:break-normal">
            getLatest(source, options?)
          </h3>
          <span
            className={`self-start sm:self-auto text-[11px] sm:text-xs px-2 py-0.5 rounded font-mono shrink-0 ${
              darkMode ? 'bg-[#21262d] text-[#7d8590]' : 'bg-[#f6f8fa] text-[#656d76]'
            }`}
          >
            Promise&lt;Notice | null&gt;
          </span>
        </div>

        <p className={`text-xs sm:text-sm leading-relaxed ${darkMode ? 'text-[#c9d1d9]' : 'text-[#24292f]'}`}>
          Fetches solely the first (most recent) notice from the specified portal. Returns <code className="font-mono">null</code> if no notices exist on the page.
        </p>

        {/* Code Example */}
        <div
          className={`rounded-md border p-3 font-mono text-xs relative overflow-hidden ${
            darkMode ? 'bg-[#010409] border-[#30363d] text-[#e6edf3]' : 'bg-[#f6f8fa] border-[#d0d7de] text-[#1f2328]'
          }`}
        >
          <button
            onClick={() => copyCode('getLatest', `import { getLatest } from "tu-scraper";\nconst latest = await getLatest("ioe");`)}
            className="absolute right-2 top-2 p-1.5 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 transition-colors"
            title="Copy code"
            aria-label="Copy code"
          >
            {copiedSection === 'getLatest' ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          <pre className="overflow-x-auto max-w-full text-[11px] sm:text-xs leading-relaxed pr-8">{`import { getLatest } from "tu-scraper";

const latestIoeNotice = await getLatest("ioe");
if (latestIoeNotice) {
  console.log(latestIoeNotice.title, latestIoeNotice.url);
}`}</pre>
        </div>
      </section>

      {/* 3. searchNotices */}
      <section
        id="api-search-notices"
        className={`space-y-3 p-4 rounded-lg border transition-all ${
          focusedSection === 'search-notices'
            ? darkMode
              ? 'border-blue-500/80 bg-blue-950/10 ring-1 ring-blue-500/50'
              : 'border-blue-500/80 bg-blue-50/50 ring-1 ring-blue-500/50'
            : 'border-transparent'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
          <h3 className="text-sm sm:text-base font-mono font-bold text-blue-500 break-all sm:break-normal">
            searchNotices(query, source?, options?)
          </h3>
          <span
            className={`self-start sm:self-auto text-[11px] sm:text-xs px-2 py-0.5 rounded font-mono shrink-0 ${
              darkMode ? 'bg-[#21262d] text-[#7d8590]' : 'bg-[#f6f8fa] text-[#656d76]'
            }`}
          >
            Promise&lt;Notice[]&gt;
          </span>
        </div>

        <p className={`text-xs sm:text-sm leading-relaxed ${darkMode ? 'text-[#c9d1d9]' : 'text-[#24292f]'}`}>
          Filters notices matching a case-insensitive query substring against their titles. If <code className="font-mono">source</code> is omitted, it defaults to <code className="font-mono">&quot;all&quot;</code>.
        </p>

        {/* Code Example */}
        <div
          className={`rounded-md border p-3 font-mono text-xs relative overflow-hidden ${
            darkMode ? 'bg-[#010409] border-[#30363d] text-[#e6edf3]' : 'bg-[#f6f8fa] border-[#d0d7de] text-[#1f2328]'
          }`}
        >
          <button
            onClick={() => copyCode('searchNotices', `import { searchNotices } from "tu-scraper";\nconst results = await searchNotices("BSc CSIT");`)}
            className="absolute right-2 top-2 p-1.5 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 transition-colors"
            title="Copy code"
            aria-label="Copy code"
          >
            {copiedSection === 'searchNotices' ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          <pre className="overflow-x-auto max-w-full text-[11px] sm:text-xs leading-relaxed pr-8">{`import { searchNotices } from "tu-scraper";

// Search across all faculties
const csitNotices = await searchNotices("BSc CSIT");

// Search within a specific faculty
const lawExams = await searchNotices("examination", "fol");`}</pre>
        </div>
      </section>

      {/* 4. getNoticeDetail */}
      <section
        id="api-get-notice-detail"
        className={`space-y-3 p-4 rounded-lg border transition-all ${
          focusedSection === 'get-notice-detail'
            ? darkMode
              ? 'border-blue-500/80 bg-blue-950/10 ring-1 ring-blue-500/50'
              : 'border-blue-500/80 bg-blue-50/50 ring-1 ring-blue-500/50'
            : 'border-transparent'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
          <h3 className="text-sm sm:text-base font-mono font-bold text-blue-500 break-all sm:break-normal">
            getNoticeDetail(url, source?, options?)
          </h3>
          <span
            className={`self-start sm:self-auto text-[11px] sm:text-xs px-2 py-0.5 rounded font-mono shrink-0 ${
              darkMode ? 'bg-[#21262d] text-[#7d8590]' : 'bg-[#f6f8fa] text-[#656d76]'
            }`}
          >
            Promise&lt;NoticeDetail&gt;
          </span>
        </div>

        <p className={`text-xs sm:text-sm leading-relaxed ${darkMode ? 'text-[#c9d1d9]' : 'text-[#24292f]'}`}>
          Deep-scrapes the individual notice page. Extracts full text paragraphs, high-res scan images, embedded PDF files, Nepali (BS) &amp; Gregorian (AD) publication dates, and author department.
        </p>

        {/* Code Example */}
        <div
          className={`rounded-md border p-3 font-mono text-xs relative overflow-hidden ${
            darkMode ? 'bg-[#010409] border-[#30363d] text-[#e6edf3]' : 'bg-[#f6f8fa] border-[#d0d7de] text-[#1f2328]'
          }`}
        >
          <button
            onClick={() => copyCode('getNoticeDetail', `import { getNoticeDetail } from "tu-scraper";\nconst detail = await getNoticeDetail("https://iost.tu.edu.np/notices/14690", "iost");`)}
            className="absolute right-2 top-2 p-1.5 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 transition-colors"
            title="Copy code"
            aria-label="Copy code"
          >
            {copiedSection === 'getNoticeDetail' ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          <pre className="overflow-x-auto max-w-full text-[11px] sm:text-xs leading-relaxed pr-8">{`import { getNoticeDetail } from "tu-scraper";

const detail = await getNoticeDetail("https://iost.tu.edu.np/notices/14690", "iost");
console.log(detail.content);      // Full body text paragraphs
console.log(detail.images);       // Array of scanned notice photos
console.log(detail.pdfs);         // Array of direct PDF download links
console.log(detail.attachments);  // Structured [{ type, url, filename }]`}</pre>
        </div>
      </section>

      {/* 5. Exported Parser Utilities */}
      <section className="space-y-3">
        <h3 className="text-sm sm:text-base font-semibold flex items-center gap-2 text-purple-400">
          <Code2 className="w-4 h-4 shrink-0" />
          <span>Exported Cheerio Parsers</span>
        </h3>
        <p className={`text-xs sm:text-sm leading-relaxed ${darkMode ? 'text-[#c9d1d9]' : 'text-[#24292f]'}`}>
          Cheerio extraction helpers exported for custom HTML scrapers and headless pipelines:
        </p>

        <div
          className={`rounded-md border p-3 font-mono text-xs leading-relaxed overflow-x-auto ${
            darkMode ? 'bg-[#010409] border-[#30363d] text-[#e6edf3]' : 'bg-[#f6f8fa] border-[#d0d7de] text-[#1f2328]'
          }`}
        >
          <pre className="overflow-x-auto max-w-full text-[11px] sm:text-xs">{`// Extract all unique PDF URLs from a Cheerio container
export function extractPdfs($el: cheerio.Cheerio<any>, baseUrl: string): string[];

// Extract all scanned notice photos/images (filters UI logos & icons)
export function extractImages($el: cheerio.Cheerio<any>, baseUrl: string): string[];

// Extract structured attachments list with file metadata
export function extractAttachments($el: cheerio.Cheerio<any>, baseUrl: string): NoticeAttachment[];`}</pre>
        </div>
      </section>

      {/* 6. Type Definitions */}
      <section className="space-y-3">
        <h3 className="text-sm sm:text-base font-semibold flex items-center gap-2">
          <FileCode className="w-4 h-4 text-blue-500 shrink-0" />
          <span>TypeScript Type Definitions</span>
        </h3>

        <div
          className={`rounded-md border p-3 font-mono text-xs leading-relaxed overflow-x-auto ${
            darkMode ? 'bg-[#010409] border-[#30363d] text-[#e6edf3]' : 'bg-[#f6f8fa] border-[#d0d7de] text-[#1f2328]'
          }`}
        >
          <pre className="overflow-x-auto max-w-full text-[11px] sm:text-xs leading-relaxed">{`export type NoticeSource =
  | 'iost'
  | 'fohss'
  | 'ioe'
  | 'ac'
  | 'iaas'
  | 'iof'
  | 'foe'
  | 'fol';

export type SourceQuery = NoticeSource | 'all';

export interface NoticeAttachment {
  type: 'pdf' | 'image' | 'doc' | 'link';
  url: string;
  filename: string;
  title?: string;
}

export interface Notice {
  id: string;
  title: string;
  source: NoticeSource;
  date?: string;
  url: string;
  pdf?: string;
  pdfs?: string[];
  image?: string;
  images?: string[];
  attachments?: NoticeAttachment[];
}

export interface NoticeDetail extends Notice {
  content?: string;
  nepaliDate?: string;
  englishDate?: string;
  author?: string;
}

export interface ScrapeOptions {
  timeout?: number;
  bypassCache?: boolean;
  userAgent?: string;
  htmlFixture?: string;
}`}</pre>
        </div>
      </section>

      {/* 7. Custom Error Hierarchy */}
      <section className="space-y-3">
        <h3 className="text-sm sm:text-base font-semibold flex items-center gap-2 text-amber-500">
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span>Error Hierarchy</span>
        </h3>

        <div
          className={`rounded-md border p-3 font-mono text-xs leading-relaxed overflow-x-auto ${
            darkMode ? 'bg-[#010409] border-[#30363d] text-[#e6edf3]' : 'bg-[#f6f8fa] border-[#d0d7de] text-[#1f2328]'
          }`}
        >
          <pre className="overflow-x-auto max-w-full text-[11px] sm:text-xs leading-relaxed">{`TuScrapperError (Base Error)
 ├── InvalidSourceError  // Unknown source provided
 ├── NetworkError        // HTTP request failure (404, 500, DNS)
 ├── TimeoutError        // Request exceeded configured timeout
 └── ParseError          // HTML parsing failure`}</pre>
        </div>
      </section>
    </div>
  );
}
