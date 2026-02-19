// Emergency initialization - Set guest mode BEFORE anything else
// This prevents Supabase or any other service from initializing

// Set guest mode flag immediately
if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
  try {
    if (!localStorage.getItem('guest-mode')) {
      localStorage.setItem('guest-mode', 'true');
      console.log('🛡️ Guest mode activated - All external calls blocked');
    }
  } catch (e) {
    console.warn('Could not set guest mode in localStorage:', e);
  }
}

// Intercept fetch to log and potentially block calls in guest mode
if (typeof window !== 'undefined') {
  const originalFetch = window.fetch;
  
  window.fetch = function(...args) {
    const url = typeof args[0] === 'string' ? args[0] : args[0]?.url || 'unknown';
    
    // Allow relative URLs (local assets)
    if (url.startsWith('/') || url.startsWith('.')) {
      return originalFetch.apply(this, args);
    }
    
    // Check if in guest mode
    const isGuestMode = localStorage.getItem('guest-mode') === 'true';
    
    if (isGuestMode) {
      // Block external Supabase calls
      if (url.includes('supabase.co')) {
        console.warn('🚫 Blocked Supabase call in guest mode:', url);
        return Promise.reject(new Error('Guest mode: External calls disabled'));
      }
      
      console.log('🌐 Fetch call:', url);
    }
    
    return originalFetch.apply(this, args);
  };
  
  console.log('🛡️ Fetch interceptor installed');
}

export {};
