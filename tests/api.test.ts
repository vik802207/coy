import { describe, it, expect, beforeEach } from 'vitest';
import {
  getDatabase,
  getFeedProfiles,
  recordSwipe,
  getMutualMatches,
  resetDatabase,
  sanitizeProfile,
} from '../src/lib/db';
import { ProfileRecord } from '../src/types';

describe('Coy Backend APIs & Double-Blind Matching Logic', () => {
  beforeEach(async () => {
    // Reset database to initial seed before each test
    await resetDatabase();
  });

  describe('1. GET /feed Requirements', () => {
    it('should return all seeded profiles initially (at least 30)', async () => {
      const feed = await getFeedProfiles();
      expect(feed.length).toBeGreaterThanOrEqual(30);
    });

    it('STRICT PRIVACY CHECK: should NEVER expose hasLikedCurrentUser in feed', async () => {
      const feed = await getFeedProfiles();
      for (const profile of feed) {
        // Assert that the private flag hasLikedCurrentUser is strictly stripped
        expect((profile as any).hasLikedCurrentUser).toBeUndefined();
      }
    });

    it('should have valid profile properties (name, age, photo, bio, cityOrCollege, interests)', async () => {
      const feed = await getFeedProfiles();
      const first = feed[0];
      expect(first.name).toBeDefined();
      expect(first.age).toBeGreaterThan(17);
      expect(first.photo).toBeDefined();
      expect(first.bio).toBeDefined();
      expect(first.cityOrCollege).toBeDefined();
      expect(Array.isArray(first.interests)).toBe(true);
      expect(first.interests.length).toBeGreaterThan(0);
    });
  });

  describe('2. POST /swipe Requirements', () => {
    it('should record a PASS swipe without creating a match', async () => {
      const feed = await getFeedProfiles();
      const target = feed[0];

      const swipeResult = await recordSwipe(target.id, 'pass');
      expect(swipeResult.success).toBe(true);
      expect(swipeResult.matched).toBe(false);
      expect(swipeResult.match).toBeUndefined();

      // Ensure profile no longer appears in feed
      const updatedFeed = await getFeedProfiles();
      const exists = updatedFeed.some((p) => p.id === target.id);
      expect(exists).toBe(false);
    });

    it('should record a LIKE swipe with NO match if the target has not liked user back', async () => {
      // prof_1 has hasLikedCurrentUser: false in seed
      const swipeResult = await recordSwipe('prof_1', 'like');
      expect(swipeResult.success).toBe(true);
      expect(swipeResult.matched).toBe(false);
      expect(swipeResult.match).toBeUndefined();

      // Ensure prof_1 no longer appears in feed
      const updatedFeed = await getFeedProfiles();
      expect(updatedFeed.some((p) => p.id === 'prof_1')).toBe(false);

      // Matches list should remain empty
      const matches = await getMutualMatches();
      expect(matches.some((m) => m.profileId === 'prof_1')).toBe(false);
    });

    it('should create a MUTUAL MATCH only when both users liked each other', async () => {
      // prof_2 (Maya Sen) has hasLikedCurrentUser: true in seed
      const swipeResult = await recordSwipe('prof_2', 'like');
      expect(swipeResult.success).toBe(true);
      expect(swipeResult.matched).toBe(true);
      expect(swipeResult.match).toBeDefined();
      expect(swipeResult.match?.name).toBe('Maya Sen');
      // Even in the returned match object, hasLikedCurrentUser must not be leaked
      expect((swipeResult.match as any).hasLikedCurrentUser).toBeUndefined();

      // prof_2 must no longer appear in feed
      const updatedFeed = await getFeedProfiles();
      expect(updatedFeed.some((p) => p.id === 'prof_2')).toBe(false);

      // prof_2 must now be in mutual matches
      const matches = await getMutualMatches();
      const matchRecord = matches.find((m) => m.profileId === 'prof_2');
      expect(matchRecord).toBeDefined();
      expect(matchRecord?.profile.name).toBe('Maya Sen');
    });

    it('should reject invalid direction or non-existent profileId', async () => {
      const invalidDir = await recordSwipe('prof_1', 'superlike' as any);
      expect(invalidDir.success).toBe(false);

      const invalidProfile = await recordSwipe('non_existent_123', 'like');
      expect(invalidProfile.success).toBe(false);
      expect(invalidProfile.error).toBe('Profile not found');
    });
  });

  describe('3. GET /matches Requirements & Persistence', () => {
    it('should list all mutual matches and persist across database re-reads', async () => {
      // Swipe like on two profiles that pre-liked the user: prof_2 and prof_4
      await recordSwipe('prof_2', 'like');
      await recordSwipe('prof_4', 'like');

      const matches = await getMutualMatches();
      expect(matches.length).toBe(2);

      const names = matches.map((m) => m.profile.name);
      expect(names).toContain('Maya Sen');
      expect(names).toContain('Ananya Sharma');

      // Re-read directly from disk database to verify persistence
      const freshDb = await getDatabase();
      expect(freshDb.matches.length).toBe(2);
      expect(Object.keys(freshDb.swipes).length).toBe(2);
    });

    it('a profile swiped on must NEVER appear in the feed again', async () => {
      const initialFeed = await getFeedProfiles();
      const initialCount = initialFeed.length;

      await recordSwipe(initialFeed[0].id, 'like');
      await recordSwipe(initialFeed[1].id, 'pass');
      await recordSwipe(initialFeed[2].id, 'like');

      const updatedFeed = await getFeedProfiles();
      expect(updatedFeed.length).toBe(initialCount - 3);

      expect(updatedFeed.find((p) => p.id === initialFeed[0].id)).toBeUndefined();
      expect(updatedFeed.find((p) => p.id === initialFeed[1].id)).toBeUndefined();
      expect(updatedFeed.find((p) => p.id === initialFeed[2].id)).toBeUndefined();
    });
  });

  describe('4. Reset Database Functionality', () => {
    it('should restore all profiles and reset swipes and matches', async () => {
      await recordSwipe('prof_2', 'like');
      await recordSwipe('prof_3', 'pass');

      let matches = await getMutualMatches();
      expect(matches.length).toBe(1);

      await resetDatabase();

      matches = await getMutualMatches();
      expect(matches.length).toBe(0);

      const feed = await getFeedProfiles();
      expect(feed.length).toBeGreaterThanOrEqual(30);
      expect(feed.some((p) => p.id === 'prof_2')).toBe(true);
      expect(feed.some((p) => p.id === 'prof_3')).toBe(true);
    });
  });
});
