// Enhanced logging utility for debugging

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  category: string;
  message: string;
  data?: any;
}

class Logger {
  private logs: LogEntry[] = [];
  private maxLogs = 1000;

  private formatTimestamp(): string {
    const now = new Date();
    return now.toISOString();
  }

  private createLogEntry(level: LogLevel, category: string, message: string, data?: any): LogEntry {
    return {
      timestamp: this.formatTimestamp(),
      level,
      category,
      message,
      data,
    };
  }

  private addLog(entry: LogEntry) {
    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }
  }

  debug(category: string, message: string, data?: any) {
    const entry = this.createLogEntry('debug', category, message, data);
    this.addLog(entry);
    console.log(`🔍 [${category}] ${message}`, data || '');
  }

  info(category: string, message: string, data?: any) {
    const entry = this.createLogEntry('info', category, message, data);
    this.addLog(entry);
    console.log(`ℹ️ [${category}] ${message}`, data || '');
  }

  warn(category: string, message: string, data?: any) {
    const entry = this.createLogEntry('warn', category, message, data);
    this.addLog(entry);
    console.warn(`⚠️ [${category}] ${message}`, data || '');
  }

  error(category: string, message: string, error?: any) {
    const entry = this.createLogEntry('error', category, message, error);
    this.addLog(entry);
    console.error(`❌ [${category}] ${message}`, error || '');
  }

  // Get all logs
  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  // Get logs by level
  getLogsByLevel(level: LogLevel): LogEntry[] {
    return this.logs.filter(log => log.level === level);
  }

  // Get logs by category
  getLogsByCategory(category: string): LogEntry[] {
    return this.logs.filter(log => log.category === category);
  }

  // Clear logs
  clearLogs() {
    this.logs = [];
    console.log('🧹 Logs cleared');
  }

  // Export logs as JSON
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  // Print summary
  printSummary() {
    const summary = {
      total: this.logs.length,
      debug: this.logs.filter(l => l.level === 'debug').length,
      info: this.logs.filter(l => l.level === 'info').length,
      warn: this.logs.filter(l => l.level === 'warn').length,
      error: this.logs.filter(l => l.level === 'error').length,
    };
    console.table(summary);
  }
}

// Create singleton instance
export const logger = new Logger();

// Log categories
export const LogCategory = {
  APP: 'App',
  AUTH: 'Auth',
  API: 'API',
  NAVIGATION: 'Navigation',
  STORAGE: 'Storage',
  UI: 'UI',
  COMPONENT: 'Component',
  ERROR: 'Error',
  NETWORK: 'Network',
  STATE: 'State',
} as const;

// Export logger to window for debugging
if (typeof window !== 'undefined') {
  (window as any).logger = logger;
  console.log('📊 Logger available at window.logger');
  console.log('📝 Commands: logger.getLogs(), logger.printSummary(), logger.exportLogs(), logger.clearLogs()');
}
