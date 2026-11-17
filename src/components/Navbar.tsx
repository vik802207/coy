'use client';

import React from 'react';
import { Heart, Sparkles, RefreshCw, ShieldCheck, Home, Compass, MessageCircle } from 'lucide-react';

interface NavbarProps {
  activeTab: 'home' | 'discover' | 'matches';
  onTabChange: (tab: 'home' | 'discover' | 'matches') => void;
  matchCount: number;
  onReset: () => void;
  isResetting?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  matchCount,
  onReset,
  isResetting = false,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-rose-100/60 bg-white/90 backdrop-blur-md shadow-sm transition-all dark:border-rose-950/40 dark:bg-slate-950/90">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        
        {/* Brand Logo */}
        <div
          onClick={() => onTabChange('discover')}
          className="group flex cursor-pointer items-center gap-2.5 transition-transform active:scale-95"
        >
          <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-rose-600 via-rose-500 to-pink-500 text-white shadow-md shadow-rose-500/25 transition-transform duration-300 group-hover:scale-105">
            <Heart className="h-5 w-5 fill-white transition-transform group-hover:scale-110" />
            <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-pink-400 opacity-75"></span>
              <span className="relative inline-flex h-3 w-3 rounded-full bg-pink-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                coy
              </span>
              <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase text-rose-600 dark:bg-rose-950/60 dark:text-rose-400">
                Discover
              </span>
            </div>
            <p className="hidden text-[11px] font-medium text-slate-400 sm:block">
              Zero rejection. Double-blind dating.
            </p>
          </div>
        </div>

        {/* Center Navigation Tabs (Desktop & Tablet) */}
        <nav className="hidden sm:flex items-center gap-1 rounded-full bg-slate-100/80 p-1.5 dark:bg-slate-900/80 border border-slate-200/50 dark:border-slate-800/50">
          <button
            onClick={() => onTabChange('home')}
            className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-200 ${
              activeTab === 'home'
                ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-white'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <Home className="h-3.5 w-3.5" />
            Home
          </button>

          <button
            onClick={() => onTabChange('discover')}
            className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-200 ${
              activeTab === 'discover'
                ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-sm shadow-rose-500/25'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <Compass className="h-3.5 w-3.5" />
            Discover
          </button>

          <button
            onClick={() => onTabChange('matches')}
            className={`relative flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-200 ${
              activeTab === 'matches'
                ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-white'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <MessageCircle className="h-3.5 w-3.5" />
            Matches
            {matchCount > 0 && (
              <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
                {matchCount}
              </span>
            )}
          </button>
        </nav>

        {/* Right Action Icons: Matches Pill & Reset Demo */}
        <div className="flex items-center gap-2">
          {/* Matches Button (Mobile & Desktop) */}
          <button
            onClick={() => onTabChange('matches')}
            className="flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50/70 px-3 py-1.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-100 active:scale-95 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300"
            title="View Mutual Matches"
          >
            <Sparkles className="h-3.5 w-3.5 text-rose-500" />
            <span className="hidden xs:inline">Matches</span>
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-600 px-1 text-[11px] font-bold text-white shadow-sm">
              {matchCount}
            </span>
          </button>

          {/* Reset Demo Button */}
          <button
            onClick={onReset}
            disabled={isResetting}
            className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 active:scale-95 disabled:opacity-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            title="Reset feed & demo matches"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isResetting ? 'animate-spin text-rose-500' : 'text-slate-400'}`} />
            <span className="hidden sm:inline">Reset Demo</span>
          </button>
        </div>

      </div>
    </header>
  );
};
