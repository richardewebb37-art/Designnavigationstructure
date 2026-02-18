import { createContext, useContext, useState, ReactNode } from 'react';

export type Page = 'home' | 'discover' | 'nexus' | 'community' | 'events' | 'story' | 'profile' | 'search';

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
  currentUser: UserProfile;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  showOnboarding: boolean;
  setShowOnboarding: (show: boolean) => void;
  storyProgress: StoryProgress[];
  updateStoryProgress: (storyId: string, progress: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedStoryId, setSelectedStoryId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [storyProgress, setStoryProgress] = useState<StoryProgress[]>([]);
  
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

  const [currentUser] = useState<UserProfile>({
    id: 'user1',
    username: 'epicwriter',
    displayName: 'Epic Writer',
    avatar: '✍️',
    bio: 'Passionate storyteller crafting worlds one word at a time. Sci-fi enthusiast and comic book fanatic.',
    joinDate: '2025-06-15',
    worksPublished: 12,
    totalLikes: 5420,
    followers: 234,
    following: 89,
  });

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

  return (
    <AppContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        selectedStoryId,
        setSelectedStoryId,
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        currentUser,
        searchQuery,
        setSearchQuery,
        showOnboarding,
        setShowOnboarding,
        storyProgress,
        updateStoryProgress,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
