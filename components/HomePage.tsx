'use client';

import React, { useState } from 'react';
import {
  BookOpen,
  Copy,
  Check,
  ExternalLink,
  Shield,
  FileCode,
  Terminal,
  CheckCircle2,
  ArrowRight,
  Code2,
  Paperclip,
  Zap,
  Info,
  Server,
  Layers,
  Building2,
  Play,
  Cpu,
  Clock,
  Search,
} from 'lucide-react';
import { SOURCE_METADATA } from '@/src/index';
import { SourceQuery } from '@/src/types';

interface HomePageProps {
  darkMode: boolean;
  onNavigateTab: (tab: 'home' | 'guides' | 'api-reference' | 'console' | 'portals') => void;
  onSelectPortalConsole?: (source: SourceQuery) => void;
}

export function HomePage({ darkMode, onNavigateTab, onSelectPortalConsole }: HomePageProps) {
  const [pkgManager, setPkgManager] = useState<'npm' | 'pnpm' | 'yarn' | 'bun'>('npm');
  const [copiedCmd, setCopiedCmd] = useState(false);
  const [copiedSnippet, setCopiedSnippet] = useState(false);

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

  const copyInstall = () => {
    navigator.clipboard.writeText(getInstallCmd());
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  const quickStartSnippet = `import { getNotices, getLatest, getNoticeDetail } from 'tu-scraper';

// 1. Fetch recent notices from IOST (Science & Technology)
const notices = await getNotices('iost', { timeout: 8000 });
console.log(\`Fetched \${notices.length} notices from IOST\`);

// 2. Fetch single newest notice from Engineering (IOE)
const latestIOE = await getLatest('ioe');
console.log('Latest notice:', latestIOE.title);

// 3. Extract deep body text, scanned images, and PDF attachments
if (notices[0]) {
  const detail = await getNoticeDetail(notices[0].url, 'iost');
  console.log('PDFs:', detail.attachments?.filter(a => a.type === 'pdf'));
  console.log('Images:', detail.attachments?.filter(a => a.type === 'image'));
}`;

  const copyQuickStart = () => {
    navigator.clipboard.writeText(quickStartSnippet);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  return (
    <div id="home-page" className="space-y-12 max-w-5xl mx-auto w-full font-sans pb-16">
      {/* Hero / Introduction */}
      <section className="space-y-4 pt-2">
        <h1 className={`text-3xl sm:text-4xl font-bold tracking-tight ${darkMode ? 'text-white' : 'text-[#1f2328]'}`}>
          Tribhuvan University Notice Scraper
        </h1>

        <p
          className={`text-base sm:text-lg leading-relaxed ${
            darkMode ? 'text-[#c9d1d9]' : 'text-[#656d76]'
          }`}
        >
          A fast, resilient, and fully type-safe TypeScript scraper engine built specifically for
          official Tribhuvan University administrative portals across 8 faculties and institutes.
        </p>

        {/* Primary CTA Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={() => onNavigateTab('guides')}
            className="px-4 py-2 bg-[#1f883d] hover:bg-[#1a7f37] text-white text-xs font-semibold rounded-md transition-colors flex items-center gap-2 shadow-xs"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Read Guides</span>
          </button>

          <button
            onClick={() => onNavigateTab('api-reference')}
            className={`px-4 py-2 border text-xs font-semibold rounded-md transition-colors flex items-center gap-2 ${
              darkMode
                ? 'bg-[#21262d] border-[#30363d] text-[#c9d1d9] hover:bg-[#30363d]'
                : 'bg-[#f6f8fa] border-[#d0d7de] text-[#24292f] hover:bg-[#eaeef2]'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>API Reference</span>
          </button>

          <button
            onClick={() => onNavigateTab('console')}
            className={`px-4 py-2 border text-xs font-semibold rounded-md transition-colors flex items-center gap-2 ${
              darkMode
                ? 'bg-[#21262d] border-[#30363d] text-[#c9d1d9] hover:bg-[#30363d]'
                : 'bg-[#f6f8fa] border-[#d0d7de] text-[#24292f] hover:bg-[#eaeef2]'
            }`}
          >
            <Play className="w-3.5 h-3.5 text-blue-500 fill-current" />
            <span>Live Console</span>
          </button>

          <button
            onClick={() => onNavigateTab('portals')}
            className={`px-4 py-2 border text-xs font-semibold rounded-md transition-colors flex items-center gap-2 ${
              darkMode
                ? 'bg-[#21262d] border-[#30363d] text-[#c9d1d9] hover:bg-[#30363d]'
                : 'bg-[#f6f8fa] border-[#d0d7de] text-[#24292f] hover:bg-[#eaeef2]'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>View 8 Portals</span>
          </button>
        </div>
      </section>

      {/* GitHub Note Callout */}
      <div
        className={`p-4 rounded-md border-l-4 text-xs sm:text-sm leading-relaxed ${
          darkMode
            ? 'bg-[#161b22] border-l-[#58a6ff] border-[#30363d] text-[#c9d1d9]'
            : 'bg-[#f6f8fa] border-l-[#0969da] border-[#d0d7de] text-[#1f2328]'
        }`}
      >
        <div className="flex items-center gap-2 font-semibold text-[#0969da] dark:text-[#58a6ff] mb-1">
          <Info className="w-4 h-4" />
          <span>Note: Official tu.edu.np Sources Only</span>
        </div>
        <p>
          All scrapers query only verified Tribhuvan University administrative domains
          (<code className="font-mono text-xs">iost.tu.edu.np</code>, <code className="font-mono text-xs">ioe.tu.edu.np</code>, <code className="font-mono text-xs">iom.tu.edu.np</code>, etc.).
          No third-party blogs or unverified aggregators are queried.
        </p>
      </div>

      {/* Installation Snippet */}
      <section className="space-y-3">
        <h2 className={`text-base sm:text-lg font-semibold tracking-tight ${darkMode ? 'text-white' : 'text-[#1f2328]'}`}>
          Installation
        </h2>
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
            <div className="flex items-center gap-1.5">
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
              onClick={copyInstall}
              className={`flex items-center gap-1.5 text-xs px-2 py-1 rounded transition-colors ${
                darkMode ? 'hover:bg-[#21262d] text-[#c9d1d9]' : 'hover:bg-[#f6f8fa] text-[#24292f]'
              }`}
            >
              {copiedCmd ? (
                <>
                  <Check className="w-3.5 h-3.5 text-green-500" />
                  <span className="text-green-500 text-[11px]">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-neutral-400" />
                  <span className="text-[11px]">Copy</span>
                </>
              )}
            </button>
          </div>
          <div className="p-3.5 font-mono text-xs overflow-x-auto text-[#0969da] dark:text-[#58a6ff]">
            <code>{getInstallCmd()}</code>
          </div>
        </div>
      </section>

      {/* Quickstart Code Block */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className={`text-base sm:text-lg font-semibold tracking-tight ${darkMode ? 'text-white' : 'text-[#1f2328]'}`}>
            Quick Start Example
          </h2>
          <button
            onClick={copyQuickStart}
            className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded border transition-colors ${
              darkMode
                ? 'bg-[#161b22] border-[#30363d] text-[#c9d1d9] hover:bg-[#21262d]'
                : 'bg-white border-[#d0d7de] text-[#24292f] hover:bg-[#f3f4f6]'
            }`}
          >
            {copiedSnippet ? (
              <Check className="w-3.5 h-3.5 text-green-500" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-neutral-400" />
            )}
            <span>{copiedSnippet ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        <div
          className={`rounded-md border p-4 font-mono text-xs overflow-x-auto leading-relaxed ${
            darkMode ? 'bg-[#0d1117] border-[#30363d] text-[#e6edf3]' : 'bg-[#f6f8fa] border-[#d0d7de] text-[#24292f]'
          }`}
        >
          <pre>{quickStartSnippet}</pre>
        </div>
      </section>

      {/* Project Architecture & Engineering Highlights */}
      <section className="space-y-4">
        <h2 className={`text-base sm:text-lg font-semibold tracking-tight ${darkMode ? 'text-white' : 'text-[#1f2328]'}`}>
          Design & Architecture
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            className={`p-4 rounded-md border space-y-2 ${
              darkMode ? 'bg-[#161b22] border-[#30363d]' : 'bg-[#f6f8fa] border-[#d0d7de]'
            }`}
          >
            <div className="flex items-center gap-2 font-semibold text-xs text-blue-500">
              <Cpu className="w-4 h-4" />
              <span>Zero Browser Overhead (No Puppeteer/Chromium)</span>
            </div>
            <p className={`text-xs leading-relaxed ${darkMode ? 'text-[#c9d1d9]' : 'text-[#656d76]'}`}>
              Built on Node.js native fetch and cheerio HTML parser. Runs in lightweight serverless
              functions, Edge runtimes, Docker containers, or background cron workers without heavy
              headless browser binaries.
            </p>
          </div>

          <div
            className={`p-4 rounded-md border space-y-2 ${
              darkMode ? 'bg-[#161b22] border-[#30363d]' : 'bg-[#f6f8fa] border-[#d0d7de]'
            }`}
          >
            <div className="flex items-center gap-2 font-semibold text-xs text-emerald-500">
              <Paperclip className="w-4 h-4" />
              <span>Deep Attachment & Scanned Notice Extraction</span>
            </div>
            <p className={`text-xs leading-relaxed ${darkMode ? 'text-[#c9d1d9]' : 'text-[#656d76]'}`}>
              Many TU notices are published as scanned JPG/PNG images or embedded PDFs. The parser
              extracts every attachment, resolves relative URLs to absolute CDN links, and classifies
              them by MIME type.
            </p>
          </div>

          <div
            className={`p-4 rounded-md border space-y-2 ${
              darkMode ? 'bg-[#161b22] border-[#30363d]' : 'bg-[#f6f8fa] border-[#d0d7de]'
            }`}
          >
            <div className="flex items-center gap-2 font-semibold text-xs text-purple-500">
              <Shield className="w-4 h-4" />
              <span>Typed Error Hierarchy</span>
            </div>
            <p className={`text-xs leading-relaxed ${darkMode ? 'text-[#c9d1d9]' : 'text-[#656d76]'}`}>
              Structured error classes including <code className="font-mono text-[11px]">InvalidSourceError</code>,{' '}
              <code className="font-mono text-[11px]">NetworkError</code>,{' '}
              <code className="font-mono text-[11px]">RateLimitError</code>, and{' '}
              <code className="font-mono text-[11px]">ParserError</code> allow programmatic handling.
            </p>
          </div>

          <div
            className={`p-4 rounded-md border space-y-2 ${
              darkMode ? 'bg-[#161b22] border-[#30363d]' : 'bg-[#f6f8fa] border-[#d0d7de]'
            }`}
          >
            <div className="flex items-center gap-2 font-semibold text-xs text-amber-500">
              <Clock className="w-4 h-4" />
              <span>In-Memory TTL Caching & Concurrency Control</span>
            </div>
            <p className={`text-xs leading-relaxed ${darkMode ? 'text-[#c9d1d9]' : 'text-[#656d76]'}`}>
              Built-in memory cache minimizes redundant requests to university servers while
              configurable concurrency limits prevent rate-limiting when querying &apos;all&apos; sources.
            </p>
          </div>
        </div>
      </section>

      {/* Navigation Cards Grid */}
      <section className="space-y-4">
        <h2 className={`text-base sm:text-lg font-semibold tracking-tight ${darkMode ? 'text-white' : 'text-[#1f2328]'}`}>
          Documentation Sections
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <button
            onClick={() => onNavigateTab('guides')}
            className={`p-4 rounded-md border text-left transition-all hover:border-blue-500 ${
              darkMode ? 'bg-[#161b22] border-[#30363d]' : 'bg-white border-[#d0d7de]'
            }`}
          >
            <div className="flex items-center justify-between font-semibold text-xs text-blue-500">
              <div className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" />
                <span>Guides</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
            <p className={`text-[11px] mt-2 ${darkMode ? 'text-[#c9d1d9]' : 'text-[#656d76]'}`}>
              Step-by-step installation, attachment parsing, error handling, and server recipes.
            </p>
          </button>

          <button
            onClick={() => onNavigateTab('api-reference')}
            className={`p-4 rounded-md border text-left transition-all hover:border-blue-500 ${
              darkMode ? 'bg-[#161b22] border-[#30363d]' : 'bg-white border-[#d0d7de]'
            }`}
          >
            <div className="flex items-center justify-between font-semibold text-xs text-blue-500">
              <div className="flex items-center gap-1.5">
                <Code2 className="w-4 h-4" />
                <span>API Reference</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
            <p className={`text-[11px] mt-2 ${darkMode ? 'text-[#c9d1d9]' : 'text-[#656d76]'}`}>
              Complete typed method signatures, arguments, return schemas, and error types.
            </p>
          </button>

          <button
            onClick={() => onNavigateTab('console')}
            className={`p-4 rounded-md border text-left transition-all hover:border-blue-500 ${
              darkMode ? 'bg-[#161b22] border-[#30363d]' : 'bg-white border-[#d0d7de]'
            }`}
          >
            <div className="flex items-center justify-between font-semibold text-xs text-blue-500">
              <div className="flex items-center gap-1.5">
                <Play className="w-4 h-4 fill-current" />
                <span>Console</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
            <p className={`text-[11px] mt-2 ${darkMode ? 'text-[#c9d1d9]' : 'text-[#656d76]'}`}>
              Interactive query playground with raw JSON inspection and notice detail modal.
            </p>
          </button>

          <button
            onClick={() => onNavigateTab('portals')}
            className={`p-4 rounded-md border text-left transition-all hover:border-blue-500 ${
              darkMode ? 'bg-[#161b22] border-[#30363d]' : 'bg-white border-[#d0d7de]'
            }`}
          >
            <div className="flex items-center justify-between font-semibold text-xs text-blue-500">
              <div className="flex items-center gap-1.5">
                <Building2 className="w-4 h-4" />
                <span>Portals</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
            <p className={`text-[11px] mt-2 ${darkMode ? 'text-[#c9d1d9]' : 'text-[#656d76]'}`}>
              Verified directory and domain matrix across all 8 Tribhuvan University institutions.
            </p>
          </button>
        </div>
      </section>

      {/* Supported Portals Quick Table */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className={`text-base sm:text-lg font-semibold tracking-tight ${darkMode ? 'text-white' : 'text-[#1f2328]'}`}>
            Supported Faculties & Institutions
          </h2>
          <button
            onClick={() => onNavigateTab('portals')}
            className="text-xs text-blue-500 hover:underline flex items-center gap-1"
          >
            <span>View Directory</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div
          className={`rounded-md border overflow-x-auto text-xs ${
            darkMode ? 'bg-[#0d1117] border-[#30363d]' : 'bg-white border-[#d0d7de]'
          }`}
        >
          <table className="w-full min-w-[540px] text-left">
            <thead
              className={`border-b ${
                darkMode ? 'bg-[#161b22] text-[#c9d1d9]' : 'bg-[#f6f8fa] text-[#656d76]'
              }`}
            >
              <tr>
                <th className="px-3.5 py-2 font-semibold">Source Key</th>
                <th className="px-3.5 py-2 font-semibold">Institution Name</th>
                <th className="px-3.5 py-2 font-semibold">Category</th>
                <th className="px-3.5 py-2 font-semibold">Official Domain</th>
                <th className="px-3.5 py-2 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800 font-mono text-[11px]">
              {Object.values(SOURCE_METADATA).map((src) => (
                <tr
                  key={src.id}
                  className={`transition-colors ${
                    darkMode ? 'hover:bg-[#161b22]' : 'hover:bg-[#f6f8fa]'
                  }`}
                >
                  <td className="px-3.5 py-2.5 text-blue-500 font-bold">&quot;{src.id}&quot;</td>
                  <td className={`px-3.5 py-2.5 font-sans font-medium ${darkMode ? 'text-white' : 'text-neutral-900'}`}>
                    {src.name}
                  </td>
                  <td className="px-3.5 py-2.5 font-sans">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-semibold ${
                        src.category === 'Institute'
                          ? 'bg-blue-500/10 text-blue-500'
                          : 'bg-emerald-500/10 text-emerald-500'
                      }`}
                    >
                      {src.category}
                    </span>
                  </td>
                  <td className={`px-3.5 py-2.5 font-mono ${darkMode ? 'text-[#8b949e]' : 'text-neutral-400'}`}>
                    {src.baseUrl.replace('https://', '')}
                  </td>
                  <td className="px-3.5 py-2.5 text-right font-sans">
                    <button
                      onClick={() => {
                        onNavigateTab('console');
                        if (onSelectPortalConsole) onSelectPortalConsole(src.id);
                      }}
                      className="text-xs text-blue-500 hover:underline font-medium"
                    >
                      Test in Console
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
