'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, MessageCircle, ArrowRight, ShieldCheck, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Profile } from '@/types';

interface MatchModalProps {
  match: Profile | null;
  isOpen: boolean;
  onClose: () => void;
  onSendMessage: (profile: Profile) => void;
}

export const MatchModal: React.FC<MatchModalProps> = ({
  match,
  isOpen,
  onClose,
  onSendMessage,
}) => {
  useEffect(() => {
    if (isOpen && match) {
      // Confetti burst
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#e11d48', '#fb7185', '#f43f5e', '#fda4af', '#facc15', '#38bdf8'],
        });

        // Second celebratory burst slightly delayed
        const timer = setTimeout(() => {
          confetti({
            particleCount: 50,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#e11d48', '#fb7185', '#ec4899'],
          });
          confetti({
            particleCount: 50,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#e11d48', '#fb7185', '#ec4899'],
          });
        }, 250);

        return () => clearTimeout(timer);
      } catch (err) {
        console.warn('Confetti error:', err);
      }
    }
  }, [isOpen, match]);

  if (!isOpen || !match) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        
        {/* Modal Card */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-sm sm:max-w-md overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-black p-6 sm:p-8 text-center text-white shadow-2xl border border-rose-500/30"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white transition"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Heading */}
          <div className="flex items-center justify-center gap-1.5 mb-2">
            <Sparkles className="h-5 w-5 text-yellow-400 animate-bounce" />
            <span className="text-xs font-bold uppercase tracking-widest text-rose-400">
              Mutual Connection
            </span>
            <Sparkles className="h-5 w-5 text-yellow-400 animate-bounce" />
          </div>

          <h2 className="text-3xl sm:text-4xl font-black tracking-tight bg-gradient-to-r from-rose-400 via-pink-300 to-amber-200 bg-clip-text text-transparent">
            It's a Match!
          </h2>

          <p className="mt-2 text-sm text-slate-300">
            You and <span className="font-bold text-white">{match.name}</span> both liked each other!
          </p>

          {/* Dual Avatars with Pulsing Rings */}
          <div className="my-8 flex items-center justify-center -space-x-5">
            {/* Current user placeholder avatar */}
            <div className="relative z-10">
              <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-full border-4 border-rose-500/80 p-1 shadow-lg shadow-rose-500/30 bg-slate-800">
                <img
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80"
                  alt="You"
                  className="h-full w-full rounded-full object-cover"
                />
              </div>
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full bg-slate-800 px-2.5 py-0.5 text-[10px] font-bold text-slate-200 border border-slate-600">
                You
              </span>
            </div>

            {/* Glowing Center Heart */}
            <div className="relative z-20 flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-tr from-rose-600 to-pink-500 text-white shadow-xl shadow-rose-500/50 animate-bounce-gentle">
              <Heart className="h-6 w-6 fill-white" />
            </div>

            {/* Matched Profile Avatar */}
            <div className="relative z-10">
              <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-full border-4 border-emerald-500/80 p-1 shadow-lg shadow-emerald-500/30 bg-slate-800">
                <img
                  src={match.photo}
                  alt={match.name}
                  className="h-full w-full rounded-full object-cover"
                />
              </div>
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full bg-emerald-950 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-700">
                {match.name.split(' ')[0]}
              </span>
            </div>
          </div>

          {/* Coy Double-Blind Privacy Stamp */}
          <div className="mb-6 flex items-center justify-center gap-1.5 rounded-full bg-rose-950/50 border border-rose-800/40 px-3.5 py-1.5 text-xs text-rose-300">
            <ShieldCheck className="h-3.5 w-3.5 text-rose-400 shrink-0" />
            <span>Double-blind guarantee: Identities only revealed upon mutual like.</span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2.5">
            <button
              onClick={() => onSendMessage(match)}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 py-3.5 px-6 text-sm font-bold text-white shadow-lg shadow-rose-600/30 transition hover:shadow-rose-600/50 hover:scale-[1.02] active:scale-95"
            >
              <MessageCircle className="h-4 w-4" />
              Say Hi to {match.name.split(' ')[0]}
              <ArrowRight className="h-4 w-4 ml-1" />
            </button>

            <button
              onClick={onClose}
              className="w-full rounded-2xl border border-slate-700 bg-slate-800/80 py-3 px-6 text-sm font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-white active:scale-95"
            >
              Keep Swiping
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
