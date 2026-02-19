# The Fictionverse - Debugging Guide

## 🛡️ Error Handling & Debugging Features

This app now includes comprehensive error handling, logging, and debugging capabilities.

## ✅ What's Been Added

### 1. **Error Boundaries**
- **Top-level Error Boundary**: Catches any unhandled errors in the entire app
- **Page-level Error Boundaries**: Each page has its own error boundary
- **Graceful Fallbacks**: User-friendly error messages with retry options

### 2. **Comprehensive Logging System**
- All app activity is logged with timestamps
- Categories: App, Auth, API, Navigation, Storage, UI, Component, Error, Network, State
- Logs stored in memory (max 1000 entries)
- Accessible via browser console

### 3. **Global Error Handlers**
- Catches unhandled promise rejections
- Catches uncaught JavaScript errors
- Monitors network connectivity changes
- Logs all errors with full context

### 4. **Enhanced API Error Handling**
- All API calls are wrapped with try-catch
- Guest mode bypasses all real API calls
- Network errors are detected and logged
- Retry logic available for flaky operations

### 5. **Console Debugging Tools**
- Welcome message with system info
- Real-time error monitoring
- Easy-to-use logging commands
- Environment information display

## 🔧 How to Use Debugging Tools

### Browser Console Commands

Open browser console (F12) and use these commands:

```javascript
// View all logs
logger.getLogs()

// View log summary by type
logger.printSummary()

// Export logs as JSON
logger.exportLogs()

// Clear logs
logger.clearLogs()

// Get errors only
logger.getLogsByLevel('error')

// Get logs by category
logger.getLogsByCategory('API')
```

### Understanding Log Categories

- **App**: Application lifecycle events
- **Auth**: Authentication and user session
- **API**: Backend API calls
- **Navigation**: Page navigation
- **Storage**: LocalStorage operations
- **UI**: User interface interactions
- **Component**: Component lifecycle
- **Error**: Error events
- **Network**: Network connectivity
- **State**: State management

### Console Output

The console will automatically display:
- ✅ Success messages (green)
- ℹ️ Info messages (blue)
- ⚠️ Warning messages (yellow)
- ❌ Error messages (red)
- 🔍 Debug messages (gray)

## 🐛 Common Issues & Solutions

### Issue: "TypeError: Failed to fetch"

**This is likely a Figma devtools error, not your app!**

The error comes from Figma's internal systems. Your app is NOT causing this.

**What to try:**
1. Hard refresh: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
2. Clear browser cache for Figma
3. Close and reopen Figma Make
4. Check internet connection stability

### Issue: App not loading or blank screen

**Check the console:**
1. Press F12 to open DevTools
2. Look for error messages
3. Run `logger.getLogs()` to see what happened
4. Look for the last logged page in the Navigation category

**Common causes:**
- JavaScript error in a component → Error boundary will catch it
- Network issue → Check offline status
- Browser compatibility → Check console for unsupported features

### Issue: Components not rendering

**Debug steps:**
1. Check browser console for errors
2. Run `logger.getLogsByCategory('Component')`
3. Look for the PageErrorBoundary fallback
4. Check if the page exists in the renderPage() switch statement

### Issue: Data not saving

**Remember: You're in GUEST MODE!**
- All data is mock data
- Changes don't persist to a database
- This is intentional for demo purposes

**To verify:**
- Check `localStorage.getItem('guest-mode')` → should return `"true"`
- All API calls are bypassed when in guest mode
- Look for "Guest mode:" messages in console

## 📊 Monitoring App Health

### Check Current Status

```javascript
// Check if app is in guest mode
localStorage.getItem('guest-mode') === 'true'

// Check network status
navigator.onLine

// Check for errors
logger.getLogsByLevel('error')

// View last 10 logs
logger.getLogs().slice(-10)
```

### Export Logs for Support

If you need to share logs:

```javascript
// Copy this output
console.log(logger.exportLogs())

// Or save to variable
const logs = logger.exportLogs()
// Then paste into a file
```

## 🚨 Error Boundary Features

If a component crashes:
1. **Error Details** are displayed
2. **Technical Details** can be expanded
3. **Try Again** button attempts to recover
4. **Go Home** button navigates safely home
5. **Error is logged** to the logger system

## 🔍 Performance Monitoring

The app logs:
- Page load time
- Navigation changes
- Component render errors
- API call timing (when not in guest mode)

## 📱 Mobile Debugging

On mobile devices:
- Use Remote Debugging for Chrome/Safari
- Error boundaries still work
- Touch-friendly error screens
- Responsive error UI

## 🎯 Best Practices

1. **Always check console first** - Most issues show up there
2. **Use logger commands** - They provide structured information
3. **Check network status** - Many issues are connectivity-related
4. **Clear cache regularly** - Prevents stale data issues
5. **Look for error boundaries** - They catch render errors gracefully

## 🔐 Privacy & Security

- Logs are stored locally in browser memory
- No sensitive data is logged (passwords, tokens, etc.)
- Logs clear on page refresh
- Guest mode prevents actual API calls

## 📝 Adding Custom Logging

To add logging to your code:

```typescript
import { logger, LogCategory } from './utils/logger';

// Info log
logger.info(LogCategory.UI, 'Button clicked', { buttonId: 'submit' });

// Warning log
logger.warn(LogCategory.API, 'Slow response time', { duration: 5000 });

// Error log
logger.error(LogCategory.ERROR, 'Failed to save', error);

// Debug log
logger.debug(LogCategory.COMPONENT, 'Component mounted', { props });
```

## 🎓 For Developers

### Error Boundary Props

```typescript
<ErrorBoundary
  onError={(error, errorInfo) => {
    // Custom error handling
  }}
  fallback={<CustomErrorUI />}
>
  {children}
</ErrorBoundary>
```

### Safe Error Handling

```typescript
import { withErrorHandling, withRetry } from './utils/errorHandler';

// Wrap async operations
const data = await withErrorHandling(
  () => fetchData(),
  'Fetching user data'
);

// With retry logic
const result = await withRetry(
  () => unstableOperation(),
  { maxRetries: 3, delay: 1000, context: 'API call' }
);
```

## 🆘 Getting Help

If you encounter persistent issues:

1. Export your logs: `logger.exportLogs()`
2. Note the exact error message
3. Check the browser console screenshot
4. Describe what you were doing when it happened
5. Include browser and OS info

## ✨ Features Summary

✅ Comprehensive error boundaries
✅ Structured logging system  
✅ Global error handlers
✅ Network monitoring
✅ Console debugging tools
✅ Error recovery mechanisms
✅ User-friendly error messages
✅ Performance monitoring
✅ Safe localStorage operations
✅ Retry logic for flaky operations

---

**Remember**: The app is running in Guest Mode with all backend calls mocked. This is intentional and expected behavior!
