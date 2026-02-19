import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Middleware to verify auth token
async function verifyAuth(authHeader: string | null) {
  console.log('🔐 verifyAuth called');
  console.log('📤 Auth header:', authHeader ? `Present (${authHeader.length} chars)` : 'NULL');
  
  if (!authHeader) {
    console.log('❌ No auth header provided');
    return null;
  }
  
  // Check if it starts with Bearer
  if (!authHeader.startsWith('Bearer ')) {
    console.log('❌ Auth header does not start with Bearer');
    return null;
  }
  
  const token = authHeader.substring(7); // Remove 'Bearer ' prefix
  if (!token) {
    console.log('❌ No token found after Bearer prefix');
    return null;
  }
  
  console.log('🔑 Token length:', token.length);
  console.log('🔑 Token preview:', token.substring(0, 30) + '...' + token.substring(token.length - 10));
  
  try {
    // Method 1: Try with admin client using getUser(jwt)
    console.log('🔧 Method 1: Trying admin.auth.getUser(jwt)...');
    const { data: adminData, error: adminError } = await supabaseAdmin.auth.getUser(token);
    
    if (!adminError && adminData?.user) {
      console.log('✅ Method 1 SUCCESS - User ID:', adminData.user.id);
      return adminData.user;
    }
    
    console.log('⚠️ Method 1 failed:', adminError?.message || 'No user returned');
    
    // Method 2: Try creating a client with the token in the session
    console.log('🔧 Method 2: Trying client with token in global headers...');
    const clientWithAuth = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: authHeader
        }
      }
    });
    
    const { data: clientData, error: clientError } = await clientWithAuth.auth.getUser();
    
    if (!clientError && clientData?.user) {
      console.log('✅ Method 2 SUCCESS - User ID:', clientData.user.id);
      return clientData.user;
    }
    
    console.log('⚠️ Method 2 failed:', clientError?.message || 'No user returned');
    
    // Method 3: Try setting the session directly
    console.log('🔧 Method 3: Trying setSession...');
    const clientForSession = createClient(supabaseUrl, supabaseAnonKey);
    const { data: sessionData, error: sessionError } = await clientForSession.auth.setSession({
      access_token: token,
      refresh_token: token, // Using same token as placeholder
    });
    
    if (!sessionError && sessionData?.user) {
      console.log('✅ Method 3 SUCCESS - User ID:', sessionData.user.id);
      return sessionData.user;
    }
    
    console.log('⚠️ Method 3 failed:', sessionError?.message || 'No user returned');
    
    // All methods failed
    console.log('❌ All verification methods failed');
    console.log('Admin error:', adminError);
    console.log('Client error:', clientError);
    console.log('Session error:', sessionError);
    
    return null;
  } catch (err) {
    console.log('❌ Exception in verifyAuth:', err);
    console.log('Exception stack:', err instanceof Error ? err.stack : 'No stack');
    return null;
  }
}

// Health check endpoint
app.get("/make-server-30e38e62/health", (c) => {
  return c.json({ status: "ok" });
});

// Debug endpoint to test auth
app.get("/make-server-30e38e62/debug/auth", async (c) => {
  const authHeader = c.req.header('Authorization');
  console.log('🔍 DEBUG AUTH ENDPOINT');
  console.log('Authorization header:', authHeader);
  
  if (!authHeader) {
    return c.json({ error: 'No auth header' }, 400);
  }
  
  const token = authHeader.split(' ')[1];
  console.log('Token extracted:', token ? `${token.substring(0, 50)}...` : 'NULL');
  console.log('Token length:', token?.length || 0);
  
  try {
    const { data, error } = await supabaseAdmin.auth.getUser(token);
    
    return c.json({
      success: !error,
      error: error ? { message: error.message, status: error.status, name: error.name } : null,
      user: data?.user ? { id: data.user.id, email: data.user.email } : null,
    });
  } catch (err) {
    return c.json({ error: 'Exception', details: String(err) }, 500);
  }
});

