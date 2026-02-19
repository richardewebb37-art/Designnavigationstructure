import { useState } from 'react';
import { User, Mail, Lock } from 'lucide-react';
import { authAPI } from '../utils/api';
import { SplashScreen } from '../components/SplashScreen';

interface AuthProps {
  onSuccess: () => void;
}

export function Auth({ onSuccess }: AuthProps) {
  // FORCE SPLASH SCREEN TO SHOW - Always show on load
  const [showSplash, setShowSplash] = useState(true);
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');

  console.log('🔑 Auth component rendering - showSplash:', showSplash);

  if (showSplash) {
    console.log('✅ Rendering SplashScreen component');
    return <SplashScreen onComplete={() => {
      console.log('🎬 SplashScreen onComplete called - hiding splash');
      setShowSplash(false);
      sessionStorage.setItem('hasSeenSplash', 'true');
    }} />;
  }

  console.log('✅ Rendering Auth form');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === 'signup') {
        if (!displayName.trim()) {
          setError('Display name is required');
          setLoading(false);
          return;
        }
        if (!username.trim()) {
          setError('Username is required');
          setLoading(false);
          return;
        }
        
        console.log('Starting signup process...');
        await authAPI.signUp(email, password, displayName, username);
        console.log('Signup successful, signing in user...');
        
        // After successful signup, sign them in
        await authAPI.signIn(email, password);
        console.log('Sign in successful!');
      } else {
        console.log('Starting sign in process...');
        await authAPI.signIn(email, password);
        console.log('Sign in successful!');
      }
      
      console.log('Calling onSuccess callback...');
      
      // Small delay to ensure token is properly stored
      await new Promise(resolve => setTimeout(resolve, 500));
      
      onSuccess();
    } catch (err: any) {
      console.error('Auth error:', err);
      let errorMsg = err.message || 'Authentication failed';
      
      // Provide helpful error messages
      if (errorMsg.includes('Invalid login credentials')) {
        errorMsg = 'Invalid email or password. Please check your credentials and try again.';
      } else if (errorMsg.includes('Email not confirmed')) {
        errorMsg = 'Please check your email to confirm your account.';
      } else if (errorMsg.includes('already registered')) {
        errorMsg = 'This email is already registered. Please sign in instead.';
        // Automatically switch to sign-in mode
        setMode('signin');
        // Clear the signup-only fields
        setDisplayName('');
        setUsername('');
      }
      
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6 overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 opacity-5" 
           style={{ 
             backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
             backgroundSize: '20px 20px'
           }} 
      />
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-10">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-gradient-to-br from-red-500 to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/4 right-0 w-80 h-[500px] bg-gradient-to-l from-blue-500 to-transparent blur-2xl" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-gradient-to-t from-yellow-500 to-transparent blur-2xl" />
      </div>

      {/* Auth Form - Centered */}
      <div className="relative z-10 w-full max-w-md">
        <div className="relative p-8 rounded-xl bg-slate-800/50 backdrop-blur-sm">
          
          {/* Title */}
          <h1 className="text-2xl font-bold text-white mb-6 text-center">
            {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
          </h1>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-900/30 rounded-lg">
              <p className="text-red-400 font-medium text-sm">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Sign Up Only Fields */}
            {mode === 'signup' && (
              <>
                <div>
                  <label className="block text-slate-300 font-medium mb-2 text-sm">Display Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-slate-700/50 border border-slate-600 focus:border-yellow-400 rounded-lg text-white font-medium outline-none transition-all"
                      placeholder="Your name"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-2 text-sm">Username</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">@</span>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                      className="w-full pl-8 pr-4 py-3 bg-slate-700/50 border border-slate-600 focus:border-yellow-400 rounded-lg text-white font-medium outline-none transition-all"
                      placeholder="username"
                      required
                    />
                  </div>
                </div>
              </>
            )}

            {/* Email */}
            <div>
              <label className="block text-slate-300 font-medium mb-2 text-sm">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-700/50 border border-slate-600 focus:border-yellow-400 rounded-lg text-white font-medium outline-none transition-all"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-slate-300 font-medium mb-2 text-sm">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-700/50 border border-slate-600 focus:border-yellow-400 rounded-lg text-white font-medium outline-none transition-all"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 rounded-lg text-white font-bold transition-all disabled:cursor-not-allowed bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 disabled:from-slate-700 disabled:to-slate-700"
            >
              {loading ? 'Please wait...' : mode === 'signin' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          {/* Note about email verification */}
          {mode === 'signup' && (
            <div className="mt-4 p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
              <p className="text-blue-300 text-xs text-center">
                Note: Email verification is currently disabled for development. Your account will be created and you'll be signed in automatically.
              </p>
            </div>
          )}

          {/* Bottom Links */}
          <div className="mt-6 space-y-3 text-center">
            {mode === 'signin' ? (
              <>
                <div>
                  <button
                    onClick={() => alert('Password reset functionality coming soon!')}
                    className="text-slate-400 hover:text-yellow-400 text-sm transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
                <div>
                  <span className="text-slate-400 text-sm">Don't have an account? </span>
                  <button
                    onClick={() => {
                      setMode('signup');
                      setError(null);
                    }}
                    className="text-yellow-400 hover:text-yellow-300 text-sm font-medium transition-colors"
                  >
                    Create account
                  </button>
                </div>
              </>
            ) : (
              <div>
                <span className="text-slate-400 text-sm">Already have an account? </span>
                <button
                  onClick={() => {
                    setMode('signin');
                    setError(null);
                  }}
                  className="text-yellow-400 hover:text-yellow-300 text-sm font-medium transition-colors"
                >
                  Sign in
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Branding Footer */}
        <div className="mt-6 text-center">
          <p className="text-slate-500 text-sm font-bold">
            Powered by{' '}
            <span 
              className="font-black"
              style={{
                background: 'linear-gradient(90deg, #fbbf24 0%, #f97316 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              AlterOne Studio
            </span>
          </p>
          <button
            onClick={() => {
              sessionStorage.removeItem('hasSeenSplash');
              window.location.reload();
            }}
            className="mt-3 text-slate-600 hover:text-yellow-400 text-xs transition-colors"
            title="Click to see splash screen again"
          >
            🎬 Show Splash Screen
          </button>
        </div>
      </div>
    </div>
  );
}