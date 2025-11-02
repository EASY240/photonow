const { SitemapGenerator } = require('../generate-sitemap.cjs');
const fs = require('node:fs');
const path = require('node:path');

class SitemapScheduler {
  constructor(options = {}) {
    this.generator = new SitemapGenerator();
    this.interval = options.interval || 24 * 60 * 60 * 1000; // Default: 24 hours
    this.intervalId = null;
    this.logPath = path.resolve('./public/.sitemap-scheduler.log');
    this.isRunning = false;
  }

  // Log scheduler activities
  log(message, level = 'info') {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] [${level.toUpperCase()}] ${message}\n`;
    
    console.log(logEntry.trim());
    
    try {
      fs.appendFileSync(this.logPath, logEntry);
    } catch (error) {
      console.warn('Failed to write to log file:', error.message);
    }
  }

  // Generate sitemap with logging
  async generateWithLogging() {
    this.log('Starting scheduled sitemap generation');
    
    try {
      const result = await this.generator.generate();
      
      if (result.success) {
        this.log(`Sitemap generation completed: ${result.counts?.total || 'unknown'} URLs`);
        return result;
      } else {
        this.log(`Sitemap generation failed: ${result.message}`, 'error');
        return result;
      }
    } catch (error) {
      this.log(`Sitemap generation error: ${error.message}`, 'error');
      return { success: false, error };
    }
  }

  // Start scheduled generation
  start() {
    if (this.isRunning) {
      this.log('Scheduler is already running', 'warn');
      return;
    }

    this.log(`Starting sitemap scheduler with ${this.interval / 1000 / 60} minute intervals`);
    
    // Generate immediately on start
    this.generateWithLogging();
    
    // Schedule regular generations
    this.intervalId = setInterval(() => {
      this.generateWithLogging();
    }, this.interval);
    
    this.isRunning = true;
    this.log('Sitemap scheduler started successfully');
  }

  // Stop scheduled generation
  stop() {
    if (!this.isRunning) {
      this.log('Scheduler is not running', 'warn');
      return;
    }

    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    
    this.isRunning = false;
    this.log('Sitemap scheduler stopped');
  }

  // Get scheduler status
  getStatus() {
    return {
      isRunning: this.isRunning,
      interval: this.interval,
      intervalMinutes: this.interval / 1000 / 60,
      logPath: this.logPath
    };
  }

  // Setup graceful shutdown
  setupGracefulShutdown() {
    const shutdown = () => {
      console.log('\n🔄 Shutting down sitemap scheduler...');
      this.stop();
      process.exit(0);
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
    process.on('SIGQUIT', shutdown);
  }
}

// CLI execution
async function main() {
  const args = process.argv.slice(2);
  const intervalMinutes = parseInt(args.find(arg => arg.startsWith('--interval='))?.split('=')[1]) || 1440; // Default 24 hours
  
  const scheduler = new SitemapScheduler({
    interval: intervalMinutes * 60 * 1000
  });

  console.log('🚀 Starting sitemap scheduler...');
  console.log(`⏰ Interval: ${intervalMinutes} minutes`);
  console.log(`📝 Log file: ${scheduler.logPath}`);
  
  scheduler.start();
  scheduler.setupGracefulShutdown();

  console.log('🎯 Sitemap scheduler is running. Press Ctrl+C to stop.');
  
  // Keep the process alive
  process.stdin.resume();
}

// Export for programmatic use
module.exports = { SitemapScheduler };

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}