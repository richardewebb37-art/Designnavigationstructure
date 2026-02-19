# The Fictionverse - Implementation Guide

## Overview
The Fictionverse is a full-stack creative writing and reading platform with authentication, story management, and social features.

## Architecture

### Frontend
- **Framework**: React with TypeScript
- **Styling**: Tailwind CSS v4
- **State Management**: React Context API
- **Auth**: Supabase Auth
- **API Client**: Custom fetch-based API utilities

### Backend
- **Runtime**: Deno (Supabase Edge Functions)
- **Framework**: Hono
- **Database**: Supabase KV Store
- **Auth**: Supabase Authentication

## Pages & Features

### 1. Authentication (`/src/app/pages/Auth.tsx`)
- Sign up with email, password, display name, and username
- Sign in with email and password
- Auto-redirect after authentication
- Session management with localStorage

### 2. Dashboard (`/src/app/pages/Dashboard.tsx`)
- Welcome page with featured stories
- Quick access to main features
- Personalized content

### 3. Discovery (`/src/app/pages/Discovery.tsx`)
- Browse trending and new stories
- Filter by universe and genre
- Curated collections

### 4. Nexus (`/src/app/pages/Nexus.tsx`)
- Library system with 4 sections:
  - Inspired By (fan fiction)
  - Original Works
  - Archive
  - My Library
- Story filtering and organization

### 5. Community (`/src/app/pages/Community.tsx`)
- Connect with other writers and readers
- Discussion forums
- Author spotlights

### 6. Events (`/src/app/pages/Events.tsx`)
- Writing challenges
- Community contests
- Virtual conventions

### 7. Story Detail (`/src/app/pages/StoryDetail.tsx`)
- Read stories chapter by chapter
- Like, bookmark, and share
- Reading progress tracking
- Comments section
- Chapter navigation

### 8. Search (`/src/app/pages/Search.tsx`)
- Full-text search across stories
- Filter by universe, type, and sort options
- Trending searches
- Advanced filtering

### 9. Profile (`/src/app/pages/Profile.tsx`)
- User statistics (works, likes, followers)
- Published works grid
- Edit and manage stories
- Activity feed
- Create new stories

### 10. Story Editor (`/src/app/pages/StoryEditor.tsx`)
- Create and edit stories
- Multi-chapter support
- Add/remove chapters
- Tag management
- Universe selection
- Draft vs. Published status
- Delete stories

### 11. Settings (`/src/app/pages/Settings.tsx`)
- Profile customization (avatar, display name, bio)
- Notification preferences
- Theme selection
- Reset onboarding tour
- Account information
- Sign out

## Components

### Core Components
- **TopBar**: Fixed header with logo, notifications, user menu
- **BottomNav**: Fixed bottom navigation (6 buttons)
- **NotificationPanel**: Slide-in panel with real-time notifications
- **OnboardingFlow**: 4-step welcome tour for new users
- **WorkCard**: Reusable story card component

## Backend API

### Base URL
`https://{projectId}.supabase.co/functions/v1/make-server-30e38e62`

### Authentication Endpoints

#### POST `/auth/signup`
Create new user account
```json
{
  "email": "user@example.com",
  "password": "password",
  "displayName": "John Doe",
  "username": "johndoe"
}
```

### Story Endpoints

#### GET `/stories`
Get all stories

#### GET `/stories/:id`
Get specific story

#### GET `/stories/user/:userId`
Get user's stories

#### POST `/stories`
Create new story (requires auth)
```json
{
  "title": "Story Title",
  "description": "Story description",
  "type": "original" | "inspired",
  "universe": "Marvel" (optional),
  "tags": ["tag1", "tag2"],
  "chapters": [
    { "title": "Chapter 1", "content": "..." }
  ]
}
```

#### PUT `/stories/:id`
Update story (requires auth, owner only)

#### DELETE `/stories/:id`
Delete story (requires auth, owner only)

#### POST `/stories/:id/like`
Toggle like on story (requires auth)

### Profile Endpoints

#### GET `/auth/profile`
Get current user profile (requires auth)

#### PUT `/auth/profile`
Update user profile (requires auth)
```json
{
  "displayName": "New Name",
  "bio": "New bio",
  "avatar": "🎨"
}
```

### Preferences Endpoints

#### GET `/preferences`
Get user preferences (requires auth)

#### PUT `/preferences`
Update preferences (requires auth)
```json
{
  "hasCompletedOnboarding": true,
  "notifications": true,
  "theme": "dark"
}
```

## State Management

### AppContext
Global state includes:
- `currentPage`: Active page
- `selectedStoryId`: Currently viewed story
- `notifications`: User notifications
- `currentUser`: Authenticated user profile
- `searchQuery`: Search input
- `showOnboarding`: Onboarding visibility
- `storyProgress`: Reading progress for stories
- `isAuthenticated`: Auth status

## Authentication Flow

1. App loads → Check session with Supabase
2. If no session → Show Auth page
3. User signs up or signs in
4. Session token stored in localStorage
5. User profile fetched from backend
6. Check onboarding status
7. Show onboarding if first-time user
8. Redirect to Dashboard

## Data Storage

### KV Store Keys
- `user:{userId}` - User profile data
- `username:{username}` - Username to userId mapping
- `story:{storyId}` - Story content and metadata
- `like:{userId}:{storyId}` - Like relationship
- `preferences:{userId}` - User preferences

## Security

- Service role key never exposed to frontend
- All authenticated requests use Bearer token
- Protected routes verify auth token
- Users can only edit/delete own stories
- Email auto-confirmed (email server not configured)

## Design System

### Colors
- Red: `from-red-500 to-red-700`
- Blue: `from-blue-600 to-blue-700`
- Yellow/Orange: `from-yellow-600 to-orange-600`
- Green: `from-green-600 to-green-700`
- Purple: `from-purple-600 to-purple-700`

### Border Style
- Primary: `border-4 border-yellow-400`
- Accent line: `gradient from red via yellow to blue`
- Comic style: Bold borders, vibrant colors

### Typography
- Headings: `font-black` (900 weight)
- Body: `font-bold` or `font-medium`
- Tracking: `tracking-tight` for large text

## Future Enhancements

- Social login (Google, GitHub)
- Following system
- Comment system with backend
- Real-time notifications
- File uploads for cover images
- Email notifications
- Admin panel
- Content moderation
- Search optimization
- Analytics dashboard
