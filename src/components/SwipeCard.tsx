'use client';

import React from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { MapPin, CheckCircle2, Info, Sparkles } from 'lucide-react';
import { Profile, SwipeDirection } from '@/types';

interface SwipeCardProps {
  profile: Profile;
  isTopCard: boolean;
  onSwipe: (direction: SwipeDirection) => void;
  onShowDetails: (profile: Profile) => void;
}

export const SwipeCard: React.FC<SwipeCardProps> = ({
  profile,
  isTopCard,
  onSwipe,
  onShowDetails,
}) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Rotate card as it is dragged horizontally
  const rotate = useTransform(x, [-250, 250], [-18, 18]);

  // Opacity for "LIKE" stamp (fades in as x moves positive / right)
  const likeOpacity = useTransform(x, [20, 100], [0, 1]);

  // Opacity for "NOPE" stamp (fades in as x moves negative / left)
  const nopeOpacity = useTransform(x, [-20, -100], [0, 1]);

  const handleDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const threshold = 100;
    const velocityThreshold = 400;

    if (info.offset.x > threshold || info.velocity.x > velocityThreshold) {
      onSwipe('like');
    } else if (info.offset.x < -threshold || info.velocity.x < -velocityThreshold) {
      onSwipe('pass');
    }
  };

  if (!isTopCard) {
    // Background card (preview card underneath)
    return (
      <div className="absolute inset-0 select-none overflow-hidden rounded-3xl bg-slate-900 shadow-xl transition-all duration-300 pointer-events-none scale-[0.96] translate-y-3 opacity-80 border border-slate-700/40">
        <img
          src={profile.photo}
          alt={profile.name}
          className="h-full w-full object-cover brightness-[0.85]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
        <div className="absolute bottom-5 left-5 right-5 text-white">
          <div className="flex items-center gap-2">
            <h3 className="text-2xl font-bold tracking-tight">
              {profile.name}, {profile.age}
            </h3>
          </div>
          <p className="mt-1 text-sm text-slate-300 flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-rose-400" />
            {profile.cityOrCollege}
          </p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      style={{
        x,
        y,
        rotate,
      }}
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.8}
      onDragEnd={handleDragEnd}
      whileDrag={{ cursor: 'grabbing', scale: 1.02 }}
      className="absolute inset-0 cursor-grab select-none overflow-hidden rounded-3xl bg-slate-900 shadow-2xl transition-shadow hover:shadow-rose-500/10 active:cursor-grabbing border border-slate-700/30 touch-none"
    >
      {/* Profile Image */}
      <img
        src={profile.photo}
        alt={profile.name}
        draggable={false}
        className="h-full w-full object-cover select-none pointer-events-none"
      />

      {/* Gradient Overlays for Readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/10 pointer-events-none" />

      {/* "LIKE" Stamp (Appears on Swipe Right) */}
      <motion.div
        style={{ opacity: likeOpacity }}
        className="pointer-events-none absolute left-6 top-8 z-30 -rotate-12 rounded-xl border-4 border-emerald-500 bg-emerald-600/20 px-4 py-1.5 backdrop-blur-sm"
      >
        <span className="text-2xl font-black tracking-wider uppercase text-emerald-400 shadow-sm">
          LIKE
        </span>
      </motion.div>

      {/* "NOPE" Stamp (Appears on Swipe Left) */}
      <motion.div
        style={{ opacity: nopeOpacity }}
        className="pointer-events-none absolute right-6 top-8 z-30 rotate-12 rounded-xl border-4 border-rose-500 bg-rose-600/20 px-4 py-1.5 backdrop-blur-sm"
      >
        <span className="text-2xl font-black tracking-wider uppercase text-rose-400 shadow-sm">
          NOPE
        </span>
      </motion.div>

      {/* Verified Badge Pill (Top Right) */}
      {profile.verified && (
        <div className="absolute top-4 right-4 z-20 flex items-center gap-1 rounded-full bg-black/40 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-md border border-white/10">
          <CheckCircle2 className="h-3.5 w-3.5 text-sky-400 fill-sky-400/20" />
          <span>Verified Student</span>
        </div>
      )}

      {/* Profile Information Overlay (Bottom) */}
      <div className="absolute bottom-0 left-0 right-0 z-20 p-5 sm:p-6 text-white pointer-events-auto">
        <div className="flex items-end justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                {profile.name}
              </h2>
              <span className="text-2xl sm:text-3xl font-light text-slate-300">
                {profile.age}
              </span>
            </div>

            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm text-slate-300">
              <span className="flex items-center gap-1 font-medium text-rose-300">
                <MapPin className="h-3.5 w-3.5 text-rose-400 shrink-0" />
                {profile.cityOrCollege}
              </span>
              {profile.distanceKm && (
                <span className="text-slate-400">
                  • {profile.distanceKm} km away
                </span>
              )}
            </div>
          </div>

          {/* Info Button to trigger Profile Detail Sheet */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onShowDetails(profile);
            }}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition-all hover:bg-white/30 hover:scale-105 active:scale-95 border border-white/20"
            title="View Full Profile Details"
          >
            <Info className="h-5 w-5" />
          </button>
        </div>

        {/* Bio preview */}
        <p className="mt-2.5 line-clamp-2 text-xs sm:text-sm text-slate-200/90 leading-relaxed font-normal">
          {profile.bio}
        </p>

        {/* Interest Tags */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {profile.interests.slice(0, 3).map((interest, i) => (
            <span
              key={i}
              className="inline-flex items-center rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] font-medium text-white backdrop-blur-sm border border-white/10"
            >
              {interest}
            </span>
          ))}
          {profile.interests.length > 3 && (
            <span className="inline-flex items-center rounded-full bg-white/10 px-2 py-0.5 text-[11px] font-medium text-slate-300">
              +{profile.interests.length - 3}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};
