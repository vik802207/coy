'use client';

import React from 'react';
import { Heart, Compass, Shield, Lock, Users, Sparkles } from 'lucide-react';

interface HomeTabProps {
  onGoToDiscover: () => void;
}

export const HomeTab: React.FC<HomeTabProps> = ({ onGoToDiscover }) => {
  return (
    <div className="mx-auto max-w-xl px-4 py-8 sm:py-12 animate-in fade-in duration-200">
      
      {/* Hero Card */}
      <div className="relative overflow-hidden rounded-3xl border border-rose-200/80 dark:border-rose-950/60 bg-gradient-to-br from-white via-rose-50/30 to-pink-50/50 dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-950 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-rose-600 to-pink-500 text-white shadow-md shadow-rose-500/20">
            <Heart className="h-6 w-6 fill-white" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Coy Home
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Double-Blind Crush Matching
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700/60 p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
              <Lock className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Placeholder "Home" Tab
              </h4>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                As specified in the assignment guidelines, the native Coy crush slots reside on Home, while the complete swipe-based discovery experience is built inside the <strong>Discover</strong> tab.
              </p>
            </div>
          </div>
        </div>

        {/* Feature Teasers */}
        <div className="mt-6 space-y-3">
          <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-300">
            <Shield className="h-4 w-4 text-emerald-500 shrink-0" />
            <span>Zero rejection guarantee: Neither party knows unless it's mutual.</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-300">
            <Users className="h-4 w-4 text-sky-500 shrink-0" />
            <span>Over 30 verified collegiate profiles waiting in your area.</span>
          </div>
        </div>

        {/* Call to action */}
        <div className="mt-8">
          <button
            onClick={onGoToDiscover}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 py-3.5 px-6 text-sm font-bold text-white shadow-lg shadow-rose-500/25 transition-all hover:shadow-rose-500/40 hover:scale-[1.01] active:scale-95"
          >
            <Compass className="h-4 w-4" />
            Open Discover Tab
            <Sparkles className="h-4 w-4 ml-1" />
          </button>
        </div>
      </div>

    </div>
  );
};
