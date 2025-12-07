const fs = require('node:fs');
const path = require('node:path');
const matter = require('gray-matter');
const { SitemapGenerator } = require('../generate-sitemap.cjs');

class SitemapValidator {
  constructor() {
    this.generator = new SitemapGenerator();
    this.sitemapPath = path.resolve('./public/sitemap.xml');
    this.errors = [];
    this.warnings = [];
  }

  // Add error
  addError(message) {
    this.errors.push(message);
    console.error(`❌ ERROR: ${message}`);
  }

  // Add warning
  addWarning(message) {
    this.warnings.push(message);
    console.warn(`⚠️  WARNING: ${message}`);
  }

  // Check if sitemap file exists
  checkSitemapExists() {
    if (!fs.existsSync(this.sitemapPath)) {
      this.addError('Sitemap file does not exist at public/sitemap.xml');
      return false;
    }
    console.log('✅ Sitemap file exists');
    return true;
  }

  // Validate XML structure
  validateXMLStructure() {
    try {
      const content = fs.readFileSync(this.sitemapPath, 'utf8');
      
      // Basic XML validation
      if (!content.includes('<?xml version="1.0" encoding="UTF-8"?>')) {
        this.addError('Missing XML declaration');
      }

      if (!content.includes('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"')) {
        this.addError('Missing or incorrect urlset declaration');
      }

      if (!content.includes('</urlset>')) {
        this.addError('Missing closing urlset tag');
      }

      // Count URL entries
      const urlMatches = content.match(/<url>/g);
      const urlCount = urlMatches ? urlMatches.length : 0;
      
      if (urlCount === 0) {
        this.addError('No URLs found in sitemap');
      } else {
        console.log(`✅ Found ${urlCount} URLs in sitemap`);
      }

      return { valid: this.errors.length === 0, urlCount };
    } catch (error) {
      this.addError(`Failed to read sitemap: ${error.message}`);
      return { valid: false, urlCount: 0 };
    }
  }

  // Extract URLs from sitemap
  extractURLs() {
    try {
      const content = fs.readFileSync(this.sitemapPath, 'utf8');
      const urlRegex = /<loc>(.*?)<\/loc>/g;
      const urls = [];
      let match;

      while ((match = urlRegex.exec(content)) !== null) {
        urls.push(match[1]);
      }

      return urls;
    } catch (error) {
      this.addError(`Failed to extract URLs: ${error.message}`);
      return [];
    }
  }

  // Check for duplicate URLs
  checkDuplicates(urls) {
    const seen = new Set();
    const duplicates = [];

    urls.forEach(url => {
      if (seen.has(url)) {
        duplicates.push(url);
      } else {
        seen.add(url);
      }
    });

    if (duplicates.length > 0) {
      this.addError(`Found ${duplicates.length} duplicate URLs:`);
      duplicates.forEach(url => console.error(`  - ${url}`));
    } else {
      console.log('✅ No duplicate URLs found');
    }

    return duplicates.length === 0;
  }

  // Validate URL format
  validateURLFormat(urls) {
    const invalidUrls = [];
    const baseUrl = 'https://modernphototools.com';

    urls.forEach(url => {
      try {
        new URL(url);
        
        if (!url.startsWith(baseUrl)) {
          this.addWarning(`URL doesn't start with base URL: ${url}`);
        }
      } catch (error) {
        invalidUrls.push(url);
      }
    });

    if (invalidUrls.length > 0) {
      this.addError(`Found ${invalidUrls.length} invalid URLs:`);
      invalidUrls.forEach(url => console.error(`  - ${url}`));
    } else {
      console.log('✅ All URLs have valid format');
    }

    return invalidUrls.length === 0;
  }

