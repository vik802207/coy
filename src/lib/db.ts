import fs from 'fs';
import path from 'path';
import { DatabaseSchema, Profile, ProfileRecord, SwipeDirection, SwipeRecord, MatchRecord } from '@/types';
import { SEED_PROFILES } from '@/data/seedProfiles';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE_PATH = path.join(DATA_DIR, 'coy_db.json');

// Helper to strip sensitive privacy flags (e.g. hasLikedCurrentUser)
export function sanitizeProfile(record: ProfileRecord): Profile {
  const { hasLikedCurrentUser, ...safeProfile } = record;
  return safeProfile;
}

// In-memory mutex/flag to prevent race conditions during file writes
let writeLock: Promise<void> = Promise.resolve();

async function ensureDataDirectory(): Promise<void> {
  if (!fs.existsSync(DATA_DIR)) {
    await fs.promises.mkdir(DATA_DIR, { recursive: true });
  }
}

export async function getDatabase(): Promise<DatabaseSchema> {
  await ensureDataDirectory();

  if (!fs.existsSync(DB_FILE_PATH)) {
    const initialDb: DatabaseSchema = {
      profiles: SEED_PROFILES,
      swipes: {},
      matches: [],
    };
    await fs.promises.writeFile(DB_FILE_PATH, JSON.stringify(initialDb, null, 2), 'utf-8');
    return initialDb;
  }

  try {
    const rawData = await fs.promises.readFile(DB_FILE_PATH, 'utf-8');
    const parsed = JSON.parse(rawData) as DatabaseSchema;
    
    // Ensure all seed profiles exist in case seed was updated
    if (!parsed.profiles || parsed.profiles.length === 0) {
      parsed.profiles = SEED_PROFILES;
      await saveDatabase(parsed);
    }
    
    return parsed;
  } catch (error) {
    console.error('Error reading database file, re-initializing:', error);
    const fallbackDb: DatabaseSchema = {
      profiles: SEED_PROFILES,
      swipes: {},
      matches: [],
    };
    await fs.promises.writeFile(DB_FILE_PATH, JSON.stringify(fallbackDb, null, 2), 'utf-8');
    return fallbackDb;
  }
}

export async function saveDatabase(data: DatabaseSchema): Promise<void> {
  await ensureDataDirectory();
  
  // Chain writes to avoid race conditions
  writeLock = writeLock.then(async () => {
    await fs.promises.writeFile(DB_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
  });

  return writeLock;
}

/**
 * GET /feed API helper
 * Returns profiles that the user has NOT swiped on yet.
 * STRICT PRIVACY REQUIREMENT: hasLikedCurrentUser is stripped from each profile.
 */
export async function getFeedProfiles(): Promise<Profile[]> {
  const db = await getDatabase();
  const swipedIds = new Set(Object.keys(db.swipes));

  const unswiped = db.profiles.filter((p) => !swipedIds.has(p.id));

  // Sanitize every profile so the client NEVER sees hasLikedCurrentUser
  return unswiped.map(sanitizeProfile);
}

/**
 * POST /swipe API helper
 * Records a like or pass.
 * Returns { success: boolean, matched: boolean, match?: Profile }
 */
export async function recordSwipe(
  profileId: string,
  direction: SwipeDirection
): Promise<{ success: boolean; matched: boolean; match?: Profile; error?: string }> {
  if (!profileId || !direction) {
    return { success: false, matched: false, error: 'Missing profileId or direction' };
  }

  if (direction !== 'like' && direction !== 'pass') {
    return { success: false, matched: false, error: 'Direction must be "like" or "pass"' };
  }

  const db = await getDatabase();
  const profileRecord = db.profiles.find((p) => p.id === profileId);

  if (!profileRecord) {
    return { success: false, matched: false, error: 'Profile not found' };
  }

  // Double-Blind Matching Logic:
  // A match occurs ONLY if:
  // 1. Current user swiped 'like'
  // 2. The profile has already liked current user (hasLikedCurrentUser === true)
  const isMatch = direction === 'like' && Boolean(profileRecord.hasLikedCurrentUser);

  const swipeRecord: SwipeRecord = {
    id: `swipe_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    profileId,
    direction,
    timestamp: new Date().toISOString(),
    isMatch,
  };

  db.swipes[profileId] = swipeRecord;

  let sanitizedMatchedProfile: Profile | undefined;

  if (isMatch) {
    sanitizedMatchedProfile = sanitizeProfile(profileRecord);
    // Check if match already recorded
    const existingMatchIndex = db.matches.findIndex((m) => m.profileId === profileId);
    if (existingMatchIndex === -1) {
      const matchRecord: MatchRecord = {
        id: `match_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        profileId,
        profile: sanitizedMatchedProfile,
        matchedAt: new Date().toISOString(),
      };
      db.matches.unshift(matchRecord);
    }
  }

  await saveDatabase(db);

  return {
    success: true,
    matched: isMatch,
    match: isMatch ? sanitizedMatchedProfile : undefined,
  };
}

/**
 * GET /matches API helper
 * Returns all mutual matches with sanitized profile info.
 */
export async function getMutualMatches(): Promise<MatchRecord[]> {
  const db = await getDatabase();
  return db.matches;
}

/**
 * POST /reset API helper (for testing & demo purposes)
 */
export async function resetDatabase(): Promise<{ success: boolean; message: string }> {
  const freshDb: DatabaseSchema = {
    profiles: SEED_PROFILES,
    swipes: {},
    matches: [],
  };
  await saveDatabase(freshDb);
  return { success: true, message: 'Database reset successfully' };
}