// Admin endpoint to clear all database data
app.post("/make-server-30e38e62/admin/clear-database", async (c) => {
  console.log('🗑️ CLEAR DATABASE ENDPOINT CALLED');
  
  try {
    // STEP 1: Delete all Supabase Auth users
    console.log('🔐 Step 1: Clearing Supabase Auth users...');
    const { data: authUsers, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (listError) {
      console.error('❌ Error listing auth users:', listError);
      return c.json({ error: 'Failed to list auth users', details: listError.message }, 500);
    }
    
    console.log(`📊 Found ${authUsers.users.length} auth users`);
    
    // Delete each auth user
    let deletedAuthUsers = 0;
    for (const user of authUsers.users) {
      try {
        const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(user.id);
        if (deleteError) {
          console.error(`❌ Failed to delete auth user ${user.id}:`, deleteError);
        } else {
          deletedAuthUsers++;
          console.log(`  ✓ Deleted auth user: ${user.email} (${user.id})`);
        }
      } catch (err) {
        console.error(`❌ Exception deleting auth user ${user.id}:`, err);
      }
    }
    
    console.log(`✅ Deleted ${deletedAuthUsers} auth users`);
    
    // STEP 2: Delete all KV store data
    console.log('📦 Step 2: Clearing KV store data...');
    const { data: allData, error: fetchError } = await supabaseAdmin
      .from('kv_store_30e38e62')
      .select('key');
    
    if (fetchError) {
      console.error('❌ Error fetching keys:', fetchError);
      return c.json({ error: 'Failed to fetch data', details: fetchError.message }, 500);
    }
    
    console.log('📊 Total KV keys found:', allData?.length || 0);
    
    let categorizedData = {
      users: 0,
      usernames: 0,
      stories: 0,
      preferences: 0,
      likes: 0,
      total: 0
    };
    
    if (allData && allData.length > 0) {
      // Categorize keys
      const userKeys: string[] = [];
      const usernameKeys: string[] = [];
      const storyKeys: string[] = [];
      const preferenceKeys: string[] = [];
      const likeKeys: string[] = [];
      
      for (const item of allData) {
        const key = item.key;
        if (key.startsWith('user:')) userKeys.push(key);
        else if (key.startsWith('username:')) usernameKeys.push(key);
        else if (key.startsWith('story:')) storyKeys.push(key);
        else if (key.startsWith('preferences:')) preferenceKeys.push(key);
        else if (key.startsWith('like:')) likeKeys.push(key);
      }
      
      categorizedData = {
        users: userKeys.length,
        usernames: usernameKeys.length,
        stories: storyKeys.length,
        preferences: preferenceKeys.length,
        likes: likeKeys.length,
        total: allData.length
      };
      
      console.log('📊 Categorized KV data:');
      console.log('  - Users:', userKeys.length);
      console.log('  - Usernames:', usernameKeys.length);
      console.log('  - Stories:', storyKeys.length);
      console.log('  - Preferences:', preferenceKeys.length);
      console.log('  - Likes:', likeKeys.length);
      
      // Delete all data using SQL for efficiency
      const { error: deleteError } = await supabaseAdmin
        .from('kv_store_30e38e62')
        .delete()
        .neq('key', '___IMPOSSIBLE___'); // This will match all rows
      
      if (deleteError) {
        console.error('❌ Error deleting KV data:', deleteError);
        return c.json({ error: 'Failed to delete KV data', details: deleteError.message }, 500);
      }
      
      console.log('✅ KV store cleared successfully');
    } else {
      console.log('✅ KV store was already empty');
    }
    
    console.log('✅ DATABASE FULLY CLEARED - Auth users and KV store data deleted');
    
    return c.json({ 
      success: true,
      message: 'Database and auth users cleared successfully',
      deleted: {
        authUsers: deletedAuthUsers,
        kvStore: categorizedData
      }
    });
  } catch (error) {
    console.error('❌ Error clearing database:', error);
    return c.json({ error: 'Failed to clear database', details: String(error) }, 500);
  }
});

// AUTH ROUTES

// Sign up
app.post("/make-server-30e38e62/auth/signup", async (c) => {
  try {
    const { email, password, displayName, username } = await c.req.json();
    
    if (!email || !password || !displayName || !username) {
      return c.json({ error: 'Missing required fields: email, password, displayName, username' }, 400);
    }
    
    // Check if username already exists
    const existingUser = await kv.get(`username:${username}`);
    if (existingUser) {
      return c.json({ error: 'Username already taken' }, 400);
    }
    
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      user_metadata: { 
        displayName,
        username,
        avatar: '✍️',
        bio: '',
        joinDate: new Date().toISOString(),
      },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });
    
    if (error) {
      console.log('Error creating user during signup flow:', error);
      return c.json({ error: error.message }, 400);
    }
    
    // Store username mapping
    await kv.set(`username:${username}`, data.user!.id);
    
    // Initialize user profile
    await kv.set(`user:${data.user!.id}`, {
      id: data.user!.id,
      username,
      displayName,
      avatar: '✍️',
      bio: '',
      joinDate: new Date().toISOString(),
      worksPublished: 0,
      totalLikes: 0,
      followers: 0,
      following: 0,
    });
    
    // Initialize user preferences
    await kv.set(`preferences:${data.user!.id}`, {
      hasCompletedOnboarding: false,
      theme: 'dark',
      notifications: true,
    });
    
    return c.json({ 
      user: data.user,
      message: 'User created successfully' 
    });
  } catch (error) {
    console.log('Unexpected error during signup:', error);
    return c.json({ error: 'Internal server error during signup' }, 500);
  }
});