  // Check if new articles are included
  async checkNewArticlesIncluded() {
    try {
      const blogDir = path.resolve('./content/blog');
      const files = fs.readdirSync(blogDir).filter(file => file.endsWith('.md'));
      const urls = this.extractURLs();
      const base = 'https://modernphototools.com/blog/';

      const missingArticles = [];

      for (const file of files) {
        const filePath = path.join(blogDir, file);
        const raw = fs.readFileSync(filePath, 'utf8');
        const { data } = matter(raw);

        const filenameId = file.replace('.md', '');
        const frontmatterId = (data && data.id) ? String(data.id).trim() : filenameId;

        const expectedUrlById = `${base}${frontmatterId}`;

        if (!urls.includes(expectedUrlById)) {
          missingArticles.push(filenameId);
        }
      }

      if (missingArticles.length > 0) {
        this.addError(`Found ${missingArticles.length} articles missing from sitemap:`);
        missingArticles.forEach(article => console.error(`  - ${article}`));
      } else {
        console.log('✅ All blog articles are included in sitemap');
      }

      return missingArticles.length === 0;
    } catch (error) {
      this.addError(`Failed to check articles: ${error.message}`);
      return false;
    }
  }

  // Check lastmod dates
  validateLastModDates() {
    try {
      const content = fs.readFileSync(this.sitemapPath, 'utf8');
      const lastmodRegex = /<lastmod>(.*?)<\/lastmod>/g;
      const invalidDates = [];
      let match;

      while ((match = lastmodRegex.exec(content)) !== null) {
        const dateStr = match[1];
        const date = new Date(dateStr);
        
        if (isNaN(date.getTime())) {
          invalidDates.push(dateStr);
        }
      }

      if (invalidDates.length > 0) {
        this.addError(`Found ${invalidDates.length} invalid lastmod dates:`);
        invalidDates.forEach(date => console.error(`  - ${date}`));
      } else {
        console.log('✅ All lastmod dates are valid');
      }

      return invalidDates.length === 0;
    } catch (error) {
      this.addError(`Failed to validate lastmod dates: ${error.message}`);
      return false;
    }
  }

  // Generate validation report
  generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      valid: this.errors.length === 0,
      errors: this.errors,
      warnings: this.warnings,
      summary: {
        totalErrors: this.errors.length,
        totalWarnings: this.warnings.length
      }
    };

    // Save report
    const reportPath = path.resolve('./public/.sitemap-validation-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    console.log(`\n📊 Validation Report:`);
    console.log(`   Errors: ${report.summary.totalErrors}`);
    console.log(`   Warnings: ${report.summary.totalWarnings}`);
    console.log(`   Status: ${report.valid ? '✅ VALID' : '❌ INVALID'}`);
    console.log(`   Report saved: ${reportPath}`);

    return report;
  }

  // Run complete validation
  async validate() {
    console.log('🔍 Starting sitemap validation...\n');

    // Check if sitemap exists
    if (!this.checkSitemapExists()) {
      return this.generateReport();
    }

    // Validate XML structure
    const xmlResult = this.validateXMLStructure();
    if (!xmlResult.valid) {
      return this.generateReport();
    }

    // Extract URLs
    const urls = this.extractURLs();
    if (urls.length === 0) {
      return this.generateReport();
    }

    // Run all validations
    this.checkDuplicates(urls);
    this.validateURLFormat(urls);
    await this.checkNewArticlesIncluded();
    this.validateLastModDates();

    return this.generateReport();
  }
}

// CLI execution
async function main() {
  const validator = new SitemapValidator();
  
  // Check if we should regenerate first
  const args = process.argv.slice(2);
  const shouldRegenerate = args.includes('--regenerate') || args.includes('-r');
  
  if (shouldRegenerate) {
    console.log('🔄 Regenerating sitemap before validation...');
    const result = await validator.generator.generate(true);
    
    if (!result.success) {
      console.error('❌ Failed to regenerate sitemap:', result.message);
      process.exit(1);
    }
    
    console.log('✅ Sitemap regenerated\n');
  }

  // Run validation
  const report = await validator.validate();
  
  // Exit with appropriate code
  process.exit(report.valid ? 0 : 1);
}

// Export for programmatic use
module.exports = { SitemapValidator };

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}
