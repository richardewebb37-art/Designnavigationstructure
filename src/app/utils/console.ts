// Display welcome message and debugging info in console

export function displayWelcomeMessage() {
  const styles = {
    title: 'font-size: 24px; font-weight: bold; color: #fbbf24; text-shadow: 2px 2px 4px #000;',
    subtitle: 'font-size: 14px; color: #60a5fa; font-weight: bold;',
    info: 'font-size: 12px; color: #94a3b8;',
    success: 'font-size: 12px; color: #4ade80; font-weight: bold;',
    command: 'font-size: 11px; color: #a78bfa; font-family: monospace; background: #1e293b; padding: 2px 4px; border-radius: 3px;',
  };

  console.log('%c🦸 THE FICTIONVERSE 🦸', styles.title);
  console.log('%cby AlterOne Studio', styles.subtitle);
  console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', styles.info);
  console.log('%c✅ App loaded successfully', styles.success);
  console.log('%c🛡️ Guest Mode Active - External calls blocked', styles.success);
  console.log('%c📊 Logging & Error Tracking Active', styles.success);
  console.log('%c🛡️ Error Boundaries Enabled', styles.success);
  console.log('%c🚫 Fetch Interceptor Blocking Supabase', styles.success);
  console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', styles.info);
  console.log('\n%cDEBUGGING COMMANDS:', styles.subtitle);
  console.log('%clogger.getLogs()%c       - View all logs', styles.command, styles.info);
  console.log('%clogger.printSummary()%c - View log summary', styles.command, styles.info);
  console.log('%clogger.exportLogs()%c   - Export logs as JSON', styles.command, styles.info);
  console.log('%clogger.clearLogs()%c    - Clear all logs', styles.command, styles.info);
  console.log('\n%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', styles.info);
  
  // Display environment info
  console.log('\n%cENVIRONMENT INFO:', styles.subtitle);
  console.log('%cUser Agent:', styles.info, navigator.userAgent);
  console.log('%cScreen Size:', styles.info, `${window.innerWidth}x${window.innerHeight}`);
  console.log('%cNetwork Status:', styles.info, navigator.onLine ? '🌐 ONLINE' : '🔌 OFFLINE');
  console.log('%cGuest Mode:', styles.info, localStorage.getItem('guest-mode') === 'true' ? '✅ ACTIVE' : '❌ INACTIVE');
  console.log('%cOnboarding:', styles.info, localStorage.getItem('guestOnboardingComplete') === 'true' ? '✅ COMPLETED' : '❌ PENDING');
  
  console.log('\n%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', styles.info);
  console.log('%cHappy Writing! 📝✨', styles.subtitle);
  console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n', styles.info);
}

// Display error count periodically
export function startErrorMonitoring() {
  let lastErrorCount = 0;
  
  setInterval(() => {
    if (typeof window !== 'undefined' && (window as any).logger) {
      const logger = (window as any).logger;
      const errorLogs = logger.getLogsByLevel('error');
      
      if (errorLogs.length > lastErrorCount) {
        const newErrors = errorLogs.length - lastErrorCount;
        console.warn(`⚠️ ${newErrors} new error(s) detected. Run logger.getLogs() to view.`);
        lastErrorCount = errorLogs.length;
      }
    }
  }, 10000); // Check every 10 seconds
}