// Get current user profile
app.get("/make-server-30e38e62/auth/profile", async (c) => {
  console.log('🔍 GET /auth/profile - Starting profile fetch...');
  
  const authHeader = c.req.header('Authorization');
  console.log('📤 Authorization header present:', !!authHeader);
  
  const user = await verifyAuth(authHeader);
  
  if (!user) {
    console.log('❌ Unauthorized - no valid user from token');
    return c.json({ error: 'Unauthorized' }, 401);
  }
  
  console.log('✅ User verified, ID:', user.id);
  
  try {
    let profile = await kv.get(`user:${user.id}`);
    console.log('📦 Profile from KV store:', profile ? 'Found' : 'Not found');
    
    // If profile doesn't exist, create one from user metadata
    if (!profile) {
      console.log('🔧 Profile not found, creating from user metadata...');
      console.log('👤 User metadata:', user.user_metadata);
      
      profile = {
        id: user.id,
        username: user.user_metadata?.username || user.email?.split('@')[0] || 'user',
        displayName: user.user_metadata?.displayName || user.email?.split('@')[0] || 'User',
        avatar: user.user_metadata?.avatar || '✍️',
        bio: user.user_metadata?.bio || '',
        joinDate: user.created_at || new Date().toISOString(),
        worksPublished: 0,
        totalLikes: 0,
        followers: 0,
        following: 0,
      };
      
      console.log('💾 Saving new profile:', profile);
      
      // Save the newly created profile
      await kv.set(`user:${user.id}`, profile);
      
      // Also create username mapping if doesn't exist
      const username = profile.username;
      const existingMapping = await kv.get(`username:${username}`);
      if (!existingMapping) {
        console.log('🔗 Creating username mapping:', username, '->', user.id);
        await kv.set(`username:${username}`, user.id);
      }
      
      // Create preferences if they don't exist
      const existingPrefs = await kv.get(`preferences:${user.id}`);
      if (!existingPrefs) {
        console.log('⚙️ Creating default preferences');
        await kv.set(`preferences:${user.id}`, {
          hasCompletedOnboarding: false,
          theme: 'dark',
          notifications: true,
        });
      }
    }
    
    console.log('✅ Returning profile:', profile);
    return c.json({ profile });
  } catch (error) {
    console.error('❌ Error in profile endpoint:', error);
    return c.json({ error: 'Internal server error while fetching profile' }, 500);
  }
});

