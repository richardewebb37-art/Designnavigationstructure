import { projectId, publicAnonKey } from '/utils/supabase/info';
import { createClient } from '@supabase/supabase-js';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-30e38e62`;

// Initialize Supabase client
const supabaseUrl = `https://${projectId}.supabase.co`;
export const supabase = createClient(supabaseUrl, publicAnonKey);

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

// Auth API
export const authAPI = {
  async signUp(email: string, password: string, displayName: string, username: string) {
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
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    
    localStorage.removeItem('access_token');
  },

  async getSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    
    if (data.session?.access_token) {
      localStorage.setItem('access_token', data.session.access_token);
    }
    
    return data.session;
  },

  async getProfile() {
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