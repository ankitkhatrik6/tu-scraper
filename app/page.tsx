'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Header, MainNavPage } from '@/components/Header';
import { HomePage } from '@/components/HomePage';
import { GuidesPage } from '@/components/GuidesPage';
import { ApiReference } from '@/components/ApiReference';
import { Playground } from '@/components/Playground';
import { SourceRegistry } from '@/components/SourceRegistry';
import { SourceQuery } from '@/src/types';
import {
  Search,
  X,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';

export default function Page() {
  const [darkMode, setDarkMode] = useState(false);
  const [activePage, setActivePage] = useState<MainNavPage>('home');
  const [selectedSourceForPlayground, setSelectedSourceForPlayground] = useState<SourceQuery>('iost');
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Initialize theme from localStorage
  useEffect(() => {
    setIsMounted(true);
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
    } else if (savedTheme === 'light') {
      setDarkMode(false);
    } else if (window.matchMedia) {
      setDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
  }, []);

  // Sync dark class with document element for Tailwind dark utilities
  useEffect(() => {
    if (!isMounted) return;
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode, isMounted]);

  // Keyboard shortcut '/' or 'Cmd+K' to open search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.key === '/' || (e.key === 'k' && (e.metaKey || e.ctrlKey))) &&
        !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)
      ) {
        e.preventDefault();
        setSearchModalOpen(true);
      }
      if (e.key === 'Escape') {
        setSearchModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSelectPage = (page: MainNavPage) => {
    setActivePage(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectSourceForPlayground = (src: SourceQuery) => {
    setSelectedSourceForPlayground(src);
    setActivePage('console');
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const searchItems = [
    {
      title: 'Project Overview & Architecture',
      page: 'home' as MainNavPage,
      category: 'Home',
      desc: 'Introduction, zero-browser architecture, and key capabilities',
    },
    {
      title: 'Installation & Setup (npm, pnpm, yarn, bun)',
      page: 'guides' as MainNavPage,
      category: 'Guides',
      desc: 'How to install and import tu-scraper in your project',
    },
    {
      title: 'Quickstart Walkthrough',
      page: 'guides' as MainNavPage,
      category: 'Guides',
      desc: 'Step-by-step example querying IOST and IOE notices',
    },
    {
      title: 'Scanned Notices & Media Attachments',
      page: 'guides' as MainNavPage,
      category: 'Guides',
      desc: 'Extract JPG, PNG scanned notice papers and embedded PDFs',
    },
    {
      title: 'Production Server Recipes',
      page: 'guides' as MainNavPage,
      category: 'Guides',
      desc: 'Next.js App Router, Express, and Cron integration recipes',
    },
    {
      title: 'Interactive Code Generator',
      page: 'guides' as MainNavPage,
      category: 'Guides',
      desc: 'Generate boilerplate code for TS, ESM, CJS, Bun, Next.js, Express',
    },
    {
      title: 'getNotices(source, options?)',
      page: 'api-reference' as MainNavPage,
      category: 'API Reference',
      desc: 'Scrapes all notices from a faculty or all faculties',
    },
    {
      title: 'getLatest(source, options?)',
      page: 'api-reference' as MainNavPage,
      category: 'API Reference',
      desc: 'Fetches only the single newest published notice',
    },
    {
      title: 'searchNotices(query, source?, options?)',
      page: 'api-reference' as MainNavPage,
      category: 'API Reference',
      desc: 'Case-insensitive substring search across portals',
    },
    {
      title: 'getNoticeDetail(urlOrId, source?, options?)',
      page: 'api-reference' as MainNavPage,
      category: 'API Reference',
      desc: 'Deep extraction for paragraphs, images, PDFs & attachments',
    },
    {
      title: 'Types & Error Hierarchy',
      page: 'api-reference' as MainNavPage,
      category: 'API Reference',
      desc: 'NoticeDetail, NoticeAttachment, TuScrapperError hierarchy',
    },
    {
      title: 'Interactive Live Scraper Console',
      page: 'console' as MainNavPage,
      category: 'Console',
      desc: 'Test real queries, inspect notices, and view media modals',
    },
    {
      title: 'Supported Portals Directory (8 Sources)',
      page: 'portals' as MainNavPage,
      category: 'Portals',
      desc: 'IOST, IOE, IOM, FOHSS, IAAS, IOF, FOE, FOL matrix and verified domains',
    },
  ];

  const filteredSearch = searchItems.filter(
    (i) =>
      i.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      className={`min-h-screen font-sans transition-colors duration-200 ${
        darkMode ? 'dark bg-[#0d1117] text-[#f0f6fc]' : 'bg-[#ffffff] text-[#1f2328]'
      }`}
    >
      {/* GitHub Primer Minimalist Header */}
      <Header
        darkMode={darkMode}
        onToggleTheme={() => setDarkMode(!darkMode)}
        activePage={activePage}
        onSelectPage={handleSelectPage}
        onSearchClick={() => setSearchModalOpen(true)}
        mobileMenuOpen={mobileMenuOpen}
        onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
      />

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Breadcrumb Bar */}
        <div className={`flex items-center gap-1.5 text-xs mb-6 ${darkMode ? 'text-[#8b949e]' : 'text-[#656d76]'}`}>
          <button
            onClick={() => handleSelectPage('home')}
            className={`font-semibold hover:underline transition-colors ${
              darkMode ? 'text-white hover:text-[#58a6ff]' : 'text-[#1f2328] hover:text-[#0969da]'
            }`}
          >
            tu-scraper
          </button>
          <ChevronRight className={`w-3.5 h-3.5 ${darkMode ? 'text-[#8b949e]' : 'text-neutral-400'}`} />
          <span className={`font-bold capitalize ${darkMode ? 'text-white' : 'text-[#1f2328]'}`}>
            {activePage === 'home' && 'Project Home'}
            {activePage === 'guides' && 'Guides'}
            {activePage === 'api-reference' && 'API Reference'}
            {activePage === 'console' && 'Interactive Console'}
            {activePage === 'portals' && 'Supported Portals'}
          </span>
        </div>

        {/* 1. Home Page */}
        {activePage === 'home' && (
          <HomePage
            darkMode={darkMode}
            onNavigateTab={handleSelectPage}
            onSelectPortalConsole={handleSelectSourceForPlayground}
          />
        )}

        {/* 2. Guides Page */}
        {activePage === 'guides' && (
          <GuidesPage
            darkMode={darkMode}
            onNavigateTab={handleSelectPage}
          />
        )}

        {/* 3. API Reference Page */}
        {activePage === 'api-reference' && (
          <ApiReference darkMode={darkMode} />
        )}

        {/* 4. Console Page */}
        {activePage === 'console' && (
          <Playground
            darkMode={darkMode}
            initialSource={selectedSourceForPlayground}
          />
        )}

        {/* 5. Portals Page */}
        {activePage === 'portals' && (
          <SourceRegistry
            darkMode={darkMode}
            onSelectForPlayground={handleSelectSourceForPlayground}
          />
        )}
      </div>

      {/* Quick Search Modal */}
      {searchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/60 backdrop-blur-xs">
          <div
            className={`w-full max-w-xl rounded-lg border shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-100 ${
              darkMode
                ? 'bg-[#161b22] border-[#30363d] text-[#e6edf3]'
                : 'bg-white border-[#d0d7de] text-[#1f2328]'
            }`}
          >
            <div className="flex items-center px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
              <Search className="w-4 h-4 text-neutral-400 mr-2 shrink-0" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search documentation, API methods, guides, portals..."
                className="w-full text-xs sm:text-sm bg-transparent border-none outline-none focus:ring-0"
              />
              <button
                onClick={() => setSearchModalOpen(false)}
                className="p-1 rounded text-neutral-400 hover:text-neutral-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto divide-y divide-neutral-200 dark:divide-neutral-800 text-xs">
              {filteredSearch.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    handleSelectPage(item.page);
                    setSearchModalOpen(false);
                  }}
                  className={`p-3.5 cursor-pointer transition-colors ${
                    darkMode ? 'hover:bg-[#21262d]' : 'hover:bg-[#f6f8fa]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-blue-500">{item.title}</div>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                        darkMode ? 'bg-[#21262d] text-[#7d8590]' : 'bg-[#f6f8fa] text-[#656d76]'
                      }`}
                    >
                      {item.category}
                    </span>
                  </div>
                  <div className={`text-[11px] mt-0.5 ${darkMode ? 'text-[#7d8590]' : 'text-[#656d76]'}`}>
                    {item.desc}
                  </div>
                </div>
              ))}
              {filteredSearch.length === 0 && (
                <div className="p-6 text-center text-xs text-neutral-400">
                  No matching items for &quot;{searchQuery}&quot;
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer
        className={`border-t py-8 text-xs transition-colors ${
          darkMode
            ? 'bg-[#0d1117] border-[#30363d] text-[#8b949e]'
            : 'bg-[#f6f8fa] border-[#d0d7de] text-[#656d76]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <Image
              src="/logo.png"
              alt="Logo"
              width={22}
              height={22}
              className="w-5.5 h-5.5 object-contain shrink-0"
              referrerPolicy="no-referrer"
            />
            <span className={`font-medium ${darkMode ? 'text-[#c9d1d9]' : 'text-[#1f2328]'}`}>
              tu-scraper • Released under MIT
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={() => handleSelectPage('home')} className="hover:underline">
              Home
            </button>
            <button onClick={() => handleSelectPage('guides')} className="hover:underline">
              Guides
            </button>
            <button onClick={() => handleSelectPage('api-reference')} className="hover:underline">
              API Reference
            </button>
            <button onClick={() => handleSelectPage('console')} className="hover:underline">
              Console
            </button>
            <button onClick={() => handleSelectPage('portals')} className="hover:underline">
              Portals
            </button>
            <a
              href="https://github.com/ankitkhatrik6/tu-scraper"
              target="_blank"
              rel="noreferrer"
              className="hover:underline flex items-center gap-1"
            >
              <span>GitHub</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