// Update user profile
app.put("/make-server-30e38e62/auth/profile", async (c) => {
  const user = await verifyAuth(c.req.header('Authorization'));
  
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  
  try {
    const updates = await c.req.json();
    const currentProfile = await kv.get(`user:${user.id}`);
    
    if (!currentProfile) {
      return c.json({ error: 'Profile not found' }, 404);
    }
    
    const updatedProfile = {
      ...currentProfile,
      ...updates,
      id: user.id, // Prevent ID from being changed
      joinDate: currentProfile.joinDate, // Prevent join date from being changed
    };
    
    await kv.set(`user:${user.id}`, updatedProfile);
    
    return c.json({ profile: updatedProfile });
  } catch (error) {
    console.log('Error updating user profile:', error);
    return c.json({ error: 'Failed to update profile' }, 500);
  }
});

// STORY ROUTES

// Get all stories
app.get("/make-server-30e38e62/stories", async (c) => {
  try {
    const stories = await kv.getByPrefix('story:');
    return c.json({ stories: stories || [] });
  } catch (error) {
    console.log('Error fetching stories:', error);
    return c.json({ error: 'Failed to fetch stories' }, 500);
  }
});

// Get story by ID
app.get("/make-server-30e38e62/stories/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const story = await kv.get(`story:${id}`);
    
    if (!story) {
      return c.json({ error: 'Story not found' }, 404);
    }
    
    return c.json({ story });
  } catch (error) {
    console.log('Error fetching story:', error);
    return c.json({ error: 'Failed to fetch story' }, 500);
  }
});

// Get user's stories
app.get("/make-server-30e38e62/stories/user/:userId", async (c) => {
  try {
    const userId = c.req.param('userId');
    const allStories = await kv.getByPrefix('story:');
    const userStories = allStories.filter((story: any) => story.authorId === userId);
    
    return c.json({ stories: userStories });
  } catch (error) {
    console.log('Error fetching user stories:', error);
    return c.json({ error: 'Failed to fetch user stories' }, 500);
  }
});

