const fs = require('node:fs');
const path = require('node:path');
const { SitemapGenerator } = require('../generate-sitemap.cjs');

class SitemapWatcher {
  constructor() {
    this.generator = new SitemapGenerator();
    this.watchers = [];
    this.debounceTimeout = null;
    this.debounceDelay = 2000; // 2 seconds debounce
    
    // Paths to watch
    this.watchPaths = [
      path.resolve('./content/blog'),
      path.resolve('./src/data/tools.ts'),
      path.resolve('./src/data/blogArticles.ts')
    ];
  }

  // Debounced sitemap generation
  debouncedGenerate() {
    if (this.debounceTimeout) {
      clearTimeout(this.debounceTimeout);
    }

    this.debounceTimeout = setTimeout(async () => {
      console.log('🔄 File changes detected, regenerating sitemap...');
      try {
        const result = await this.generator.generate(true); // Force regeneration
        if (result.success) {
          console.log('✅ Sitemap updated successfully');
        } else {
          console.error('❌ Sitemap update failed:', result.message);
        }
      } catch (error) {
        console.error('❌ Error during sitemap generation:', error);
      }
    }, this.debounceDelay);
  }

  // Start watching files
  startWatching() {
    console.log('🚀 Starting sitemap file watcher...');

    this.watchPaths.forEach(watchPath => {
      if (fs.existsSync(watchPath)) {
        const stats = fs.statSync(watchPath);
        
        if (stats.isDirectory()) {
          // Watch directory for file changes
          const watcher = fs.watch(watchPath, { recursive: true }, (eventType, filename) => {
            if (filename && filename.endsWith('.md')) {
              console.log(`📝 Blog article ${eventType}: ${filename}`);
              this.debouncedGenerate();
            }
          });
          
          this.watchers.push(watcher);
          console.log(`👀 Watching directory: ${watchPath}`);
        } else {
          // Watch individual file
          const watcher = fs.watch(watchPath, (eventType) => {
            console.log(`📄 Data file ${eventType}: ${path.basename(watchPath)}`);
            this.debouncedGenerate();
          });
          
          this.watchers.push(watcher);
          console.log(`👀 Watching file: ${watchPath}`);
        }
      } else {
        console.warn(`⚠️  Path not found: ${watchPath}`);
      }
    });

    console.log(`✅ File watcher started, monitoring ${this.watchers.length} paths`);
  }

  // Stop watching files
  stopWatching() {
    console.log('🛑 Stopping file watcher...');
    
    this.watchers.forEach(watcher => {
      watcher.close();
    });
    
    this.watchers = [];
    
    if (this.debounceTimeout) {
      clearTimeout(this.debounceTimeout);
      this.debounceTimeout = null;
    }
    
    console.log('✅ File watcher stopped');
  }

  // Handle graceful shutdown
  setupGracefulShutdown() {
    const shutdown = () => {
      console.log('\n🔄 Shutting down sitemap watcher...');
      this.stopWatching();
      process.exit(0);
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
    process.on('SIGQUIT', shutdown);
  }
}

// CLI execution
async function main() {
  const watcher = new SitemapWatcher();
  
  // Generate initial sitemap
  console.log('🚀 Generating initial sitemap...');
  const result = await watcher.generator.generate();
  
  if (result.success) {
    console.log('✅ Initial sitemap generated');
  } else {
    console.error('❌ Initial sitemap generation failed:', result.message);
    process.exit(1);
  }

  // Start watching for changes
  watcher.startWatching();
  watcher.setupGracefulShutdown();

  console.log('🎯 Sitemap watcher is running. Press Ctrl+C to stop.');
}

// Export for programmatic use
module.exports = { SitemapWatcher };

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}