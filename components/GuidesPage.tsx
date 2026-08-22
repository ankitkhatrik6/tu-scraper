'use client';

import React, { useState } from 'react';
import {
  BookOpen,
  Terminal,
  Code2,
  Paperclip,
  Shield,
  Server,
  Zap,
  Copy,
  Check,
  ExternalLink,
  ChevronRight,
  Info,
  Layers,
  Clock,
} from 'lucide-react';
import { CodeGenerator } from './CodeGenerator';

interface GuidesPageProps {
  darkMode: boolean;
  onNavigateTab: (tab: 'home' | 'guides' | 'api-reference' | 'console' | 'portals') => void;
}

type GuideSection =
  | 'installation'
  | 'quickstart'
  | 'sources'
  | 'attachments'
  | 'error-handling'
  | 'production-recipes'
  | 'code-generator';

export function GuidesPage({ darkMode, onNavigateTab }: GuidesPageProps) {
  const [activeSection, setActiveSection] = useState<GuideSection>('installation');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [pkgManager, setPkgManager] = useState<'npm' | 'pnpm' | 'yarn' | 'bun'>('npm');

  const copySnippet = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const getInstallCmd = () => {
    switch (pkgManager) {
      case 'npm':
        return 'npm install tu-scraper';
      case 'pnpm':
        return 'pnpm add tu-scraper';
      case 'yarn':
        return 'yarn add tu-scraper';
      case 'bun':
        return 'bun add tu-scraper';
    }
  };

  const guideNav = [
    { id: 'installation' as GuideSection, label: 'Installation & Setup', icon: Terminal },
    { id: 'quickstart' as GuideSection, label: 'Quickstart Walkthrough', icon: BookOpen },
    { id: 'sources' as GuideSection, label: 'Querying Sources & Faculties', icon: Layers },
    { id: 'attachments' as GuideSection, label: 'Scanned Notices & Attachments', icon: Paperclip },
    { id: 'error-handling' as GuideSection, label: 'Error Handling & Resilience', icon: Shield },
    { id: 'production-recipes' as GuideSection, label: 'Production Server Recipes', icon: Server },
    { id: 'code-generator' as GuideSection, label: 'Interactive Code Generator', icon: Zap },
  ];

  return (
    <div id="guides-page" className="max-w-6xl mx-auto w-full font-sans pb-16">
      {/* Mobile Horizontal Sub-Navigation Bar */}
      <div className="md:hidden mb-6">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-2 px-1">
          Guides Topic
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          {guideNav.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors border ${
                  isActive
                    ? darkMode
                      ? 'bg-[#21262d] border-[#8b949e] text-white font-semibold'
                      : 'bg-[#eff1f3] border-[#d0d7de] text-[#1f2328] font-semibold shadow-xs'
                    : darkMode
                    ? 'border-[#30363d] text-[#7d8590] hover:text-[#e6edf3] hover:bg-[#161b22]'
                    : 'border-[#d0d7de] text-[#656d76] hover:text-[#1f2328] hover:bg-[#f6f8fa]'
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Desktop Left Sub-nav */}
        <aside className="hidden md:block w-56 shrink-0">
          <div className="sticky top-20 space-y-4">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-2 px-2">
                Guides
              </div>
              <nav className="space-y-0.5">
                {guideNav.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs font-medium text-left transition-colors ${
                        isActive
                          ? darkMode
                            ? 'bg-[#21262d] text-white font-semibold'
                            : 'bg-[#eff1f3] text-[#1f2328] font-semibold'
                          : darkMode
                          ? 'text-[#7d8590] hover:text-[#e6edf3] hover:bg-[#161b22]'
                          : 'text-[#656d76] hover:text-[#1f2328] hover:bg-[#f6f8fa]'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800 px-2">
              <button
                onClick={() => onNavigateTab('api-reference')}
                className="text-xs text-blue-500 hover:underline flex items-center gap-1"
              >
                <span>Go to API Reference</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </aside>

        {/* Right Content */}
        <main className="flex-1 min-w-0 space-y-8">
          {/* 1. Installation */}
          {activeSection === 'installation' && (
            <div className="space-y-6">
              <div>
                <h1 className={`text-2xl font-bold tracking-tight mb-2 ${darkMode ? 'text-white' : 'text-[#1f2328]'}`}>
                  Installation & Setup
                </h1>
                <p className={`text-sm ${darkMode ? 'text-[#c9d1d9]' : 'text-[#656d76]'}`}>
                  How to install and configure <code className="font-mono text-xs">tu-scraper</code> in your Node.js, TypeScript, Next.js, or Bun application.
                </p>
              </div>

              {/* Package Manager Selector */}
              <div
                className={`rounded-md border overflow-hidden ${
                  darkMode ? 'bg-[#0d1117] border-[#30363d]' : 'bg-[#f6f8fa] border-[#d0d7de]'
                }`}
              >
                <div
                  className={`flex items-center justify-between px-3 py-1.5 border-b text-xs ${
                    darkMode ? 'bg-[#161b22] border-[#30363d]' : 'bg-white border-[#d0d7de]'
                  }`}
                >
                  <div className="flex items-center gap-1">
                    {(['npm', 'pnpm', 'yarn', 'bun'] as const).map((m) => (
                      <button
                        key={m}
                        onClick={() => setPkgManager(m)}
                        className={`font-mono text-xs px-2 py-0.5 rounded transition-colors ${
                          pkgManager === m
                            ? darkMode
                              ? 'bg-[#21262d] text-white font-bold'
                              : 'bg-[#eff1f3] text-[#1f2328] font-bold border border-[#d0d7de]'
                            : 'text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200'
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => copySnippet('inst', getInstallCmd())}
                    className={`text-xs flex items-center gap-1 ${
                      darkMode ? 'text-[#c9d1d9] hover:text-white' : 'text-neutral-500 hover:text-neutral-900'
                    }`}
                  >
                    {copiedCode === 'inst' ? (
                      <Check className="w-3.5 h-3.5 text-green-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{copiedCode === 'inst' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="p-3.5 font-mono text-xs text-[#0969da] dark:text-[#58a6ff]">
                  <code>{getInstallCmd()}</code>
                </div>
              </div>

              {/* System Requirements */}
              <div className="space-y-2">
                <h3 className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-[#1f2328]'}`}>
                  Requirements
                </h3>
                <ul className={`list-disc list-inside text-xs space-y-1 ${darkMode ? 'text-[#c9d1d9]' : 'text-[#656d76]'}`}>
                  <li>Node.js 18.0.0 or later (Native global fetch support)</li>
                  <li>TypeScript 4.8+ recommended for type inference</li>
                  <li>Bun 1.0+ and Deno 1.30+ supported natively</li>
                </ul>
              </div>

              {/* Import Syntax */}
              <div className="space-y-2">
                <h3 className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-[#1f2328]'}`}>
                  Module Imports
                </h3>
                <div
                  className={`rounded-md border p-3.5 font-mono text-xs overflow-x-auto ${
                    darkMode ? 'bg-[#0d1117] border-[#30363d] text-[#e6edf3]' : 'bg-[#f6f8fa] border-[#d0d7de] text-[#24292f]'
                  }`}
                >
                  <pre>{`// ESM / TypeScript
import { getNotices, getLatest, searchNotices, getNoticeDetail } from 'tu-scraper';

// CommonJS (CJS)
const { getNotices, getLatest, searchNotices, getNoticeDetail } = require('tu-scraper');`}</pre>
                </div>
              </div>
            </div>
          )}

          {/* 2. Quickstart */}
          {activeSection === 'quickstart' && (
            <div className="space-y-6">
              <div>
                <h1 className={`text-2xl font-bold tracking-tight mb-2 ${darkMode ? 'text-white' : 'text-[#1f2328]'}`}>
                  Quickstart Walkthrough
                </h1>
                <p className={`text-sm ${darkMode ? 'text-[#c9d1d9]' : 'text-[#656d76]'}`}>
                  Learn the foundational workflow to query notices, search keywords, and extract media attachments.
                </p>
              </div>

              {/* Step 1 */}
              <div className="space-y-2">
                <h3 className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-[#1f2328]'}`}>
                  1. Fetching Notices from a Faculty
                </h3>
                <p className={`text-xs ${darkMode ? 'text-[#c9d1d9]' : 'text-[#656d76]'}`}>
                  Call <code className="font-mono text-[11px]">getNotices(source)</code> with any of the 8 supported source identifiers (e.g. &apos;iost&apos;, &apos;ioe&apos;, &apos;fohss&apos;).
                </p>
                <div
                  className={`rounded-md border p-3.5 font-mono text-xs overflow-x-auto ${
                    darkMode ? 'bg-[#0d1117] border-[#30363d] text-[#e6edf3]' : 'bg-[#f6f8fa] border-[#d0d7de]'
                  }`}
                >
                  <pre>{`import { getNotices } from 'tu-scraper';

const notices = await getNotices('iost');
console.log(\`Received \${notices.length} notices:\`);

for (const notice of notices) {
  console.log(\`[\${notice.publishedDate || 'N/A'}] \${notice.title}\`);
  console.log(\`URL: \${notice.url}\`);
}`}</pre>
                </div>
              </div>

              {/* Step 2 */}
              <div className="space-y-2">
                <h3 className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-[#1f2328]'}`}>
                  2. Keyword Search
                </h3>
                <p className={`text-xs ${darkMode ? 'text-[#c9d1d9]' : 'text-[#656d76]'}`}>
                  Filter notices across a faculty portal or across all faculties at once using <code className="font-mono text-[11px]">searchNotices()</code>.
                </p>
                <div
                  className={`rounded-md border p-3.5 font-mono text-xs overflow-x-auto ${
                    darkMode ? 'bg-[#0d1117] border-[#30363d] text-[#e6edf3]' : 'bg-[#f6f8fa] border-[#d0d7de]'
                  }`}
                >
                  <pre>{`import { searchNotices } from 'tu-scraper';

// Search IOE portal for exam routines
const examNotices = await searchNotices('routine', 'ioe');

// Search all 8 TU faculties simultaneously
const allScholarships = await searchNotices('scholarship', 'all');`}</pre>
                </div>
              </div>
            </div>
          )}

          {/* 3. Querying Sources */}
          {activeSection === 'sources' && (
            <div className="space-y-6">
              <div>
                <h1 className={`text-2xl font-bold tracking-tight mb-2 ${darkMode ? 'text-white' : 'text-[#1f2328]'}`}>
                  Querying Sources & Faculties
                </h1>
                <p className={`text-sm ${darkMode ? 'text-[#c9d1d9]' : 'text-[#656d76]'}`}>
                  Understanding single-source versus aggregated queries, caching mechanisms, and concurrency options.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-[#1f2328]'}`}>
                  Single Source vs Aggregated (&apos;all&apos;)
                </h3>
                <p className={`text-xs ${darkMode ? 'text-[#c9d1d9]' : 'text-[#656d76]'}`}>
                  When passing <code className="font-mono text-[11px]">&apos;all&apos;</code>, the scraper dispatches concurrent requests across all 8 portals with bounded concurrency to prevent throttling.
                </p>
                <div
                  className={`rounded-md border p-3.5 font-mono text-xs overflow-x-auto ${
                    darkMode ? 'bg-[#0d1117] border-[#30363d]' : 'bg-[#f6f8fa] border-[#d0d7de]'
                  }`}
                >
                  <pre>{`import { getNotices } from 'tu-scraper';

// Fetches from all 8 portals concurrently
const allNotices = await getNotices('all', {
  concurrency: 4, // Max concurrent requests
  timeout: 10000, // 10 second timeout per source
  bypassCache: false, // Uses in-memory cache
});`}</pre>
                </div>
              </div>
            </div>
          )}

          {/* 4. Scanned Notices & Attachments */}
          {activeSection === 'attachments' && (
            <div className="space-y-6">
              <div>
                <h1 className={`text-2xl font-bold tracking-tight mb-2 ${darkMode ? 'text-white' : 'text-[#1f2328]'}`}>
                  Scanned Notices & Attachments
                </h1>
                <p className={`text-sm ${darkMode ? 'text-[#c9d1d9]' : 'text-[#656d76]'}`}>
                  Tribhuvan University notices are frequently published as scanned physical paper documents (JPEG, PNG) or uploaded PDF attachments.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-[#1f2328]'}`}>
                  Deep Detail & Image URL Resolution
                </h3>
                <p className={`text-xs ${darkMode ? 'text-[#c9d1d9]' : 'text-[#656d76]'}`}>
                  Use <code className="font-mono text-[11px]">getNoticeDetail(url, source)</code> to extract full content body, download links, and scanned image attachments.
                </p>
                <div
                  className={`rounded-md border p-3.5 font-mono text-xs overflow-x-auto ${
                    darkMode ? 'bg-[#0d1117] border-[#30363d]' : 'bg-[#f6f8fa] border-[#d0d7de]'
                  }`}
                >
                  <pre>{`import { getNoticeDetail } from 'tu-scraper';

const detail = await getNoticeDetail('https://iost.tu.edu.np/notices/14690', 'iost');

console.log('Title:', detail.title);
console.log('Body Text:', detail.content);

// Attachments list with resolved CDN URLs
detail.attachments?.forEach((att) => {
  console.log(\`File: \${att.filename} [\${att.type}] -> \${att.url}\`);
});`}</pre>
                </div>
              </div>
            </div>
          )}

          {/* 5. Error Handling */}
          {activeSection === 'error-handling' && (
            <div className="space-y-6">
              <div>
                <h1 className={`text-2xl font-bold tracking-tight mb-2 ${darkMode ? 'text-white' : 'text-[#1f2328]'}`}>
                  Error Handling & Resilience
                </h1>
                <p className={`text-sm ${darkMode ? 'text-[#c9d1d9]' : 'text-[#656d76]'}`}>
                  Handle network drops, server timeouts, and invalid source parameters safely.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-[#1f2328]'}`}>
                  Try / Catch with Custom Error Classes
                </h3>
                <div
                  className={`rounded-md border p-3.5 font-mono text-xs overflow-x-auto ${
                    darkMode ? 'bg-[#0d1117] border-[#30363d]' : 'bg-[#f6f8fa] border-[#d0d7de]'
                  }`}
                >
                  <pre>{`import { getNotices, InvalidSourceError, NetworkError, TuScrapperError } from 'tu-scraper';

try {
  const notices = await getNotices('iost', { timeout: 5000 });
} catch (error) {
  if (error instanceof InvalidSourceError) {
    console.error('Specified source key does not exist:', error.message);
  } else if (error instanceof NetworkError) {
    console.error('TU server timed out or unreachable:', error.statusCode);
  } else if (error instanceof TuScrapperError) {
    console.error('Scraper engine error:', error.message);
  }
}`}</pre>
                </div>
              </div>
            </div>
          )}

          {/* 6. Production Recipes */}
          {activeSection === 'production-recipes' && (
            <div className="space-y-6">
              <div>
                <h1 className={`text-2xl font-bold tracking-tight mb-2 ${darkMode ? 'text-white' : 'text-[#1f2328]'}`}>
                  Production Server Recipes
                </h1>
                <p className={`text-sm ${darkMode ? 'text-[#c9d1d9]' : 'text-[#656d76]'}`}>
                  Ready-to-use patterns for Next.js App Router, Express.js microservices, and Cron notification workers.
                </p>
              </div>

              {/* Recipe 1: Next.js App Router */}
              <div className="space-y-2">
                <h3 className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-[#1f2328]'}`}>
                  Next.js App Router API Route (app/api/notices/route.ts)
                </h3>
                <div
                  className={`rounded-md border p-3.5 font-mono text-xs overflow-x-auto ${
                    darkMode ? 'bg-[#0d1117] border-[#30363d]' : 'bg-[#f6f8fa] border-[#d0d7de]'
                  }`}
                >
                  <pre>{`import { NextRequest, NextResponse } from 'next/server';
import { getNotices, isValidSource, NoticeSource } from 'tu-scraper';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const source = searchParams.get('source') || 'iost';

  if (!isValidSource(source) && source !== 'all') {
    return NextResponse.json({ error: 'Invalid source' }, { status: 400 });
  }

  const data = await getNotices(source as NoticeSource);
  return NextResponse.json({ success: true, count: data.length, data });
}`}</pre>
                </div>
              </div>
            </div>
          )}

          {/* 7. Code Generator */}
          {activeSection === 'code-generator' && (
            <div className="space-y-6">
              <div>
                <h1 className={`text-2xl font-bold tracking-tight mb-2 ${darkMode ? 'text-white' : 'text-[#1f2328]'}`}>
                  Interactive Code Generator
                </h1>
                <p className={`text-sm ${darkMode ? 'text-[#c9d1d9]' : 'text-[#656d76]'}`}>
                  Generate drop-in boilerplate for your exact stack, framework, and target faculty.
                </p>
              </div>
              <CodeGenerator darkMode={darkMode} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
