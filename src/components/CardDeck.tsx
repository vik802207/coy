'use client';

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Heart, Star, RotateCcw, Info, Sparkles } from 'lucide-react';
import { SwipeCard } from './SwipeCard';
import { Profile, SwipeDirection } from '@/types';
import { EmptyState } from './EmptyState';

interface CardDeckProps {
  profiles: Profile[];
  onSwipe: (profile: Profile, direction: SwipeDirection) => void;
  onUndo?: () => void;
  canUndo?: boolean;
  onShowDetails: (profile: Profile) => void;
  onResetFeed: () => void;
  onViewMatches: () => void;
  matchCount: number;
  isLoading?: boolean;
}

export const CardDeck: React.FC<CardDeckProps> = ({
  profiles,
  onSwipe,
  onUndo,
  canUndo = false,
  onShowDetails,
  onResetFeed,
  onViewMatches,
  matchCount,
  isLoading = false,
}) => {
  const [animatingDirection, setAnimatingDirection] = useState<SwipeDirection | null>(null);

  const topProfile = profiles[0];
  const nextProfile = profiles[1];

  const handleActionClick = (direction: SwipeDirection) => {
    if (!topProfile || animatingDirection) return;
    setAnimatingDirection(direction);

    // Short timeout to allow animation before removing card
    setTimeout(() => {
      onSwipe(topProfile, direction);
      setAnimatingDirection(null);
    }, 280);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-4">
        <div className="relative h-[530px] w-full max-w-[360px] sm:max-w-[380px] rounded-3xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 animate-pulse flex flex-col justify-end p-6">
          <div className="h-6 w-3/4 rounded-md bg-slate-300 dark:bg-slate-700 mb-2"></div>
          <div className="h-4 w-1/2 rounded-md bg-slate-300 dark:bg-slate-700 mb-4"></div>
          <div className="flex gap-2">
            <div className="h-6 w-16 rounded-full bg-slate-300 dark:bg-slate-700"></div>
            <div className="h-6 w-20 rounded-full bg-slate-300 dark:bg-slate-700"></div>
          </div>
        </div>
      </div>
    );
  }

  if (profiles.length === 0) {
    return (
      <EmptyState
        onReset={onResetFeed}
        onViewMatches={onViewMatches}
        matchCount={matchCount}
      />
    );
  }

  return (
    <div className="flex flex-col items-center w-full px-4 select-none">
      
      {/* Cards Deck Container */}
      <div className="relative h-[520px] sm:h-[560px] w-full max-w-[360px] sm:max-w-[380px]">
        {/* Next card under top card (preview) */}
        {nextProfile && (
          <SwipeCard
            key={nextProfile.id}
            profile={nextProfile}
            isTopCard={false}
            onSwipe={() => {}}
            onShowDetails={() => {}}
          />
        )}

        {/* Current top interactive card */}
        <AnimatePresence>
          {topProfile && (
            <motion.div
              key={topProfile.id}
              className="absolute inset-0"
              initial={{ scale: 0.95, opacity: 0.8 }}
              animate={
                animatingDirection === 'like'
                  ? { x: 700, rotate: 25, opacity: 0 }
                  : animatingDirection === 'pass'
                  ? { x: -700, rotate: -25, opacity: 0 }
                  : { x: 0, rotate: 0, scale: 1, opacity: 1 }
              }
              exit={{ opacity: 0 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
            >
              <SwipeCard
                profile={topProfile}
                isTopCard={true}
                onSwipe={(dir) => {
                  onSwipe(topProfile, dir);
                }}
                onShowDetails={onShowDetails}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Desktop & Mobile Action Bar */}
      <div className="mt-6 sm:mt-7 flex items-center justify-center gap-3 sm:gap-4 z-10 pb-20 sm:pb-6">
        
        {/* Rewind / Undo Button */}
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className={`flex h-11 w-11 items-center justify-center rounded-full border shadow-sm transition-all duration-200 active:scale-95 ${
            canUndo
              ? 'border-amber-200 bg-amber-50 text-amber-600 hover:bg-amber-100 hover:scale-105 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-400'
              : 'border-slate-200 bg-white/60 text-slate-300 opacity-50 cursor-not-allowed dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-600'
          }`}
          title={canUndo ? 'Rewind last swipe' : 'No previous swipe to undo'}
        >
          <RotateCcw className="h-5 w-5" />
        </button>

        {/* Pass Button (Nope) */}
        <button
          onClick={() => handleActionClick('pass')}
          disabled={Boolean(animatingDirection)}
          className="group flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full border border-rose-200 bg-white text-rose-500 shadow-md shadow-rose-500/10 transition-all duration-200 hover:border-rose-400 hover:bg-rose-50 hover:scale-110 active:scale-95 dark:border-rose-900/40 dark:bg-slate-900 dark:text-rose-400 dark:hover:bg-rose-950/40"
          title="Pass (Swipe Left)"
        >
          <X className="h-7 w-7 transition-transform group-hover:scale-110" />
        </button>

        {/* Super Like / Star Button */}
        <button
          onClick={() => handleActionClick('like')}
          disabled={Boolean(animatingDirection)}
          className="group flex h-11 w-11 items-center justify-center rounded-full border border-sky-200 bg-white text-sky-500 shadow-sm transition-all duration-200 hover:border-sky-400 hover:bg-sky-50 hover:scale-110 active:scale-95 dark:border-sky-900/40 dark:bg-slate-900 dark:text-sky-400"
          title="Super Like"
        >
          <Star className="h-5 w-5 transition-transform group-hover:scale-110" />
        </button>

        {/* Like Button */}
        <button
          onClick={() => handleActionClick('like')}
          disabled={Boolean(animatingDirection)}
          className="group flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full border border-emerald-200 bg-gradient-to-tr from-emerald-500 to-teal-400 text-white shadow-lg shadow-emerald-500/25 transition-all duration-200 hover:shadow-emerald-500/40 hover:scale-110 active:scale-95 dark:border-emerald-600/50"
          title="Like (Swipe Right)"
        >
          <Heart className="h-7 w-7 fill-white transition-transform group-hover:scale-110" />
        </button>

        {/* Profile Info Button */}
        <button
          onClick={() => topProfile && onShowDetails(topProfile)}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:scale-105 active:scale-95 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
          title="Profile details"
        >
          <Info className="h-5 w-5" />
        </button>

      </div>
    </div>
  );
};
