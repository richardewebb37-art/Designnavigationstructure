import { projectId, publicAnonKey } from '/utils/supabase/info';
import { createClient } from '@supabase/supabase-js';
import { logger, LogCategory } from './logger';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-30e38e62`;

// Lazy initialization - only create Supabase client when actually needed (not in guest mode)
let supabaseClient: ReturnType<typeof createClient> | null = null;

function getSupabaseClient() {
  // Never initialize in guest mode
  if (isGuestMode()) {
    logger.debug(LogCategory.API, 'Supabase client not initialized - guest mode active');
    return null;
  }
  
  if (!supabaseClient) {
    const supabaseUrl = `https://${projectId}.supabase.co`;
    supabaseClient = createClient(supabaseUrl, publicAnonKey);
    logger.info(LogCategory.API, 'Supabase client initialized');
  }
  
  return supabaseClient;
}

// Export for external use, but it will return null in guest mode
export const supabase = new Proxy({} as ReturnType<typeof createClient>, {
  get(target, prop) {
    const client = getSupabaseClient();
    if (!client) {
      logger.warn(LogCategory.API, `Attempted to access supabase.${String(prop)} in guest mode`);
      // Return a no-op function to prevent errors
      return () => Promise.resolve({ data: null, error: new Error('Guest mode: Supabase disabled') });
    }
    return (client as any)[prop];
  }
});

// Helper function to get headers
function getHeaders(includeAuth: boolean = false) {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (includeAuth) {
    const token = localStorage.getItem('access_token');
    console.log('🔑 getHeaders - includeAuth=true');
    console.log('  - Token in localStorage:', token ? 'YES' : 'NO');
    if (token) {
      console.log('  - Token length:', token.length);
      console.log('  - Token preview (first 50 chars):', token.substring(0, 50) + '...');
      headers['Authorization'] = `Bearer ${token}`;
      console.log('  - Authorization header set');
    } else {
      console.log('  - ⚠️ No token found in localStorage!');
    }
  } else {
    headers['Authorization'] = `Bearer ${publicAnonKey}`;
  }
  
  return headers;
}

// Check if we're in guest mode
function isGuestMode(): boolean {
  return localStorage.getItem('guest-mode') === 'true';
}

