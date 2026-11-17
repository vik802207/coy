# Coy — Discover & Double-Blind Matching

> **SDE Intern Assignment Submission for Coy ([app.getcoy.com](https://app.getcoy.com))**  
> Built with Next.js (App Router), TypeScript, Tailwind CSS, Framer Motion, and automated Vitest test suite.

---

## 📑 Table of Contents
1. [Part A: Product Experience & Core Feature Proposals](#part-a-product-experience--core-feature-proposals)
   - [Understanding Coy’s Value Proposition & Privacy Architecture](#understanding-coys-value-proposition--privacy-architecture)
   - [Feature 1: Campus & Community Blind Circles (Anonymized Aggregate Proximity Engine)](#feature-1-campus--community-blind-circles-anonymized-aggregate-proximity-engine)
   - [Feature 2: Decaying Slot Reclamation with Anti-Probing Shield](#feature-2-decaying-slot-reclamation-with-anti-probing-shield)
2. [Part B: "Discover" Tab Application](#part-b-discover-tab-application)
   - [Architecture & Tech Stack](#architecture--tech-stack)
   - [Strict Privacy-by-Design: Preserving Coy’s Promise](#strict-privacy-by-design-preserving-coys-promise)
   - [Core Features Implemented](#core-features-implemented)
   - [API Reference](#api-reference)
   - [Automated Testing](#automated-testing)
   - [Running the App Locally](#running-the-app-locally)

---

## Part A: Product Experience & Core Feature Proposals

### Understanding Coy’s Value Proposition & Privacy Architecture
Coy is fundamentally distinct from conventional dating apps (like Tinder, Bumble, or Hinge). While mainstream dating platforms are designed for strangers swiping on visual cards, **Coy is designed for people who already know each other in real life** (friends, campus peers, co-workers, acquaintances) but hesitate to express romantic feelings due to fear of awkwardness or rejection.

Through the app exploration flow:
- **Phone OTP Login**: Frictionless authentication verifying real mobile numbers.
- **Adding a Crush**: Users enter a phone number or email address into a finite set of "crush slots".
- **Email Verification**: Authenticates institutional affiliation (e.g. university domains) and validates account authenticity.
- **Invite Link / Nudge**: Contacts receive a subtle anonymous ping (*"Someone you know added you as their secret crush on Coy"*).
- **Extra Slots**: Monetization and anti-spam rate limiting.
- **Double-Blind Guarantee**: Under no circumstances does either party learn the other added them unless both have explicitly registered each other.

---

### Feature 1: Campus & Community Blind Circles (Anonymized Aggregate Proximity Engine)

#### 1. What is the feature?
A ring-fenced, email-domain-verified community space (e.g., `@stanford.edu`, `@berkeley.edu`, or corporate alumni) that provides **zero-knowledge, aggregate social proof**:
- Shows aggregate anonymous statistics: *"18 active crushes in your university department this week"* or *"You have 2 secret admirers on campus."*
- Implements a **k-anonymity threshold** ($k \ge 25$): counts are never displayed if a subgroup has fewer than 25 members, preventing triangulation.
- Allows browsing a directory of verified campus members by username/handle or pseudonym, enabling users to add peers without requiring their personal phone number upfront.

#### 2. Why is this feature required?
- **The Liquidity & Cold-Start Problem**: In a double-blind app, conversion requires both parties to be on the platform. The biggest user drop-off occurs when a user wonders: *"Is anyone I actually know on this app?"* Without social proof, users hesitate to invite acquaintances via blind SMS because it feels awkward or spammy.
- **Overcoming Slot Hesitation**: With scarce crush slots (3–5), users experience high loss aversion—they don't want to "waste" a slot on an acquaintance who might never join. Knowing that active crushes are circulating in their campus batch provides the psychological safety and urgency needed to use their slots.
- **Viral Growth Loop**: An aggregate counter (*"There are 3 secret crushes in your engineering dorm"*) creates immediate organic word-of-mouth and viral curiosity without violating individual confidentiality.

---

### Feature 2: Decaying Slot Reclamation with Anti-Probing Shield

#### 1. What is the feature?
A graceful time-decay reclamation mechanic for inactive or unreciprocated crush slots:
- If a target contact has not reciprocated after a 30-day window, the user can safely reclaim that slot to add someone new.
- **Anti-Probing Shield (Cryptographic Timing Jitter)**: To prevent a user from using Coy as a brute-force oracle (e.g. rapidly adding someone, checking if they matched, deleting, and trying someone else):
  1. Slots are locked for a minimum mandatory cooling period (e.g. 30 days).
  2. Reclaiming an unreciprocated slot never discloses whether the target registered, saw the invite, or chose not to reciprocate.
  3. The target's silent pending status remains intact on the server so that if the target joins later, a retroactive notification or match can still trigger gracefully.

#### 2. Why is this feature required?
- **Solving the "Zombie Slot" Churn Bottleneck**: In the current system, slots are permanently locked to prevent probing attacks. However, if a user adds a contact who has moved abroad, deleted their socials, or simply ignores anonymous SMS invites, that slot is permanently dead. Once a user burns their 5 slots with no matches, their utility on Coy drops to zero, leading directly to app abandonment.
- **Sustaining Long-Term Retention**: Giving users a controlled, safe way to cycle inactive slots after 30 days turns Coy into an ongoing companion app for their evolving social circle, rather than a one-time signup that gets abandoned after 48 hours.

---

## Part B: "Discover" Tab Application

To complement Coy's existing double-blind crush slots, this application introduces an intuitive, mobile-first **"Discover" tab**—enabling users to explore verified collegiate profiles using fluid swipe mechanics, with **Coy’s core promise strictly preserved in code**.

### Architecture & Tech Stack

| Component | Technology | Rationale |
| :--- | :--- | :--- |
| **Framework** | Next.js 15 (App Router) | Full-stack server/client boundary, instant API route handling |
| **Language** | TypeScript | Strong typing across models, swipe contracts, and API payloads |
| **Styling** | Tailwind CSS | Sleek, mobile-first design, rose/blush color palette true to Coy |
| **Animations** | Framer Motion | 60 FPS gesture-driven swipe physics, rotation, and spring releases |
| **Celebrations**| Canvas Confetti | Celebratory particle bursts on mutual matches |
| **Icons** | Lucide React | Modern, clean UI iconography |
| **Data Layer** | Atomic JSON File Database | Persistent data across server restarts & page reloads; zero native compilation dependencies |
| **Testing** | Vitest | Comprehensive automated test coverage for backend endpoints |

---

### Strict Privacy-by-Design: Preserving Coy’s Promise

> *"Never reveal who has liked the user unless it is mutual; this is the core promise of Coy."*

In standard dating apps, client payloads often leak whether another user has already liked the logged-in user. **In this application, privacy is enforced at the server layer:**

1. **Server-Side Sanitization**:  
   The database stores an internal flag `hasLikedCurrentUser: boolean` for seeded demo profiles. When `GET /feed` is queried, every profile is passed through `sanitizeProfile(record)` which explicitly strips `hasLikedCurrentUser`.
2. **DevTools Proof**:  
   Even if a user inspects the browser DevTools Network tab, the response contains only clean, public profile fields (`id`, `name`, `age`, `photo`, `bio`, `cityOrCollege`, `interests`, `promptQuestion`, `promptAnswer`).
3. **Double-Blind Evaluation**:  
   The determination of whether a swipe creates a match happens **solely inside the backend `recordSwipe` function**. Only when the current user sends `direction: 'like'` AND the server confirms a mutual like is `matched: true` returned.

---

### Core Features Implemented

1. **Rich Collegiate Profile Seed Data (32 Profiles)**:
   - Diverse profiles with real photos, realistic collegiate and city locations (Stanford, Berkeley, Columbia, NYU, Harvard, etc.), witty bios, and interest tags.
   - 10 seeded profiles pre-configured with reciprocal likes to enable authentic live match demonstrations.
2. **Mobile-First Gesture & Desktop Controls**:
   - Touch drag gestures on mobile with realistic rotational physics proportional to drag displacement.
   - Visual feedback: Dynamic green **LIKE** stamp (swiping right) and red **NOPE** stamp (swiping left) with real-time opacity interpolation.
   - Desktop action controls: Pass (❌), Like (💚), Super Like (⭐), Rewind/Undo (↺), and Info (ℹ️).
3. **No-Duplicate Feed Guarantee**:
   - Any profile that has been swiped on (whether liked or passed) is recorded in `coy_db.json` and will **never appear in the feed again**.
4. **"It's a Match!" Celebration Screen**:
   - Triggers immediately when a mutual match occurs.
   - Animated dual avatars connected by a pulsing heart badge.
   - Confetti particle explosion.
   - Direct button to open chat or keep swiping.
5. **Mutual Matches View & In-App Chat Preview**:
   - Dedicated "Matches" tab displaying all mutual matches with timestamps and common interests.
   - Search filter to search matches by name, college, or hobby.
   - Interactive double-blind chat drawer allowing users to send messages and receive simulated replies.
6. **Polished Empty State & 1-Click Demo Reset**:
   - Clear empty state when all profiles in the area have been reviewed.
   - Reset Demo button (`POST /api/reset`) to instantly restore the 32-profile feed for repeated testing.

---

### API Reference

All endpoints support both `/feed` and `/api/feed` paths via Next.js rewrites:

#### `GET /api/feed` (or `GET /feed`)
Returns all profiles the user has not yet swiped on.
- **Response `200 OK`**:
```json
{
  "success": true,
  "count": 32,
  "profiles": [
    {
      "id": "prof_1",
      "name": "Aarav Patel",
      "age": 22,
      "photo": "https://...",
      "bio": "Arch student & film photography addict...",
      "cityOrCollege": "Columbia University",
      "interests": ["Architecture", "Film Photography", "Indie Rock"]
    }
  ]
}
```

#### `POST /api/swipe` (or `POST /swipe`)
Records a swipe decision and returns whether a mutual match was triggered.
- **Request Body**:
```json
{
  "profileId": "prof_2",
  "direction": "like"
}
```
- **Response `200 OK` (Mutual Match)**:
```json
{
  "success": true,
  "matched": true,
  "match": {
    "id": "prof_2",
    "name": "Maya Sen",
    "age": 21,
    "photo": "https://...",
    "cityOrCollege": "Stanford University"
  }
}
```
- **Response `200 OK` (Pass or Non-mutual Like)**:
```json
{
  "success": true,
  "matched": false
}
```

#### `GET /api/matches` (or `GET /matches`)
Returns all mutual matches made by the user.
- **Response `200 OK`**:
```json
{
  "success": true,
  "count": 2,
  "matches": [
    {
      "id": "match_171...",
      "profileId": "prof_2",
      "profile": { ... },
      "matchedAt": "2026-11-17T12:00:00.000Z"
    }
  ]
}
```

#### `POST /api/reset`
Resets swipes and matches back to clean initial state.

---

### Automated Testing

Run the Vitest test suite:
```bash
npm test
```

Test coverage includes:
- Verification of 30+ seeded profiles in initial feed.
- **Strict Privacy Test**: asserting `hasLikedCurrentUser` is strictly undefined on every returned profile.
- Pass swipe recording without match creation.
- Non-mutual like recording without match creation.
- Mutual match creation triggering only when both users liked each other.
- Validation rejecting invalid swipe directions and unknown profile IDs.
- Disk-backed persistence across database reloads.
- Non-duplication rule ensuring swiped profiles never reappear.
- Demo reset functionality.

---

### Running the App Locally

1. **Install Dependencies**:
```bash
npm install
```

2. **Run Automated Tests**:
```bash
npm test
```

3. **Start Development Server**:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Production Build**:
```bash
npm run build
npm start
```
