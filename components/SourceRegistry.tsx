'use client';

import React, { useState } from 'react';
import {
  ExternalLink,
  Play,
  CheckCircle2,
  Building2,
  Search,
} from 'lucide-react';
import { NoticeSource, SourceQuery } from '@/src/types';
import { SOURCE_METADATA } from '@/src/index';

interface SourceRegistryProps {
  darkMode: boolean;
  onSelectForPlayground: (source: SourceQuery) => void;
}

export function SourceRegistry({ darkMode, onSelectForPlayground }: SourceRegistryProps) {
  const [filterType, setFilterType] = useState<'all' | 'institute' | 'faculty'>('all');
  const [search, setSearch] = useState('');

  const sourcesList = Object.values(SOURCE_METADATA).filter((src) => {
    if (filterType !== 'all' && src.category.toLowerCase() !== filterType) {
      return false;
    }
    if (
      search.trim() &&
      !src.name.toLowerCase().includes(search.toLowerCase()) &&
      !src.id.toLowerCase().includes(search.toLowerCase()) &&
      !src.nepaliName.includes(search.trim())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div id="source-registry" className="space-y-6">
      {/* Overview Card */}
      <div
        className={`rounded-md border p-4 sm:p-5 ${
          darkMode ? 'bg-[#161b22] border-[#30363d]' : 'bg-white border-[#d0d7de]'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className={`text-base font-semibold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-[#1f2328]'}`}>
              <Building2 className="w-4 h-4 text-blue-500" />
              <span>Official Tribhuvan University Portals Matrix (8 Sources)</span>
            </h2>
            <p
              className={`text-xs mt-1 ${
                darkMode ? 'text-[#c9d1d9]' : 'text-[#656d76]'
              }`}
            >
              Strictly verified against TU&apos;s official tu.edu.np domains. No 3rd-party blogs, no unofficial aggregators.
            </p>
          </div>
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                filterType === 'all'
                  ? darkMode
                    ? 'bg-[#21262d] text-white border border-[#30363d]'
                    : 'bg-white text-neutral-900 border border-[#d0d7de] shadow-sm'
                  : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
              }`}
            >
              All (8)
            </button>
            <button
              onClick={() => setFilterType('institute')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                filterType === 'institute'
                  ? darkMode
                    ? 'max-sm:bg-purple-900/60 max-sm:text-purple-100 max-sm:border-purple-500/70 sm:bg-[#21262d] sm:text-white sm:border-[#30363d] border'
                    : 'max-sm:bg-purple-100 max-sm:text-purple-900 max-sm:border-purple-300 sm:bg-white sm:text-neutral-900 sm:border-[#d0d7de] border shadow-sm'
                  : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
              }`}
            >
              Institutes (5)
            </button>
            <button
              onClick={() => setFilterType('faculty')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                filterType === 'faculty'
                  ? darkMode
                    ? 'max-sm:bg-amber-900/60 max-sm:text-amber-100 max-sm:border-amber-500/70 sm:bg-[#21262d] sm:text-white sm:border-[#30363d] border'
                    : 'max-sm:bg-amber-100 max-sm:text-amber-900 max-sm:border-amber-300 sm:bg-white sm:text-neutral-900 sm:border-[#d0d7de] border shadow-sm'
                  : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
              }`}
            >
              Faculties (3)
            </button>
          </div>

          {/* Search box */}
          <div className="relative w-full sm:w-60">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter by name or code..."
              className={`w-full text-xs rounded-md pl-8 pr-3 py-1.5 border transition-colors ${
                darkMode
                  ? 'bg-[#0d1117] border-[#30363d] text-[#e6edf3] placeholder-[#7d8590]'
                  : 'bg-white border-[#d0d7de] text-[#1f2328] placeholder-[#656d76]'
              }`}
            />
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-neutral-400" />
          </div>
        </div>
      </div>

      {/* Grid of Sources */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sourcesList.map((src) => (
          <div
            key={src.id}
            className={`rounded-md border p-4 sm:p-5 flex flex-col justify-between transition-all hover:border-neutral-400 dark:hover:border-neutral-600 ${
              darkMode ? 'bg-[#161b22] border-[#30363d]' : 'bg-white border-[#d0d7de]'
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold uppercase px-2 py-0.5 rounded border bg-blue-500/10 text-blue-500 border-blue-500/30">
                    {src.id}
                  </span>
                  <span
                    className={`text-[11px] px-2.5 py-0.5 rounded-full font-semibold transition-colors ${
                      src.category === 'Institute'
                        ? 'max-sm:bg-purple-100 max-sm:text-purple-900 max-sm:border max-sm:border-purple-300 max-sm:dark:bg-purple-900/70 max-sm:dark:text-purple-100 max-sm:dark:border-purple-500/60 sm:bg-purple-100 sm:text-purple-800 sm:dark:bg-purple-900/30 sm:dark:text-purple-300'
                        : 'max-sm:bg-amber-100 max-sm:text-amber-900 max-sm:border max-sm:border-amber-300 max-sm:dark:bg-amber-900/70 max-sm:dark:text-amber-100 max-sm:dark:border-amber-500/60 sm:bg-amber-100 sm:text-amber-800 sm:dark:bg-amber-900/30 sm:dark:text-amber-300'
                    }`}
                  >
                    {src.category}
                  </span>
                </div>

                <div className="flex items-center gap-1 text-[11px] text-green-500">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span className="font-medium">Active</span>
                </div>
              </div>

              <h3
                className={`text-sm sm:text-base font-semibold leading-snug ${
                  darkMode ? 'text-[#e6edf3]' : 'text-[#1f2328]'
                }`}
              >
                {src.name}
              </h3>

              <p className="text-xs font-sans text-neutral-400 mt-0.5">
                {src.nepaliName}
              </p>

              <div
                className={`text-xs mt-3 pt-3 border-t space-y-1 font-mono text-[11px] ${
                  darkMode ? 'border-[#21262d] text-[#7d8590]' : 'border-[#eaeef2] text-[#656d76]'
                }`}
              >
                <div className="truncate">
                  <span className="text-neutral-400">Endpoint:</span> {src.url}
                </div>
                <div>
                  <span className="text-neutral-400">Target Type:</span> Single Faculty Scraper ({src.id.toUpperCase()})
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 mt-4 pt-3 border-t border-neutral-200 dark:border-neutral-800">
              <button
                onClick={() => onSelectForPlayground(src.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold py-1.5 px-3 rounded-md border transition-colors ${
                  darkMode
                    ? 'bg-[#238636] border-[#2ea043] text-white hover:bg-[#2ea043]'
                    : 'bg-[#1f883d] border-[#1a7f37] text-white hover:bg-[#1a7f37]'
                }`}
              >
                <Play className="w-3 h-3 fill-current" />
                <span>Test & Scrape</span>
              </button>

              <a
                href={src.url}
                target="_blank"
                rel="noreferrer"
                className={`flex items-center gap-1 text-xs py-1.5 px-3 rounded-md border transition-colors ${
                  darkMode
                    ? 'bg-[#21262d] border-[#30363d] text-[#c9d1d9] hover:bg-[#30363d]'
                    : 'bg-white border-[#d0d7de] text-[#24292f] hover:bg-[#f3f4f6]'
                }`}
              >
                <span>Portal</span>
                <ExternalLink className="w-3 h-3 text-neutral-400" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
