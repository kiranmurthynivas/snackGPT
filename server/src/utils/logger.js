// Logging utility for SnackGPT server

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

class Logger {
  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
  }

  formatMessage(level, message, data = null) {
    const timestamp = new Date().toISOString();
    const levelColor = this.getLevelColor(level);
    const levelText = level.toUpperCase().padEnd(5);
    
    let formattedMessage = `${colors.bright}${levelColor}[${levelText}]${colors.reset} ${timestamp} - ${message}`;
    
    if (data && this.isDevelopment) {
      formattedMessage += `\n${colors.cyan}${JSON.stringify(data, null, 2)}${colors.reset}`;
    }
    
    return formattedMessage;
  }

  getLevelColor(level) {
    switch (level) {
      case 'error': return colors.red;
      case 'warn': return colors.yellow;
      case 'info': return colors.blue;
      case 'debug': return colors.magenta;
      case 'success': return colors.green;
      default: return colors.reset;
    }
  }

  error(message, data = null) {
    console.error(this.formatMessage('error', message, data));
  }

  warn(message, data = null) {
    console.warn(this.formatMessage('warn', message, data));
  }

  info(message, data = null) {
    console.info(this.formatMessage('info', message, data));
  }

  debug(message, data = null) {
    if (this.isDevelopment) {
      console.debug(this.formatMessage('debug', message, data));
    }
  }

  success(message, data = null) {
    console.log(this.formatMessage('success', message, data));
  }

  // Special logging for MCP operations
  mcp(method, data = null) {
    this.info(`MCP ${method}`, data);
  }

  // Special logging for recipe generation
  recipe(ingredients, mood, weather, style) {
    this.info('Recipe generation request', { ingredients, mood, weather, style });
  }

  // Special logging for AI responses
  ai(response, duration = null) {
    const logData = { response: response.substring(0, 200) + '...' };
    if (duration) logData.duration = `${duration}ms`;
    this.debug('AI response received', logData);
  }
}

// Singleton instance
const logger = new Logger();

module.exports = logger;
