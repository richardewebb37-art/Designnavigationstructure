import { useState, useEffect } from 'react';
import { User, Bell, Lock, Palette, Info, LogOut, ArrowLeft, Save } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { authAPI, preferencesAPI } from '../utils/api';

export function Settings() {
  const { currentUser, setCurrentPage, setShowOnboarding, setCurrentUser } = useApp();
  const [activeTab, setActiveTab] = useState<'profile' | 'preferences' | 'account'>('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  // Profile form
  const [displayName, setDisplayName] = useState(currentUser.displayName);
  const [bio, setBio] = useState(currentUser.bio);
  const [avatar, setAvatar] = useState(currentUser.avatar);
  
  // Preferences
  const [notifications, setNotifications] = useState(true);
  const [theme, setTheme] = useState('dark');
  
  useEffect(() => {
    loadPreferences();
  }, []);
  
  const loadPreferences = async () => {
    try {
      const { preferences } = await preferencesAPI.get();
      setNotifications(preferences.notifications ?? true);
      setTheme(preferences.theme ?? 'dark');
    } catch (error) {
      console.error('Failed to load preferences:', error);
    }
  };
  
  const handleSaveProfile = async () => {
    setLoading(true);
    setMessage(null);
    
    try {
      const { profile } = await authAPI.updateProfile({
        displayName,
        bio,
        avatar,
      });
      
      // Update the current user context with the new profile
      setCurrentUser(profile);
      
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error: any) {
      console.error('Error updating profile:', error);
      setMessage({ type: 'error', text: error.message || 'Failed to update profile' });
    } finally {
      setLoading(false);
    }
  };
  
  const handleSavePreferences = async () => {
    setLoading(true);
    setMessage(null);
    
    try {
      await preferencesAPI.update({
        notifications,
        theme,
      });
      
      setMessage({ type: 'success', text: 'Preferences saved successfully!' });
    } catch (error: any) {
      console.error('Error saving preferences:', error);
      setMessage({ type: 'error', text: error.message || 'Failed to save preferences' });
    } finally {
      setLoading(false);
    }
  };
  
  const handleSignOut = async () => {
    if (!confirm('Are you sure you want to sign out?')) return;
    
    try {
      await authAPI.signOut();
      // Clear session storage to show splash screen on next load
      sessionStorage.clear();
      window.location.reload();
    } catch (error) {
      console.error('Error signing out:', error);
      setMessage({ type: 'error', text: 'Failed to sign out' });
    }
  };
  
  const handleResetOnboarding = () => {
    setShowOnboarding(true);
    setMessage({ type: 'success', text: 'Onboarding tour will show on next page navigation' });
  };
  
  const handleClearDatabase = async () => {
    if (!confirm('⚠️ WARNING: This will delete ALL data from the database including all users, stories, and preferences. This action cannot be undone. Are you absolutely sure?')) return;
    
    // Double confirmation
    if (!confirm('This is your FINAL warning. All data will be permanently deleted. Continue?')) return;
    
    setLoading(true);
    setMessage(null);
    
    try {
      const response = await fetch(`https://ufhieechwwjimvomqlrc.supabase.co/functions/v1/make-server-30e38e62/admin/clear-database`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to clear database');
      }
      
      const result = await response.json();
      console.log('Database cleared:', result);
      
      setMessage({ 
        type: 'success', 
        text: `Database cleared! Deleted: ${result.deleted.authUsers} auth users, ${result.deleted.kvStore.total} KV records (${result.deleted.kvStore.users} profiles, ${result.deleted.kvStore.stories} stories)` 
      });
      
      // Sign out and reload after a delay
      setTimeout(async () => {
        await authAPI.signOut();
        window.location.reload();
      }, 2000);
    } catch (error: any) {
      console.error('Error clearing database:', error);
      setMessage({ type: 'error', text: error.message || 'Failed to clear database' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Back Button */}
      <button
        onClick={() => setCurrentPage('home')}
        className="mb-2 flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl border-2 border-slate-600 hover:border-yellow-400 transition-all text-white font-bold"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Dashboard
      </button>

      {/* Header */}
      <div className="relative p-6 rounded-2xl border-4 border-yellow-400 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 shadow-2xl">
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-red-500 via-yellow-400 to-blue-500" />
        
        <h1 className="font-black text-3xl text-white tracking-tight">Settings</h1>
        <p className="text-slate-400 font-bold">Manage your account and preferences</p>
      </div>

      {/* Message Banner */}
      {message && (
        <div className={`p-4 rounded-xl border-2 ${
          message.type === 'success' 
            ? 'bg-green-900/30 border-green-400 text-green-400' 
            : 'bg-red-900/30 border-red-400 text-red-400'
        }`}>
          <p className="font-bold">{message.text}</p>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b-2 border-slate-700">
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-6 py-3 font-black transition-all ${
            activeTab === 'profile'
              ? 'text-white bg-gradient-to-b from-slate-700 to-slate-800 border-b-4 border-yellow-400 -mb-0.5'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <User className="w-5 h-5" />
          Profile
        </button>
        <button
          onClick={() => setActiveTab('preferences')}
          className={`flex items-center gap-2 px-6 py-3 font-black transition-all ${
            activeTab === 'preferences'
              ? 'text-white bg-gradient-to-b from-slate-700 to-slate-800 border-b-4 border-yellow-400 -mb-0.5'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Palette className="w-5 h-5" />
          Preferences
        </button>
        <button
          onClick={() => setActiveTab('account')}
          className={`flex items-center gap-2 px-6 py-3 font-black transition-all ${
            activeTab === 'account'
              ? 'text-white bg-gradient-to-b from-slate-700 to-slate-800 border-b-4 border-yellow-400 -mb-0.5'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Lock className="w-5 h-5" />
          Account
        </button>
      </div>

      {/* Content */}
      <div className="p-8 bg-slate-800 rounded-2xl border-2 border-slate-600">
        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <div>
              <label className="block text-white font-bold mb-2">Avatar Emoji</label>
              <input
                type="text"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                maxLength={2}
                className="w-32 px-4 py-3 bg-slate-700 border-2 border-slate-600 focus:border-yellow-400 rounded-xl text-white font-bold text-center text-3xl outline-none transition-all"
              />
              <p className="text-slate-400 text-sm mt-2">Choose a single emoji to represent you</p>
            </div>

            <div>
              <label className="block text-white font-bold mb-2">Display Name</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-4 py-3 bg-slate-700 border-2 border-slate-600 focus:border-yellow-400 rounded-xl text-white font-bold outline-none transition-all"
                placeholder="Your display name"
              />
            </div>

            <div>
              <label className="block text-white font-bold mb-2">Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 bg-slate-700 border-2 border-slate-600 focus:border-yellow-400 rounded-xl text-white font-medium outline-none transition-all resize-none"
                placeholder="Tell us about yourself..."
              />
            </div>

            <button
              onClick={handleSaveProfile}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 disabled:from-slate-700 disabled:to-slate-700 rounded-xl text-white font-black border-2 border-green-400 disabled:border-slate-600 transition-all disabled:cursor-not-allowed"
            >
              <Save className="w-5 h-5" />
              {loading ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        )}

        {/* Preferences Tab */}
        {activeTab === 'preferences' && (
          <div className="space-y-6">
            <div className="p-4 bg-slate-700/50 rounded-xl border-2 border-slate-600">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <Bell className="w-6 h-6 text-yellow-400" />
                  <div>
                    <h3 className="text-white font-bold">Notifications</h3>
                    <p className="text-slate-400 text-sm">Receive updates about your stories and interactions</p>
                  </div>
                </div>
                <button
                  onClick={() => setNotifications(!notifications)}
                  className={`relative w-14 h-7 rounded-full transition-all ${
                    notifications ? 'bg-green-600' : 'bg-slate-600'
                  }`}
                >
                  <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                    notifications ? 'translate-x-7' : ''
                  }`} />
                </button>
              </div>
            </div>

            <div className="p-4 bg-slate-700/50 rounded-xl border-2 border-slate-600">
              <div className="flex items-center gap-3 mb-3">
                <Palette className="w-6 h-6 text-blue-400" />
                <div>
                  <h3 className="text-white font-bold">Theme</h3>
                  <p className="text-slate-400 text-sm">Choose your preferred color scheme</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setTheme('dark')}
                  className={`flex-1 px-4 py-3 rounded-lg font-bold transition-all border-2 ${
                    theme === 'dark'
                      ? 'bg-gradient-to-r from-slate-700 to-slate-800 border-yellow-400 text-white'
                      : 'bg-slate-700 border-slate-600 text-slate-400 hover:border-slate-500'
                  }`}
                >
                  🌙 Dark
                </button>
                <button
                  onClick={() => setTheme('light')}
                  className={`flex-1 px-4 py-3 rounded-lg font-bold transition-all border-2 ${
                    theme === 'light'
                      ? 'bg-gradient-to-r from-slate-700 to-slate-800 border-yellow-400 text-white'
                      : 'bg-slate-700 border-slate-600 text-slate-400 hover:border-slate-500'
                  }`}
                >
                  ☀️ Light
                </button>
              </div>
            </div>

            <div className="p-4 bg-slate-700/50 rounded-xl border-2 border-slate-600">
              <div className="flex items-center gap-3 mb-3">
                <Info className="w-6 h-6 text-purple-400" />
                <div>
                  <h3 className="text-white font-bold">Onboarding Tour</h3>
                  <p className="text-slate-400 text-sm">View the welcome tour again</p>
                </div>
              </div>
              <button
                onClick={handleResetOnboarding}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-white font-bold transition-all"
              >
                Show Tour Again
              </button>
            </div>

            <button
              onClick={handleSavePreferences}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 disabled:from-slate-700 disabled:to-slate-700 rounded-xl text-white font-black border-2 border-green-400 disabled:border-slate-600 transition-all disabled:cursor-not-allowed"
            >
              <Save className="w-5 h-5" />
              {loading ? 'Saving...' : 'Save Preferences'}
            </button>
          </div>
        )}

        {/* Account Tab */}
        {activeTab === 'account' && (
          <div className="space-y-6">
            <div className="p-4 bg-blue-900/30 rounded-xl border-2 border-blue-400">
              <div className="flex items-center gap-3 mb-2">
                <User className="w-6 h-6 text-blue-400" />
                <h3 className="text-white font-bold">Account Information</h3>
              </div>
              <p className="text-slate-300">
                <span className="font-bold">Username:</span> @{currentUser.username}
              </p>
              <p className="text-slate-300 mt-1">
                <span className="font-bold">Member since:</span> {new Date(currentUser.joinDate).toLocaleDateString()}
              </p>
            </div>

            <div className="p-6 bg-red-900/20 rounded-xl border-2 border-red-600">
              <div className="flex items-center gap-3 mb-4">
                <LogOut className="w-6 h-6 text-red-400" />
                <div>
                  <h3 className="text-white font-bold">Sign Out</h3>
                  <p className="text-slate-400 text-sm">Sign out from your account</p>
                </div>
              </div>
              <button
                onClick={handleSignOut}
                className="px-6 py-3 bg-red-600 hover:bg-red-500 rounded-xl text-white font-black border-2 border-red-400 transition-all"
              >
                Sign Out
              </button>
            </div>

            <div className="p-6 bg-red-900/20 rounded-xl border-2 border-red-600">
              <div className="flex items-center gap-3 mb-4">
                <LogOut className="w-6 h-6 text-red-400" />
                <div>
                  <h3 className="text-white font-bold">Clear Database</h3>
                  <p className="text-slate-400 text-sm">Delete all data from the database</p>
                </div>
              </div>
              <button
                onClick={handleClearDatabase}
                disabled={loading}
                className="px-6 py-3 bg-red-600 hover:bg-red-500 rounded-xl text-white font-black border-2 border-red-400 transition-all disabled:cursor-not-allowed"
              >
                {loading ? 'Clearing...' : 'Clear Database'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}