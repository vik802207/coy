'use client';

import React, { useState } from 'react';
import { Heart, Search, MessageCircle, MapPin, Sparkles, Send, X, ShieldCheck } from 'lucide-react';
import { MatchRecord, Profile } from '@/types';
import { formatTimeAgo } from '@/lib/utils';

interface MatchesViewProps {
  matches: MatchRecord[];
  onOpenDiscover: () => void;
  isLoading?: boolean;
}

export const MatchesView: React.FC<MatchesViewProps> = ({
  matches,
  onOpenDiscover,
  isLoading = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeChatProfile, setActiveChatProfile] = useState<Profile | null>(null);
  const [chatMessages, setChatMessages] = useState<Record<string, Array<{ sender: 'me' | 'them'; text: string; time: string }>>>({});
  const [messageInput, setMessageInput] = useState('');

  const filteredMatches = matches.filter((m) => {
    const q = searchQuery.toLowerCase();
    return (
      m.profile.name.toLowerCase().includes(q) ||
      m.profile.cityOrCollege.toLowerCase().includes(q) ||
      m.profile.interests.some((i) => i.toLowerCase().includes(q))
    );
  });

  const handleSendMessage = (profileId: string) => {
    if (!messageInput.trim()) return;

    const newMsg = {
      sender: 'me' as const,
      text: messageInput.trim(),
      time: 'Just now',
    };

    setChatMessages((prev) => ({
      ...prev,
      [profileId]: [...(prev[profileId] || []), newMsg],
    }));

    setMessageInput('');

    // Simulated friendly instant reply
    setTimeout(() => {
      const replies = [
        "Hey! So glad we matched on Coy! 😊",
        "Haha hey! What are the odds? How's your week going?",
        "Omg hey! I saw your profile on Coy and was hoping we'd match!",
      ];
      const randomReply = replies[Math.floor(Math.random() * replies.length)];
      setChatMessages((prev) => ({
        ...prev,
        [profileId]: [
          ...(prev[profileId] || []),
          { sender: 'them', text: randomReply, time: 'Just now' },
        ],
      }));
    }, 1200);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              Mutual Matches
            </h1>
            <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-rose-600 px-2 text-xs font-bold text-white">
              {matches.length}
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
            Double-blind verified: Only users who mutually liked each other appear here.
          </p>
        </div>

        {/* Search */}
        {matches.length > 0 && (
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, college..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 pl-9 pr-4 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
            />
          </div>
        )}
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 rounded-2xl bg-slate-100 dark:bg-slate-900 animate-pulse" />
          ))}
        </div>
      )}

      {/* Empty State when 0 matches */}
      {!isLoading && matches.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center max-w-sm mx-auto">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-500 mb-4 border border-rose-100 dark:border-rose-900">
            <Heart className="h-9 w-9 stroke-[1.5]" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            No Mutual Matches Yet
          </h3>
          <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            Matches happen when both you and someone else swipe right. Keep exploring on Discover!
          </p>
          <button
            onClick={onOpenDiscover}
            className="mt-6 flex items-center gap-2 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-md shadow-rose-500/25 transition hover:shadow-rose-500/40 hover:scale-[1.02] active:scale-95"
          >
            <Sparkles className="h-4 w-4" />
            Start Swiping in Discover
          </button>
        </div>
      )}

      {/* Matches Grid */}
      {!isLoading && filteredMatches.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mt-6">
          {filteredMatches.map(({ profile, matchedAt }) => (
            <div
              key={profile.id}
              className="group relative overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1"
            >
              {/* Photo */}
              <div className="relative h-60 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img
                  src={profile.photo}
                  alt={profile.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                
                {/* Time ago badge */}
                <span className="absolute top-3 left-3 rounded-full bg-black/50 px-2.5 py-1 text-[10px] font-medium text-white backdrop-blur-md">
                  Matched {formatTimeAgo(matchedAt)}
                </span>

                {/* Profile info on photo */}
                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <h3 className="text-xl font-bold tracking-tight">
                    {profile.name}, {profile.age}
                  </h3>
                  <p className="text-xs text-rose-300 flex items-center gap-1 mt-0.5 font-medium">
                    <MapPin className="h-3 w-3" />
                    {profile.cityOrCollege}
                  </p>
                </div>
              </div>

              {/* Bio & Interests */}
              <div className="p-4">
                <p className="line-clamp-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {profile.bio}
                </p>

                <div className="mt-3 flex flex-wrap gap-1">
                  {profile.interests.slice(0, 3).map((interest, i) => (
                    <span
                      key={i}
                      className="rounded-full bg-rose-50 dark:bg-rose-950/50 px-2 py-0.5 text-[10px] font-medium text-rose-700 dark:text-rose-300 border border-rose-100 dark:border-rose-900/50"
                    >
                      {interest}
                    </span>
                  ))}
                </div>

                {/* Chat Button */}
                <button
                  onClick={() => setActiveChatProfile(profile)}
                  className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl bg-slate-900 dark:bg-slate-800 py-2.5 px-4 text-xs font-bold text-white transition hover:bg-rose-600 dark:hover:bg-rose-600 active:scale-95"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  Chat with {profile.name.split(' ')[0]}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No filter results */}
      {!isLoading && matches.length > 0 && filteredMatches.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-sm text-slate-400">No matches found for "{searchQuery}"</p>
        </div>
      )}

      {/* Interactive In-App Chat Modal */}
      {activeChatProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative flex flex-col h-[520px] w-full max-w-md overflow-hidden rounded-3xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800">
            
            {/* Chat Header */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 px-5 py-3.5 bg-slate-50/80 dark:bg-slate-950/80">
              <div className="flex items-center gap-3">
                <img
                  src={activeChatProfile.photo}
                  alt={activeChatProfile.name}
                  className="h-10 w-10 rounded-full object-cover border border-rose-200"
                />
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {activeChatProfile.name}
                  </h4>
                  <span className="text-[11px] text-emerald-500 font-medium flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                    Mutual Match on Coy
                  </span>
                </div>
              </div>
              <button
                onClick={() => setActiveChatProfile(null)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/40 dark:bg-slate-950/40">
              <div className="text-center my-2">
                <span className="rounded-full bg-rose-100/80 dark:bg-rose-950/60 px-3 py-1 text-[11px] font-semibold text-rose-700 dark:text-rose-300">
                  You matched with {activeChatProfile.name.split(' ')[0]}! Say hello 👋
                </span>
              </div>

              {(chatMessages[activeChatProfile.id] || []).map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[78%] rounded-2xl px-4 py-2 text-xs leading-relaxed ${
                      msg.sender === 'me'
                        ? 'bg-rose-600 text-white rounded-br-none'
                        : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700/60 rounded-bl-none shadow-sm'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <div className="border-t border-slate-200 dark:border-slate-800 p-3 bg-white dark:bg-slate-900">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage(activeChatProfile.id);
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  placeholder={`Message ${activeChatProfile.name.split(' ')[0]}...`}
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  className="flex-1 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-4 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-rose-500"
                />
                <button
                  type="submit"
                  disabled={!messageInput.trim()}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-600 text-white transition hover:bg-rose-700 disabled:opacity-40 active:scale-95"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
