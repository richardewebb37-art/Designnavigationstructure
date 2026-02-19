import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { authAPI, preferencesAPI } from '../utils/api';
import { logger, LogCategory } from '../utils/logger';

export type Page = 'home' | 'discover' | 'nexus' | 'community' | 'events' | 'story' | 'profile' | 'search' | 'settings' | 'editor';

export interface Notification {
  id: string;
  type: 'update' | 'comment' | 'like' | 'event' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  link?: { page: Page; id?: string };
}

export interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  bio: string;
  joinDate: string;
  worksPublished: number;
  totalLikes: number;
  followers: number;
  following: number;
}

export interface StoryProgress {
  storyId: string;
  progress: number;
  lastRead: string;
}

interface AppContextType {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  selectedStoryId: string | null;
  setSelectedStoryId: (id: string | null) => void;
  notifications: Notification[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  currentUser: UserProfile | null;
  setCurrentUser: (user: UserProfile | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  showOnboarding: boolean;
  setShowOnboarding: (show: boolean) => void;
  storyProgress: StoryProgress[];
  updateStoryProgress: (storyId: string, progress: number) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (auth: boolean) => void;
  refreshAuth: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  // SET GUEST MODE IMMEDIATELY - Before any other initialization
  if (typeof window !== 'undefined' && !localStorage.getItem('guest-mode')) {
    localStorage.setItem('guest-mode', 'true');
    logger.info(LogCategory.STORAGE, 'Guest mode enabled on first load');
  }

  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedStoryId, setSelectedStoryId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [storyProgress, setStoryProgress] = useState<StoryProgress[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'update',
      title: 'New Chapter',
      message: 'The Last Jedi Chronicles updated with Chapter 12',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      read: false,
      link: { page: 'story', id: '1' }
    },
    {
      id: '2',
      type: 'comment',
      title: 'New Comment',
      message: 'CosmicReader commented on your story "Neon Dreams"',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      read: false,
      link: { page: 'story', id: '2' }
    },
    {
      id: '3',
      type: 'event',
      title: 'Event Reminder',
      message: 'Monthly Writing Challenge ends in 3 days!',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      read: false,
      link: { page: 'events' }
    },
    {
      id: '4',
      type: 'like',
      title: '50 New Likes',
      message: 'Your story "Whispers of Eternity" reached 750 likes!',
      timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
      read: true,
    },
    {
      id: '5',
      type: 'system',
      title: 'Welcome Back',
      message: 'Check out new features in the Discovery page',
      timestamp: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
      read: true,
      link: { page: 'discover' }
    },
  ]);

  // Check authentication on mount
  useEffect(() => {
    logger.info(LogCategory.AUTH, 'Initializing authentication...');
    // BYPASS AUTH - Skip authentication check and set up guest user
    console.log('🎮 Running in guest mode - authentication bypassed');
    logger.info(LogCategory.AUTH, 'Running in guest mode - authentication bypassed');
    setupGuestMode();
  }, []);

  const setupGuestMode = () => {
    logger.info(LogCategory.AUTH, 'Setting up guest mode');
    // Create a guest user profile
    const guestUser: UserProfile = {
      id: 'guest-user',
      username: 'guest',
      displayName: 'Guest User',
      avatar: '👤',
      bio: 'Welcome! You are browsing as a guest.',
      joinDate: new Date().toISOString(),
      worksPublished: 0,
      totalLikes: 0,
      followers: 0,
      following: 0,
    };

    setIsAuthenticated(true);
    setCurrentUser(guestUser);
    
    // Mark as guest mode in localStorage
    localStorage.setItem('guest-mode', 'true');
    logger.info(LogCategory.STORAGE, 'Guest mode flag set in localStorage');
    
    // Show onboarding for first visit
    const hasSeenOnboarding = localStorage.getItem('guestOnboardingComplete');
    if (!hasSeenOnboarding) {
      logger.info(LogCategory.UI, 'First visit detected, showing onboarding');
      setShowOnboarding(true);
    } else {
      logger.info(LogCategory.UI, 'Onboarding already completed, skipping');
    }
    
    console.log('✅ Guest mode setup complete');
    logger.info(LogCategory.AUTH, 'Guest mode setup complete');
  };

