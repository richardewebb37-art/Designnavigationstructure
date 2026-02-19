import { User, Bell } from 'lucide-react';
import { useState } from 'react';
import { useApp } from '../context/AppContext';

interface TopBarProps {
  onNotificationClick: () => void;
  onProfileClick: () => void;
  onLogoClick: () => void;
  onSettingsClick: () => void;
}

export function TopBar({ onNotificationClick, onProfileClick, onLogoClick, onSettingsClick }: TopBarProps) {
  const [showMenu, setShowMenu] = useState(false);
  const { notifications } = useApp();
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="fixed top-0 left-0 right-0 h-20 z-50">
      <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-xl border-b-4 border-red-500" />
      {/* Comic book accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-yellow-400 to-blue-500" />
      
      <div className="relative h-full max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <div onClick={onLogoClick} className="group cursor-pointer flex items-center">
          <div className="flex items-center gap-2">
            <div className="text-4xl">📚</div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight leading-none">
                The Fictionverse
              </h1>
              <p className="text-[10px] sm:text-xs font-bold text-yellow-400 uppercase tracking-wide">
                By AlterOne Studio
              </p>
            </div>
          </div>
        </div>

        {/* Right Side Icons */}
        <div className="flex items-center gap-3">
          {/* Notification Bell */}
          <button 
            onClick={onNotificationClick}
            className="w-11 h-11 bg-gradient-to-br from-yellow-600 to-orange-600 rounded-lg flex items-center justify-center border-2 border-yellow-400 hover:border-white transition-all transform hover:scale-105 shadow-lg hover:shadow-yellow-500/50 relative"
          >
            <Bell className="w-6 h-6 text-white" strokeWidth={2.5} />
            {/* Notification badge */}
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 border-2 border-slate-900 rounded-full text-[10px] font-black text-white flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="w-11 h-11 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center border-2 border-blue-400 hover:border-yellow-400 transition-all transform hover:scale-105 shadow-lg hover:shadow-blue-500/50"
            >
              <User className="w-6 h-6 text-white" strokeWidth={2.5} />
            </button>
            
            {showMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                <div className="absolute right-0 mt-3 w-56 bg-slate-800 rounded-xl shadow-2xl border-3 border-yellow-400 overflow-hidden z-50">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-yellow-400 to-blue-500" />
                  <div className="p-2 pt-3">
                    <button 
                      onClick={() => {
                        onProfileClick();
                        setShowMenu(false);
                      }}
                      className="w-full px-4 py-3 text-left text-sm font-bold text-white hover:bg-red-500 rounded-lg transition-all"
                    >
                      Profile
                    </button>
                    <button 
                      onClick={() => {
                        onSettingsClick();
                        setShowMenu(false);
                      }}
                      className="w-full px-4 py-3 text-left text-sm font-bold text-white hover:bg-blue-500 rounded-lg transition-all"
                    >
                      Settings
                    </button>
                    <div className="h-px bg-yellow-400/30 my-2 mx-2" />
                    <button 
                      onClick={async () => {
                        if (confirm('Are you sure you want to sign out?')) {
                          try {
                            const { authAPI } = await import('../utils/api');
                            await authAPI.signOut();
                            window.location.reload();
                          } catch (error) {
                            console.error('Sign out error:', error);
                          }
                        }
                        setShowMenu(false);
                      }}
                      className="w-full px-4 py-3 text-left text-sm font-bold text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-all"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}