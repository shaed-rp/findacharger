/**
 * Centralized logging utility for the Charger Insights library
 * Provides consistent logging across all components with environment-based configuration
 */

export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
}

interface LogConfig {
  level: LogLevel;
  enableConsole: boolean;
  enableRemote: boolean;
  remoteEndpoint?: string;
}

class Logger {
  private config: LogConfig;
  private context: string;

  constructor(context: string = 'ChargerInsights') {
    this.context = context;
    this.config = this.getDefaultConfig();
  }

  private getDefaultConfig(): LogConfig {
    const isDevelopment = process.env.NODE_ENV === 'development';
    const isTest = process.env.NODE_ENV === 'test';
    
    return {
      level: isDevelopment ? LogLevel.DEBUG : LogLevel.INFO,
      enableConsole: isDevelopment || isTest,
      enableRemote: !isDevelopment && !isTest,
      remoteEndpoint: process.env.LOG_ENDPOINT,
    };
  }

  private shouldLog(level: LogLevel): boolean {
    return level <= this.config.level;
  }

  private formatMessage(level: string, message: string, data?: any): string {
    const timestamp = new Date().toISOString();
    const baseMessage = `[${timestamp}] [${level}] [${this.context}] ${message}`;
    
    if (data !== undefined) {
      return `${baseMessage} ${JSON.stringify(data, null, 2)}`;
    }
    
    return baseMessage;
  }

  private log(level: LogLevel, levelName: string, message: string, data?: any): void {
    if (!this.shouldLog(level)) return;

    const formattedMessage = this.formatMessage(levelName, message, data);

    if (this.config.enableConsole) {
      switch (level) {
        case LogLevel.ERROR:
          console.error(formattedMessage);
          break;
        case LogLevel.WARN:
          console.warn(formattedMessage);
          break;
        case LogLevel.INFO:
          console.info(formattedMessage);
          break;
        case LogLevel.DEBUG:
          console.debug(formattedMessage);
          break;
      }
    }

    if (this.config.enableRemote && this.config.remoteEndpoint) {
      this.sendToRemote(level, levelName, message, data);
    }
  }

  private async sendToRemote(level: LogLevel, levelName: string, message: string, data?: any): Promise<void> {
    try {
      const logEntry = {
        timestamp: new Date().toISOString(),
        level: levelName,
        context: this.context,
        message,
        data,
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'server',
        url: typeof window !== 'undefined' ? window.location.href : 'unknown',
      };

      await fetch(this.config.remoteEndpoint!, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(logEntry),
      });
    } catch (error) {
      // Fallback to console if remote logging fails
      console.error('Failed to send log to remote endpoint:', error);
    }
  }

  error(message: string, data?: any): void {
    this.log(LogLevel.ERROR, 'ERROR', message, data);
  }

  warn(message: string, data?: any): void {
    this.log(LogLevel.WARN, 'WARN', message, data);
  }

  info(message: string, data?: any): void {
    this.log(LogLevel.INFO, 'INFO', message, data);
  }

  debug(message: string, data?: any): void {
    this.log(LogLevel.DEBUG, 'DEBUG', message, data);
  }

  // Method to create a logger with a specific context
  withContext(context: string): Logger {
    const logger = new Logger(context);
    logger.config = this.config;
    return logger;
  }

  // Method to update configuration
  setConfig(config: Partial<LogConfig>): void {
    this.config = { ...this.config, ...config };
  }
}

// Create default logger instance
export const logger = new Logger();

// Export convenience functions
export const logError = (message: string, data?: any) => logger.error(message, data);
export const logWarn = (message: string, data?: any) => logger.warn(message, data);
export const logInfo = (message: string, data?: any) => logger.info(message, data);
export const logDebug = (message: string, data?: any) => logger.debug(message, data);

// Export logger instance and class for advanced usage
export { Logger };
export default logger;