  const checkAuth = async () => {
    // This function is kept for potential future use but not called
    console.log('🔍 Checking authentication...');
    try {
      const session = await authAPI.getSession();
      console.log('📝 Session:', session ? 'Found' : 'Not found');
      
      if (session) {
        console.log('🔑 Session has access token:', !!session.access_token);
        
        // Make sure token is stored
        if (session.access_token) {
          localStorage.setItem('access_token', session.access_token);
          console.log('💾 Token stored in localStorage');
        } else {
          console.error('❌ Session exists but no access_token!');
          setIsAuthenticated(false);
          setCurrentUser(null);
          localStorage.removeItem('access_token');
          return;
        }
        
        setIsAuthenticated(true);
        console.log('✅ User is authenticated');
        
        try {
          // Load user profile with retry logic
          console.log('👤 Fetching user profile...');
          const { profile } = await authAPI.getProfile();
          console.log('✅ Profile loaded:', profile);
          setCurrentUser(profile);
          
          // Check if should show onboarding
          try {
            console.log('⚙️ Fetching preferences...');
            const { preferences } = await preferencesAPI.get();
            console.log('✅ Preferences loaded:', preferences);
            if (!preferences.hasCompletedOnboarding) {
              console.log('🎓 Showing onboarding');
              setShowOnboarding(true);
            } else {
              console.log('✓ Onboarding already completed');
            }
          } catch (prefError) {
            console.error('❌ Failed to load preferences:', prefError);
            // If preferences don't exist yet, show onboarding
            setShowOnboarding(true);
          }
        } catch (profileError: any) {
          console.error('❌ Failed to load profile:', profileError);
          console.error('Error details:', profileError);
          
          // If we get an auth error, force complete logout and clear everything
          console.log('🧹 Forcing complete logout due to profile fetch failure...');
          
          try {
            // Try to sign out properly
            await authAPI.signOut();
          } catch (signOutError) {
            console.error('Sign out also failed:', signOutError);
          }
          
          // Clear all local data
          localStorage.clear();
          sessionStorage.clear();
          
          // Reset state
          setIsAuthenticated(false);
          setCurrentUser(null);
          setShowOnboarding(false);
          
          console.log('✅ Complete logout finished, user needs to sign in again');
        }
      } else {
        console.log('❌ No session found');
        setIsAuthenticated(false);
        setCurrentUser(null);
        localStorage.removeItem('access_token');
      }
    } catch (error) {
      console.error('❌ Auth check failed:', error);
      console.error('Error details:', error);
      
      // Complete cleanup on any error
      setIsAuthenticated(false);
      setCurrentUser(null);
      localStorage.removeItem('access_token');
    }
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const updateStoryProgress = (storyId: string, progress: number) => {
    setStoryProgress(prev => {
      const existing = prev.find(p => p.storyId === storyId);
      if (existing) {
        return prev.map(p =>
          p.storyId === storyId
            ? { ...p, progress, lastRead: new Date().toISOString() }
            : p
        );
      }
      return [...prev, { storyId, progress, lastRead: new Date().toISOString() }];
    });
  };

  const refreshAuth = async () => {
    await checkAuth();
  };

  const value: AppContextType = {
    currentPage,
    setCurrentPage,
    selectedStoryId,
    setSelectedStoryId,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    currentUser,
    setCurrentUser,
    searchQuery,
    setSearchQuery,
    showOnboarding,
    setShowOnboarding,
    storyProgress,
    updateStoryProgress,
    isAuthenticated,
    setIsAuthenticated,
    refreshAuth,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}