// Create story
app.post("/make-server-30e38e62/stories", async (c) => {
  const user = await verifyAuth(c.req.header('Authorization'));
  
  if (!user) {
    return c.json({ error: 'Unauthorized - must be logged in to create stories' }, 401);
  }
  
  try {
    const storyData = await c.req.json();
    const storyId = crypto.randomUUID();
    
    const profile = await kv.get(`user:${user.id}`);
    
    const story = {
      id: storyId,
      ...storyData,
      authorId: user.id,
      author: profile?.username || user.email,
      likes: 0,
      views: 0,
      chapters: storyData.chapters || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    await kv.set(`story:${storyId}`, story);
    
    // Update user's works count
    if (profile) {
      await kv.set(`user:${user.id}`, {
        ...profile,
        worksPublished: (profile.worksPublished || 0) + 1,
      });
    }
    
    return c.json({ story, message: 'Story created successfully' });
  } catch (error) {
    console.log('Error creating story:', error);
    return c.json({ error: 'Failed to create story' }, 500);
  }
});

// Update story
app.put("/make-server-30e38e62/stories/:id", async (c) => {
  const user = await verifyAuth(c.req.header('Authorization'));
  
  if (!user) {
    return c.json({ error: 'Unauthorized - must be logged in to update stories' }, 401);
  }
  
  try {
    const id = c.req.param('id');
    const updates = await c.req.json();
    const existingStory = await kv.get(`story:${id}`);
    
    if (!existingStory) {
      return c.json({ error: 'Story not found' }, 404);
    }
    
    // Check if user owns the story
    if (existingStory.authorId !== user.id) {
      return c.json({ error: 'Forbidden - you can only update your own stories' }, 403);
    }
    
    const updatedStory = {
      ...existingStory,
      ...updates,
      id: existingStory.id, // Prevent ID from being changed
      authorId: existingStory.authorId, // Prevent author from being changed
      updatedAt: new Date().toISOString(),
    };
    
    await kv.set(`story:${id}`, updatedStory);
    
    return c.json({ story: updatedStory });
  } catch (error) {
    console.log('Error updating story:', error);
    return c.json({ error: 'Failed to update story' }, 500);
  }
});

// Delete story
app.delete("/make-server-30e38e62/stories/:id", async (c) => {
  const user = await verifyAuth(c.req.header('Authorization'));
  
  if (!user) {
    return c.json({ error: 'Unauthorized - must be logged in to delete stories' }, 401);
  }
  
  try {
    const id = c.req.param('id');
    const story = await kv.get(`story:${id}`);
    
    if (!story) {
      return c.json({ error: 'Story not found' }, 404);
    }
    
    // Check if user owns the story
    if (story.authorId !== user.id) {
      return c.json({ error: 'Forbidden - you can only delete your own stories' }, 403);
    }
    
    await kv.del(`story:${id}`);
    
    // Update user's works count
    const profile = await kv.get(`user:${user.id}`);
    if (profile) {
      await kv.set(`user:${user.id}`, {
        ...profile,
        worksPublished: Math.max(0, (profile.worksPublished || 1) - 1),
      });
    }
    
    return c.json({ message: 'Story deleted successfully' });
  } catch (error) {
    console.log('Error deleting story:', error);
    return c.json({ error: 'Failed to delete story' }, 500);
  }
});

// Like/Unlike story
app.post("/make-server-30e38e62/stories/:id/like", async (c) => {
  const user = await verifyAuth(c.req.header('Authorization'));
  
  if (!user) {
    return c.json({ error: 'Unauthorized - must be logged in to like stories' }, 401);
  }
  
  try {
    const storyId = c.req.param('id');
    const story = await kv.get(`story:${storyId}`);
    
    if (!story) {
      return c.json({ error: 'Story not found' }, 404);
    }
    
    const likeKey = `like:${user.id}:${storyId}`;
    const existingLike = await kv.get(likeKey);
    
    if (existingLike) {
      // Unlike
      await kv.del(likeKey);
      story.likes = Math.max(0, (story.likes || 0) - 1);
      await kv.set(`story:${storyId}`, story);
      return c.json({ liked: false, likes: story.likes });
    } else {
      // Like
      await kv.set(likeKey, { storyId, userId: user.id, timestamp: new Date().toISOString() });
      story.likes = (story.likes || 0) + 1;
      await kv.set(`story:${storyId}`, story);
      return c.json({ liked: true, likes: story.likes });
    }
  } catch (error) {
    console.log('Error toggling like on story:', error);
    return c.json({ error: 'Failed to like/unlike story' }, 500);
  }
});

// USER PREFERENCES

// Get user preferences (includes onboarding status)
app.get("/make-server-30e38e62/preferences", async (c) => {
  const user = await verifyAuth(c.req.header('Authorization'));
  
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  
  try {
    const prefs = await kv.get(`preferences:${user.id}`) || {
      hasCompletedOnboarding: false,
      theme: 'dark',
      notifications: true,
    };
    
    return c.json({ preferences: prefs });
  } catch (error) {
    console.log('Error fetching preferences:', error);
    return c.json({ error: 'Failed to fetch preferences' }, 500);
  }
});

// Update user preferences
app.put("/make-server-30e38e62/preferences", async (c) => {
  const user = await verifyAuth(c.req.header('Authorization'));
  
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  
  try {
    const updates = await c.req.json();
    const currentPrefs = await kv.get(`preferences:${user.id}`) || {};
    
    const updatedPrefs = {
      ...currentPrefs,
      ...updates,
    };
    
    await kv.set(`preferences:${user.id}`, updatedPrefs);
    
    return c.json({ preferences: updatedPrefs });
  } catch (error) {
    console.log('Error updating preferences:', error);
    return c.json({ error: 'Failed to update preferences' }, 500);
  }
});

Deno.serve(app.fetch);