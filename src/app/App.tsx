// CRITICAL: Import init FIRST to block external calls
import './init';

import { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { TopBar } from './components/TopBar';
import { BottomNav } from './components/BottomNav';
import { NotificationPanel } from './components/NotificationPanel';
import { OnboardingFlow } from './components/OnboardingFlow';
import { ErrorBoundary, PageErrorBoundary } from './components/ErrorBoundary';
import { Dashboard } from './pages/Dashboard';
import { Discovery } from './pages/Discovery';
import { Nexus } from './pages/Nexus';
import { Community } from './pages/Community';
import { Events } from './pages/Events';
import { StoryDetail } from './pages/StoryDetail';
import { Profile } from './pages/Profile';
import { Search } from './pages/Search';
import { Settings } from './pages/Settings';
import { StoryEditor } from './pages/StoryEditor';
import { Auth } from './pages/Auth';
import { preferencesAPI } from './utils/api';
import { logger, LogCategory } from './utils/logger';
import { setupGlobalErrorHandlers } from './utils/errorHandler';
import { displayWelcomeMessage, startErrorMonitoring } from './utils/console';

// Initialize global error handlers
setupGlobalErrorHandlers();

// Display welcome message in console
displayWelcomeMessage();

// Start error monitoring
startErrorMonitoring();

function AppContent() {
  const { 
    currentPage, 
    setCurrentPage, 
    showOnboarding, 
    setShowOnboarding,
    isAuthenticated,
    currentUser,
    refreshAuth,
  } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);

  // Log app initialization
  useEffect(() => {
    logger.info(LogCategory.APP, 'App initialized', {
      isAuthenticated,
      currentUser: currentUser?.username,
      currentPage,
    });
  }, []);

  // Log page changes
  useEffect(() => {
    logger.info(LogCategory.NAVIGATION, `Navigated to page: ${currentPage}`);
  }, [currentPage]);

  const handleOnboardingComplete = async () => {
    logger.info(LogCategory.UI, 'Onboarding completed');
    setShowOnboarding(false);
    
    // Save onboarding completion to localStorage for guest mode
    localStorage.setItem('guestOnboardingComplete', 'true');
    
    // If real auth is restored in the future, save to backend
    if (isAuthenticated && currentUser && currentUser.id !== 'guest-user') {
      try {
        await preferencesAPI.update({ hasCompletedOnboarding: true });
        logger.info(LogCategory.API, 'Onboarding status saved to backend');
      } catch (error) {
        logger.error(LogCategory.API, 'Failed to save onboarding status', error);
        console.error('Failed to save onboarding status:', error);
      }
    }
  };

  const handleAuthSuccess = async () => {
    logger.info(LogCategory.AUTH, 'Auth success, refreshing state');
    // Refresh auth state without reloading
    await refreshAuth();
  };

  // AUTHENTICATION BYPASSED - Always show main app
  // (Auth check removed to skip login/signup screens)

  const renderPage = () => {
    try {
      switch (currentPage) {
        case 'home':
          return <PageErrorBoundary pageName="Dashboard"><Dashboard /></PageErrorBoundary>;
        case 'discover':
          return <PageErrorBoundary pageName="Discovery"><Discovery /></PageErrorBoundary>;
        case 'nexus':
          return <PageErrorBoundary pageName="Nexus"><Nexus /></PageErrorBoundary>;
        case 'community':
          return <PageErrorBoundary pageName="Community"><Community /></PageErrorBoundary>;
        case 'events':
          return <PageErrorBoundary pageName="Events"><Events /></PageErrorBoundary>;
        case 'story':
          return <PageErrorBoundary pageName="Story Detail"><StoryDetail /></PageErrorBoundary>;
        case 'profile':
          return <PageErrorBoundary pageName="Profile"><Profile /></PageErrorBoundary>;
        case 'search':
          return <PageErrorBoundary pageName="Search"><Search /></PageErrorBoundary>;
        case 'settings':
          return <PageErrorBoundary pageName="Settings"><Settings /></PageErrorBoundary>;
        case 'editor':
          return <PageErrorBoundary pageName="Story Editor"><StoryEditor /></PageErrorBoundary>;
        default:
          logger.warn(LogCategory.NAVIGATION, `Unknown page: ${currentPage}, defaulting to Dashboard`);
          return <PageErrorBoundary pageName="Dashboard"><Dashboard /></PageErrorBoundary>;
      }
    } catch (error) {
      logger.error(LogCategory.ERROR, 'Error rendering page', error);
      throw error;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Comic book halftone pattern background */}
      <div className="fixed inset-0 opacity-5" 
           style={{ 
             backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
             backgroundSize: '20px 20px'
           }} 
      />
      
      {/* Dynamic character silhouettes */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-10">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-gradient-to-br from-red-500 to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/4 right-0 w-80 h-[500px] bg-gradient-to-l from-blue-500 to-transparent blur-2xl" style={{ clipPath: 'polygon(100% 0, 100% 100%, 60% 100%, 40% 80%, 50% 40%, 40% 0)' }} />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-gradient-to-t from-yellow-500 to-transparent blur-2xl" style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }} />
        <div className="absolute top-1/2 left-0 w-72 h-72 bg-gradient-to-r from-orange-500 to-transparent blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
      
      {/* Action lines pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-5"
           style={{
             backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, #fff 10px, #fff 11px)',
           }}
      />
      
      <TopBar 
        onNotificationClick={() => setShowNotifications(true)}
        onProfileClick={() => setCurrentPage('profile')}
        onLogoClick={() => setCurrentPage('home')}
        onSettingsClick={() => setCurrentPage('settings')}
      />
      
      <main className="relative pt-24 pb-28 px-6 max-w-7xl mx-auto">
        {renderPage()}
      </main>

      <BottomNav 
        activePage={currentPage} 
        onNavigate={(page) => setCurrentPage(page)} 
      />

      <NotificationPanel 
        isOpen={showNotifications} 
        onClose={() => setShowNotifications(false)} 
      />

      {showOnboarding && (
        <OnboardingFlow onComplete={handleOnboardingComplete} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        logger.error(LogCategory.ERROR, 'Top-level error boundary caught error', {
          error: error.message,
          stack: error.stack,
          componentStack: errorInfo.componentStack,
        });
      }}
    >
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ErrorBoundary>
  );
}