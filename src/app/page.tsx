'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from '@/components/Navbar';
import { BottomNav } from '@/components/BottomNav';
import { CardDeck } from '@/components/CardDeck';
import { MatchesView } from '@/components/MatchesView';
import { HomeTab } from '@/components/HomeTab';
import { MatchModal } from '@/components/MatchModal';
import { ProfileDetailsModal } from '@/components/ProfileDetailsModal';
import { Profile, MatchRecord, SwipeDirection, SwipeResponse } from '@/types';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'home' | 'discover' | 'matches'>('discover');
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [matches, setMatches] = useState<MatchRecord[]>([]);
  const [isLoadingFeed, setIsLoadingFeed] = useState<boolean>(true);
  const [isLoadingMatches, setIsLoadingMatches] = useState<boolean>(true);
  const [isResetting, setIsResetting] = useState<boolean>(false);

  // Undo support
  const [lastSwipedProfile, setLastSwipedProfile] = useState<Profile | null>(null);
  const [lastSwipeDirection, setLastSwipeDirection] = useState<SwipeDirection | null>(null);

  // Modals
  const [currentMatch, setCurrentMatch] = useState<Profile | null>(null);
  const [isMatchModalOpen, setIsMatchModalOpen] = useState<boolean>(false);
  const [detailedProfile, setDetailedProfile] = useState<Profile | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState<boolean>(false);

  // Notification Banner
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // 1. Fetch unswiped profiles (/api/feed)
  const fetchFeed = useCallback(async () => {
    try {
      setIsLoadingFeed(true);
      const res = await fetch('/api/feed');
      const data = await res.json();
      if (data.success && Array.isArray(data.profiles)) {
        setProfiles(data.profiles);
      }
    } catch (error) {
      console.error('Failed to fetch feed:', error);
      showToast('Error loading profile feed. Please try again.');
    } finally {
      setIsLoadingFeed(false);
    }
  }, []);

  // 2. Fetch mutual matches (/api/matches)
  const fetchMatches = useCallback(async () => {
    try {
      setIsLoadingMatches(true);
      const res = await fetch('/api/matches');
      const data = await res.json();
      if (data.success && Array.isArray(data.matches)) {
        setMatches(data.matches);
      }
    } catch (error) {
      console.error('Failed to fetch matches:', error);
    } finally {
      setIsLoadingMatches(false);
    }
  }, []);

  useEffect(() => {
    fetchFeed();
    fetchMatches();
  }, [fetchFeed, fetchMatches]);

  // 3. Handle Swipe (POST /api/swipe)
  const handleSwipe = async (profile: Profile, direction: SwipeDirection) => {
    // Optimistic UI update: instantly remove top card from deck
    setProfiles((prev) => prev.filter((p) => p.id !== profile.id));
    setLastSwipedProfile(profile);
    setLastSwipeDirection(direction);

    try {
      const response = await fetch('/api/swipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profileId: profile.id,
          direction,
        }),
      });

      const data: SwipeResponse = await response.json();

      if (data.success && data.matched && data.match) {
        // Trigger Match Modal & Confetti!
        setCurrentMatch(data.match);
        setIsMatchModalOpen(true);
        // Refresh matches list
        fetchMatches();
      }
    } catch (error) {
      console.error('Error recording swipe:', error);
      showToast('Network error while recording swipe.');
    }
  };

  // 4. Handle Undo (Rewind last card)
  const handleUndo = () => {
    if (!lastSwipedProfile) return;

    // Put last profile back to front of feed
    setProfiles((prev) => [lastSwipedProfile, ...prev]);
    showToast(`Rewound swipe on ${lastSwipedProfile.name}`);
    setLastSwipedProfile(null);
    setLastSwipeDirection(null);
  };

  // 5. Handle Reset Demo (/api/reset)
  const handleReset = async () => {
    try {
      setIsResetting(true);
      const res = await fetch('/api/reset', { method: 'POST' });
      const data = await res.json();

      if (data.success) {
        await Promise.all([fetchFeed(), fetchMatches()]);
        setLastSwipedProfile(null);
        setLastSwipeDirection(null);
        showToast('Demo reset successfully! All 32 profiles restored.');
      }
    } catch (error) {
      console.error('Failed to reset:', error);
      showToast('Failed to reset demo.');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">
      
      {/* Top Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        matchCount={matches.length}
        onReset={handleReset}
        isResetting={isResetting}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="rounded-full bg-slate-900/90 dark:bg-slate-100/90 text-white dark:text-slate-900 px-4 py-2 text-xs font-semibold shadow-lg backdrop-blur-md">
            {toastMessage}
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col justify-center py-4 sm:py-6">
        
        {/* TAB 1: Home Placeholder */}
        {activeTab === 'home' && (
          <HomeTab onGoToDiscover={() => setActiveTab('discover')} />
        )}

        {/* TAB 2: Discover (Core Swipe Experience) */}
        {activeTab === 'discover' && (
          <CardDeck
            profiles={profiles}
            onSwipe={handleSwipe}
            onUndo={handleUndo}
            canUndo={Boolean(lastSwipedProfile)}
            onShowDetails={(prof) => {
              setDetailedProfile(prof);
              setIsDetailsModalOpen(true);
            }}
            onResetFeed={handleReset}
            onViewMatches={() => setActiveTab('matches')}
            matchCount={matches.length}
            isLoading={isLoadingFeed}
          />
        )}

        {/* TAB 3: Mutual Matches */}
        {activeTab === 'matches' && (
          <MatchesView
            matches={matches}
            onOpenDiscover={() => setActiveTab('discover')}
            isLoading={isLoadingMatches}
          />
        )}

      </main>

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        matchCount={matches.length}
      />

      {/* Celebration "It's a Match!" Screen */}
      <MatchModal
        match={currentMatch}
        isOpen={isMatchModalOpen}
        onClose={() => {
          setIsMatchModalOpen(false);
          setCurrentMatch(null);
        }}
        onSendMessage={(matchProf) => {
          setIsMatchModalOpen(false);
          setCurrentMatch(null);
          setActiveTab('matches');
        }}
      />

      {/* Detailed Profile Sheet Modal */}
      <ProfileDetailsModal
        profile={detailedProfile}
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setDetailedProfile(null);
        }}
        onSwipe={(direction) => {
          if (detailedProfile) {
            handleSwipe(detailedProfile, direction);
          }
          setIsDetailsModalOpen(false);
          setDetailedProfile(null);
        }}
      />

    </div>
  );
}
