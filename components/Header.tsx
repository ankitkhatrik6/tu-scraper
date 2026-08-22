'use client';

import React from 'react';
import Image from 'next/image';
import {
  Play,
  Moon,
  Sun,
  Search,
  BookOpen,
  Code2,
  TableProperties,
  CheckCircle2,
  Menu,
  X,
  Github,
  Building2,
  Home,
} from 'lucide-react';

export type MainNavPage = 'home' | 'guides' | 'api-reference' | 'console' | 'portals';

interface HeaderProps {
  darkMode: boolean;
  onToggleTheme: () => void;
  activePage: MainNavPage;
  onSelectPage: (page: MainNavPage) => void;
  onSearchClick: () => void;
  mobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
}

export function Header({
  darkMode,
  onToggleTheme,
  activePage,
  onSelectPage,
  onSearchClick,
  mobileMenuOpen,
  onToggleMobileMenu,
}: HeaderProps) {
  const navItems: {
    id: MainNavPage;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
  }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'guides', label: 'Guides', icon: BookOpen },
    { id: 'api-reference', label: 'API Reference', icon: Code2 },
    { id: 'console', label: 'Console', icon: Play, badge: 'Live' },
    { id: 'portals', label: 'Portals', icon: Building2, badge: '8' },
  ];

  return (
    <header
      id="github-docs-header"
      className={`sticky top-0 z-40 border-b backdrop-blur-md transition-colors ${
        darkMode
          ? 'bg-[#0d1117]/95 border-[#30363d] text-[#e6edf3]'
          : 'bg-[#ffffff]/95 border-[#d0d7de] text-[#1f2328]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Top Header Row: Brand, Search, Theme, Repo, Menu */}
        <div className="flex items-center justify-between h-13 sm:h-14 gap-2 sm:gap-4">
          {/* Brand & Project Info */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={() => onSelectPage('home')}
              className="flex items-center gap-2 sm:gap-2.5 hover:opacity-90 transition-opacity text-left group"
            >
              {/* Logo */}
              <Image
                src="/logo.png"
                alt="Logo"
                width={36}
                height={36}
                className="w-8 h-8 sm:w-9 sm:h-9 object-contain shrink-0"
                referrerPolicy="no-referrer"
              />

              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className={`font-bold text-sm sm:text-base tracking-tight whitespace-nowrap ${
                  darkMode ? 'text-white' : 'text-[#1f2328]'
                }`}>
                  tu-scraper
                </span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-medium hidden sm:inline ${
                    darkMode
                      ? 'bg-[#161b22] border border-[#30363d] text-[#58a6ff]'
                      : 'bg-[#f6f8fa] border border-[#d0d7de] text-[#0969da]'
                  }`}
                >
                  v1.0.0
                </span>
              </div>
            </button>
          </div>

          {/* Center / Right: Search Bar */}
          <div className="flex-1 max-w-xs sm:max-w-sm md:max-w-md mx-1 sm:mx-2">
            <button
              onClick={onSearchClick}
              className={`w-full flex items-center gap-2 text-xs px-2.5 sm:px-3 py-1.5 rounded-md border text-left transition-all ${
                darkMode
                  ? 'bg-[#161b22] border-[#30363d] text-[#7d8590] hover:border-[#8b949e]'
                  : 'bg-[#f6f8fa] border-[#d0d7de] text-[#656d76] hover:border-[#8c959f]'
              }`}
            >
              <Search className="w-3.5 h-3.5 shrink-0 text-neutral-400" />
              <span className="truncate hidden sm:inline">Search docs, API methods, portals...</span>
              <span className="truncate sm:hidden text-[11px]">Search docs...</span>
              <kbd
                className={`ml-auto font-mono text-[10px] px-1.5 py-0.5 rounded border hidden sm:inline-block ${
                  darkMode
                    ? 'bg-[#21262d] border-[#30363d] text-[#7d8590]'
                    : 'bg-[#ffffff] border-[#d0d7de] text-[#656d76]'
                }`}
              >
                /
              </kbd>
            </button>
          </div>

          {/* Actions: GitHub Repo, Theme, Mobile Menu Toggle */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            {/* GitHub Repo link */}
            <a
              href="https://github.com/ankitkhatrik6/tu-scraper"
              target="_blank"
              rel="noreferrer"
              title="GitHub repository"
              className={`p-1.5 rounded-md border transition-colors ${
                darkMode
                  ? 'bg-[#161b22] border-[#30363d] text-[#c9d1d9] hover:text-white hover:border-[#8b949e]'
                  : 'bg-[#f6f8fa] border-[#d0d7de] text-[#24292f] hover:bg-[#eff1f3]'
              }`}
            >
              <Github className="w-4 h-4" />
            </a>

            {/* Theme Toggle */}
            <button
              id="theme-toggle-button"
              onClick={onToggleTheme}
              title={darkMode ? 'Switch to Light theme' : 'Switch to Dark theme'}
              className={`p-1.5 rounded-md border transition-colors ${
                darkMode
                  ? 'bg-[#161b22] border-[#30363d] text-[#e6edf3] hover:bg-[#21262d]'
                  : 'bg-[#f6f8fa] border-[#d0d7de] text-[#1f2328] hover:bg-[#eff1f3]'
              }`}
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-[#656d76]" />}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={onToggleMobileMenu}
              className={`md:hidden p-1.5 rounded-md border transition-colors ${
                darkMode
                  ? 'bg-[#161b22] border-[#30363d] text-[#c9d1d9] hover:bg-[#21262d]'
                  : 'bg-[#f6f8fa] border-[#d0d7de] text-[#24292f] hover:bg-[#eff1f3]'
              }`}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* GitHub Primer Tabs Menu Bar */}
        <nav
          id="docs-main-navigation-menu"
          aria-label="Main Documentation Navigation"
          className="flex items-center gap-1 sm:gap-2 overflow-x-auto scrollbar-none -mb-px pt-1"
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectPage(item.id)}
                className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-2 text-xs font-medium border-b-2 whitespace-nowrap transition-all select-none ${
                  isActive
                    ? darkMode
                      ? 'border-[#f78166] text-white font-semibold'
                      : 'border-[#fd8c73] text-[#1f2328] font-semibold'
                    : darkMode
                    ? 'border-transparent text-[#8b949e] hover:text-white hover:border-[#8b949e]'
                    : 'border-transparent text-[#656d76] hover:text-[#1f2328] hover:border-[#d0d7de]'
                }`}
              >
                <Icon
                  className={`w-3.5 h-3.5 shrink-0 ${
                    isActive
                      ? darkMode
                        ? 'text-white'
                        : 'text-[#1f2328]'
                      : 'text-neutral-400'
                  }`}
                />
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full font-medium ${
                      isActive
                        ? darkMode
                          ? 'bg-[#30363d] text-white'
                          : 'bg-[#e7ecf0] text-[#1f2328]'
                        : darkMode
                        ? 'bg-[#21262d] text-[#7d8590]'
                        : 'bg-[#f6f8fa] text-[#656d76]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Mobile Navigation Drawer / Dropdown */}
        {mobileMenuOpen && (
          <div
            className={`md:hidden border-t py-3 space-y-1 ${
              darkMode ? 'border-[#30363d] bg-[#0d1117]' : 'border-[#d0d7de] bg-white'
            }`}
          >
            <div className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 px-3 py-1">
              Navigation Menu
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectPage(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium text-left transition-colors ${
                    isActive
                      ? darkMode
                        ? 'bg-[#21262d] text-white font-semibold'
                        : 'bg-[#eff1f3] text-[#1f2328] font-semibold'
                      : darkMode
                      ? 'text-[#c9d1d9] hover:bg-[#161b22]'
                      : 'text-[#424a53] hover:bg-[#f6f8fa]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-neutral-400" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-medium ${
                        darkMode ? 'bg-[#30363d] text-[#7d8590]' : 'bg-[#e7ecf0] text-[#656d76]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
}
