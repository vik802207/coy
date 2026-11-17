export interface Profile {
  id: string;
  name: string;
  age: number;
  photo: string;
  photos?: string[];
  bio: string;
  cityOrCollege: string;
  interests: string[];
  distanceKm?: number;
  promptQuestion?: string;
  promptAnswer?: string;
  verified?: boolean;
}

// Internal representation in database
export interface ProfileRecord extends Profile {
  hasLikedCurrentUser: boolean;
}

export type SwipeDirection = 'like' | 'pass';

export interface SwipeRecord {
  id: string;
  profileId: string;
  direction: SwipeDirection;
  timestamp: string;
  isMatch: boolean;
}

export interface MatchRecord {
  id: string;
  profileId: string;
  profile: Profile;
  matchedAt: string;
}

export interface SwipeRequest {
  profileId: string;
  direction: SwipeDirection;
}

export interface SwipeResponse {
  success: boolean;
  direction: SwipeDirection;
  matched: boolean;
  match?: Profile;
  message?: string;
}

export interface DatabaseSchema {
  profiles: ProfileRecord[];
  swipes: Record<string, SwipeRecord>; // keyed by profileId
  matches: MatchRecord[];
}