// Auth API
export const authAPI = {
  async signUp(email: string, password: string, displayName: string, username: string) {
    // Skip in guest mode
    if (isGuestMode()) {
      console.log('Guest mode: Sign up skipped');
      throw new Error('Sign up is disabled in guest mode');
    }
    
    const response = await fetch(`${API_BASE}/auth/signup`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email, password, displayName, username }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Sign up failed');
    }
    
    return response.json();
  },

  async signIn(email: string, password: string) {
    // Skip in guest mode
    if (isGuestMode()) {
      console.log('Guest mode: Sign in skipped');
      throw new Error('Sign in is disabled in guest mode');
    }
    
    console.log('🔐 Signing in with email:', email);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error('❌ Sign in error:', error);
      throw error;
    }
    
    console.log('✅ Sign in successful');
    console.log('📦 Session data:', data.session ? 'Present' : 'Missing');
    console.log('👤 User data:', data.user ? 'Present' : 'Missing');
    
    if (data.session?.access_token) {
      console.log('🔑 Access token received:', data.session.access_token.substring(0, 30) + '...');
      console.log('💾 Storing token in localStorage...');
      localStorage.setItem('access_token', data.session.access_token);
      console.log('✅ Token stored successfully');
      
      // Verify token was stored
      const storedToken = localStorage.getItem('access_token');
      console.log('🔍 Verification - token in storage:', storedToken ? 'YES' : 'NO');
    } else {
      console.error('❌ No access token in session!');
      console.log('Session object:', data.session);
    }
    
    return data;
  },

  async signOut() {
    // Skip in guest mode
    if (isGuestMode()) {
      console.log('Guest mode: Sign out skipped');
      return;
    }
    
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    
    localStorage.removeItem('access_token');
  },

  async getSession() {
    // Skip in guest mode
    if (isGuestMode()) {
      console.log('Guest mode: Get session skipped');
      return null;
    }
    
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    
    if (data.session?.access_token) {
      localStorage.setItem('access_token', data.session.access_token);
    }
    
    return data.session;
  },

  async getProfile() {
    // Skip in guest mode
    if (isGuestMode()) {
      console.log('Guest mode: Get profile skipped');
      throw new Error('Profile fetch is disabled in guest mode');
    }
    
    console.log('🌐 Fetching profile from:', `${API_BASE}/auth/profile`);
    const headers = getHeaders(true);
    console.log('📤 Request headers:', headers);
    
    try {
      const response = await fetch(`${API_BASE}/auth/profile`, {
        headers,
      });
      
      console.log('📥 Response status:', response.status, response.statusText);
      
      if (!response.ok) {
        let errorMessage = 'Failed to fetch profile';
        try {
          const error = await response.json();
          console.error('❌ Error response body:', error);
          errorMessage = error.error || errorMessage;
        } catch (e) {
          // Response wasn't JSON, get text instead
          try {
            const responseText = await response.text();
            console.error('❌ Response text:', responseText);
            errorMessage = `Failed to fetch profile: ${response.status} ${response.statusText}`;
          } catch (textError) {
            console.error('❌ Could not read response:', textError);
          }
        }
        
        // If we get a 401, the token is invalid - try to refresh the session
        if (response.status === 401) {
          console.log('⚠️ Got 401, attempting to refresh session...');
          try {
            const session = await this.getSession();
            if (session?.access_token) {
              console.log('🔄 Got fresh session, retrying profile fetch...');
              localStorage.setItem('access_token', session.access_token);
              
              // Retry the request with the new token
              const retryHeaders = getHeaders(true);
              const retryResponse = await fetch(`${API_BASE}/auth/profile`, {
                headers: retryHeaders,
              });
              
              if (retryResponse.ok) {
                const data = await retryResponse.json();
                console.log('✅ Profile fetched successfully after retry:', data);
                return data;
              }
            }
          } catch (refreshError) {
            console.error('❌ Failed to refresh session:', refreshError);
          }
        }
        
        console.error('Profile fetch error:', errorMessage);
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      console.log('✅ Profile fetched successfully:', data);
      return data;
    } catch (error) {
      console.error('❌ Network or fetch error:', error);
      throw error;
    }
  },

  async updateProfile(updates: any) {
    // Mock in guest mode - update local context only
    if (isGuestMode()) {
      console.log('Guest mode: Profile update mocked', updates);
      // Return mock success with updated profile
      return { 
        profile: {
          id: 'guest-user',
          username: 'guest',
          ...updates
        }
      };
    }
    
    const response = await fetch(`${API_BASE}/auth/profile`, {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify(updates),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update profile');
    }
    
    return response.json();
  },
};

// Story API
export const storyAPI = {
  async getAll() {
    // Mock in guest mode
    if (isGuestMode()) {
      console.log('Guest mode: Get all stories mocked');
      return { stories: [] };
    }
    
    const response = await fetch(`${API_BASE}/stories`, {
      headers: getHeaders(),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch stories');
    }
    
    return response.json();
  },

  async getById(id: string) {
    // Mock in guest mode
    if (isGuestMode()) {
      console.log('Guest mode: Get story by ID mocked');
      return { story: null };
    }
    
    const response = await fetch(`${API_BASE}/stories/${id}`, {
      headers: getHeaders(),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch story');
    }
    
    return response.json();
  },

  async getUserStories(userId: string) {
    // Mock in guest mode
    if (isGuestMode()) {
      console.log('Guest mode: Get user stories mocked');
      return { stories: [] };
    }
    
    const response = await fetch(`${API_BASE}/stories/user/${userId}`, {
      headers: getHeaders(),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch user stories');
    }
    
    return response.json();
  },

  async create(storyData: any) {
    // Mock in guest mode
    if (isGuestMode()) {
      console.log('Guest mode: Create story mocked', storyData);
      return { 
        story: {
          id: `guest-story-${Date.now()}`,
          ...storyData,
          likes: 0,
          views: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        message: 'Story created in guest mode (not saved to database)'
      };
    }
    
    const response = await fetch(`${API_BASE}/stories`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(storyData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create story');
    }
    
    return response.json();
  },

  async update(id: string, updates: any) {
    // Mock in guest mode
    if (isGuestMode()) {
      console.log('Guest mode: Update story mocked', id, updates);
      return { 
        story: {
          id,
          ...updates,
          updatedAt: new Date().toISOString()
        }
      };
    }
    
    const response = await fetch(`${API_BASE}/stories/${id}`, {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify(updates),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update story');
    }
    
    return response.json();
  },

  async delete(id: string) {
    // Mock in guest mode
    if (isGuestMode()) {
      console.log('Guest mode: Delete story mocked', id);
      return { message: 'Story deleted in guest mode (not saved to database)' };
    }
    
    const response = await fetch(`${API_BASE}/stories/${id}`, {
      method: 'DELETE',
      headers: getHeaders(true),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete story');
    }
    
    return response.json();
  },

  async toggleLike(id: string) {
    // Mock in guest mode
    if (isGuestMode()) {
      console.log('Guest mode: Toggle like mocked', id);
      return { liked: true, likes: 0 };
    }
    
    const response = await fetch(`${API_BASE}/stories/${id}/like`, {
      method: 'POST',
      headers: getHeaders(true),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to like/unlike story');
    }
    
    return response.json();
  },
};

// Preferences API
export const preferencesAPI = {
  async get() {
    // Return mock data in guest mode
    if (isGuestMode()) {
      return {
        preferences: {
          notifications: true,
          theme: 'dark',
          hasCompletedOnboarding: localStorage.getItem('guestOnboardingComplete') === 'true'
        }
      };
    }
    
    const response = await fetch(`${API_BASE}/preferences`, {
      headers: getHeaders(true),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch preferences');
    }
    
    return response.json();
  },

  async update(updates: any) {
    // Mock update in guest mode  
    if (isGuestMode()) {
      console.log('Guest mode: Preferences update skipped', updates);
      return { success: true };
    }
    
    const response = await fetch(`${API_BASE}/preferences`, {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify(updates),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update preferences');
    }
    
    return response.json();
  },
};