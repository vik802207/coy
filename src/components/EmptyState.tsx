'use client';

import React from 'react';
import { Compass, Sparkles, RefreshCw, Heart } from 'lucide-react';

interface EmptyStateProps {
  onReset: () => void;
  onViewMatches: () => void;
  matchCount: number;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  onReset,
  onViewMatches,
  matchCount,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center max-w-md mx-auto animate-in fade-in zoom-in-95 duration-300">
      
      {/* Visual glowing icon */}
      <div className="relative mb-6">
        <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-tr from-rose-500/20 via-pink-500/15 to-amber-500/10 dark:from-rose-500/30 dark:via-pink-500/20 text-rose-600 dark:text-rose-400 border border-rose-200/60 dark:border-rose-900/40 shadow-inner">
          <Compass className="h-12 w-12 animate-pulse-subtle" />
        </div>
        <div className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-rose-600 text-white shadow-md">
          <Heart className="h-4 w-4 fill-white" />
        </div>
      </div>

      <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
        You're All Caught Up!
      </h2>

      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
        There are no more profiles in your circle right now. Check your mutual matches or reset the demo feed to test again.
      </p>

      {/* Match stat badge */}
      <div className="mt-6 flex items-center justify-center gap-2 rounded-2xl bg-rose-50/80 dark:bg-rose-950/40 border border-rose-200/60 dark:border-rose-900/50 px-5 py-3 text-rose-800 dark:text-rose-300">
        <Sparkles className="h-5 w-5 text-rose-500 animate-spin-slow" />
        <span className="text-sm font-semibold">
          {matchCount === 1
            ? '1 Mutual Match waiting for you!'
            : `${matchCount} Mutual Matches waiting for you!`}
        </span>
      </div>

      {/* Actions */}
      <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 w-full">
        <button
          onClick={onViewMatches}
          className="flex w-full sm:flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-rose-500/25 transition-all hover:shadow-rose-500/40 hover:scale-[1.02] active:scale-95"
        >
          <Sparkles className="h-4 w-4" />
          View Matches ({matchCount})
        </button>

        <button
          onClick={onReset}
          className="flex w-full sm:flex-1 items-center justify-center gap-2 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-5 py-3.5 text-sm font-semibold text-slate-700 dark:text-slate-200 transition-all hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-95"
        >
          <RefreshCw className="h-4 w-4 text-slate-500" />
          Reset Demo Deck
        </button>
      </div>
    </div>
  );
};
