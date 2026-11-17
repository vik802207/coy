'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, CheckCircle2, Heart, Sparkles, Quote } from 'lucide-react';
import { Profile, SwipeDirection } from '@/types';

interface ProfileDetailsModalProps {
  profile: Profile | null;
  isOpen: boolean;
  onClose: () => void;
  onSwipe: (direction: SwipeDirection) => void;
}

export const ProfileDetailsModal: React.FC<ProfileDetailsModalProps> = ({
  profile,
  isOpen,
  onClose,
  onSwipe,
}) => {
  if (!isOpen || !profile) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-sm">
        
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className="relative max-h-[90vh] sm:max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md hover:bg-black/60 transition"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Large Hero Image */}
          <div className="relative h-80 sm:h-96 w-full overflow-hidden bg-slate-950">
            <img
              src={profile.photo}
              alt={profile.name}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-slate-900 via-transparent to-transparent" />
            
            {profile.verified && (
              <div className="absolute top-4 left-4 flex items-center gap-1 rounded-full bg-black/40 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md border border-white/10">
                <CheckCircle2 className="h-3.5 w-3.5 text-sky-400" />
                <span>Verified Student</span>
              </div>
            )}
          </div>

          {/* Profile Details Content */}
          <div className="px-6 pb-24 pt-2">
            <div className="flex items-center gap-2">
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                {profile.name}
              </h2>
              <span className="text-3xl font-light text-slate-400 dark:text-slate-500">
                {profile.age}
              </span>
            </div>

            <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-rose-600 dark:text-rose-400">
              <MapPin className="h-4 w-4" />
              {profile.cityOrCollege}
              {profile.distanceKm && (
                <span className="text-slate-400 font-normal">
                  • {profile.distanceKm} km away
                </span>
              )}
            </p>

            {/* About / Bio */}
            <div className="mt-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                About Me
              </h4>
              <p className="mt-2 text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                {profile.bio}
              </p>
            </div>

            {/* Prompt Q&A Card */}
            {profile.promptQuestion && profile.promptAnswer && (
              <div className="mt-6 rounded-2xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200/60 dark:border-rose-900/40 p-4">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                  <Quote className="h-3.5 w-3.5" />
                  <span>{profile.promptQuestion}</span>
                </div>
                <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-white leading-relaxed">
                  "{profile.promptAnswer}"
                </p>
              </div>
            )}

            {/* Interests */}
            <div className="mt-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Interests & Passions
              </h4>
              <div className="mt-3 flex flex-wrap gap-2">
                {profile.interests.map((interest, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center rounded-full bg-slate-100 dark:bg-slate-800 px-3.5 py-1.5 text-xs font-medium text-slate-800 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700/60"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Sticky Bottom Actions Bar */}
          <div className="fixed sm:absolute bottom-0 left-0 right-0 border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-4 flex items-center justify-center gap-4">
            <button
              onClick={() => {
                onClose();
                onSwipe('pass');
              }}
              className="flex-1 rounded-2xl border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-950/40 py-3 text-sm font-bold text-rose-600 dark:text-rose-400 transition hover:bg-rose-100 dark:hover:bg-rose-900/60 active:scale-95"
            >
              Pass
            </button>
            <button
              onClick={() => {
                onClose();
                onSwipe('like');
              }}
              className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 py-3 text-sm font-bold text-white shadow-md shadow-rose-500/25 transition hover:shadow-rose-500/40 active:scale-95"
            >
              <Heart className="h-4 w-4 fill-white" />
              Like
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
