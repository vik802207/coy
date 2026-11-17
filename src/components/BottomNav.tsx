'use client';

import React from 'react';
import { Home, Compass, MessageCircle } from 'lucide-react';

interface BottomNavProps {
  activeTab: 'home' | 'discover' | 'matches';
  onTabChange: (tab: 'home' | 'discover' | 'matches') => void;
  matchCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  matchCount,
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 sm:hidden border-t border-slate-200/80 bg-white/95 px-6 py-2 backdrop-blur-lg dark:border-slate-800 dark:bg-slate-950/95">
      <div className="flex items-center justify-around">
        {/* Home Tab */}
        <button
          onClick={() => onTabChange('home')}
          className={`flex flex-col items-center gap-1 transition-all ${
            activeTab === 'home'
              ? 'text-rose-600 dark:text-rose-400 font-semibold scale-105'
              : 'text-slate-400 hover:text-slate-600 dark:text-slate-500'
          }`}
        >
          <Home className="h-5 w-5" />
          <span className="text-[11px]">Home</span>
        </button>

        {/* Discover Tab */}
        <button
          onClick={() => onTabChange('discover')}
          className={`flex flex-col items-center gap-1 transition-all ${
            activeTab === 'discover'
              ? 'text-rose-600 dark:text-rose-400 font-semibold scale-105'
              : 'text-slate-400 hover:text-slate-600 dark:text-slate-500'
          }`}
        >
          <div className="relative">
            <Compass className="h-5 w-5" />
            {activeTab === 'discover' && (
              <span className="absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-rose-600"></span>
            )}
          </div>
          <span className="text-[11px]">Discover</span>
        </button>

        {/* Matches Tab */}
        <button
          onClick={() => onTabChange('matches')}
          className={`relative flex flex-col items-center gap-1 transition-all ${
            activeTab === 'matches'
              ? 'text-rose-600 dark:text-rose-400 font-semibold scale-105'
              : 'text-slate-400 hover:text-slate-600 dark:text-slate-500'
          }`}
        >
          <div className="relative">
            <MessageCircle className="h-5 w-5" />
            {matchCount > 0 && (
              <span className="absolute -right-2 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-600 px-1 text-[9px] font-bold text-white">
                {matchCount}
              </span>
            )}
          </div>
          <span className="text-[11px]">Matches</span>
        </button>
      </div>
    </div>
  );
};
