/**
 * Client-side utility for sitemap management
 */

export interface SitemapStats {
  totalUrls: number;
  breakdown: {
    staticPages: number;
    toolPages: number;
    blogArticles: number;
    images: number;
  };
  sitemapCount: number;
  lastGenerated: string | null;
  cacheValid: boolean;
  error?: string;
}

export interface SitemapResponse {
  success: boolean;
  message?: string;
  stats?: SitemapStats;
  timestamp: string;
  error?: string;
}

export interface WebhookPayload {
  action: 'published' | 'created' | 'updated' | 'deleted';
  type: 'blog' | 'article' | 'page' | 'tool' | 'image';
  id?: string;
  path?: string;
}

/**
 * Sitemap client for managing sitemap operations
 */
export class SitemapClient {
  private baseUrl: string;
  private adminToken?: string;

  constructor(baseUrl?: string, adminToken?: string) {
    this.baseUrl = baseUrl || (typeof window !== 'undefined' ? window.location.origin : '');
    this.adminToken = adminToken;
  }

  /**
   * Set admin token for authenticated requests
   */
  setAdminToken(token: string): void {
    this.adminToken = token;
  }

  /**
   * Get request headers with authentication
   */
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.adminToken) {
      headers['Authorization'] = `Bearer ${this.adminToken}`;
    }

    return headers;
  }

  /**
   * Handle API response
   */
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get sitemap statistics
   */
  async getStats(): Promise<SitemapStats> {
    const response = await fetch(`${this.baseUrl}/api/sitemap/stats`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    const data = await this.handleResponse<{ stats: SitemapStats }>(response);
    return data.stats;
  }

  /**
   * Regenerate sitemap manually
   */
  async regenerate(): Promise<SitemapResponse> {
    const response = await fetch(`${this.baseUrl}/api/sitemap/regenerate`, {
      method: 'POST',
      headers: this.getHeaders(),
    });

    return this.handleResponse<SitemapResponse>(response);
  }

  /**
   * Invalidate sitemap cache
   */
  async invalidateCache(): Promise<SitemapResponse> {
    const response = await fetch(`${this.baseUrl}/api/sitemap/invalidate`, {
      method: 'POST',
      headers: this.getHeaders(),
    });

    return this.handleResponse<SitemapResponse>(response);
  }

  /**
   * Send webhook to trigger sitemap update
   */
  async sendWebhook(payload: WebhookPayload): Promise<{ message: string; sitemapRegenerated: boolean }> {
    const response = await fetch(`${this.baseUrl}/api/sitemap/webhook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    return this.handleResponse<{ message: string; sitemapRegenerated: boolean }>(response);
  }

  /**
   * Check if sitemap is accessible
   */
  async checkSitemapAccess(): Promise<{ accessible: boolean; status: number; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/sitemap.xml`, {
        method: 'HEAD',
      });

      return {
        accessible: response.ok,
        status: response.status,
      };
    } catch (error) {
      return {
        accessible: false,
        status: 0,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Validate sitemap XML
   */
  async validateSitemap(): Promise<{ valid: boolean; urlCount: number; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/sitemap.xml`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const xmlText = await response.text();
      
      // Basic XML validation
      if (!xmlText.includes('<?xml') || !xmlText.includes('<urlset')) {
        throw new Error('Invalid XML format');
      }

      // Count URLs
      const urlMatches = xmlText.match(/<url>/g);
      const urlCount = urlMatches ? urlMatches.length : 0;

      return {
        valid: true,
        urlCount,
      };
    } catch (error) {
      return {
        valid: false,
        urlCount: 0,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}

/**
 * Default sitemap client instance
 */
export const sitemapClient = new SitemapClient();

/**
 * Hook for automatic sitemap updates
 */
export class SitemapUpdateHook {
  private client: SitemapClient;
  private enabled: boolean = true;

  constructor(client?: SitemapClient) {
    this.client = client || sitemapClient;
  }

  /**
   * Enable or disable automatic updates
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  /**
   * Trigger update for blog article changes
   */
  async onBlogArticleChange(action: WebhookPayload['action'], articleId?: string): Promise<void> {
    if (!this.enabled) return;

    try {
      await this.client.sendWebhook({
        action,
        type: 'blog',
        id: articleId,
      });
      console.log(`Sitemap updated for blog article ${action}:`, articleId);
    } catch (error) {
      console.error('Failed to update sitemap for blog article:', error);
    }
  }

  /**
   * Trigger update for page changes
   */
  async onPageChange(action: WebhookPayload['action'], pagePath?: string): Promise<void> {
    if (!this.enabled) return;

    try {
      await this.client.sendWebhook({
        action,
        type: 'page',
        path: pagePath,
      });
      console.log(`Sitemap updated for page ${action}:`, pagePath);
    } catch (error) {
      console.error('Failed to update sitemap for page:', error);
    }
  }

  /**
   * Trigger update for tool changes
   */
  async onToolChange(action: WebhookPayload['action'], toolId?: string): Promise<void> {
    if (!this.enabled) return;

    try {
      await this.client.sendWebhook({
        action,
        type: 'tool',
        id: toolId,
      });
      console.log(`Sitemap updated for tool ${action}:`, toolId);
    } catch (error) {
      console.error('Failed to update sitemap for tool:', error);
    }
  }

  /**
   * Trigger update for image changes
   */
  async onImageChange(action: WebhookPayload['action'], imagePath?: string): Promise<void> {
    if (!this.enabled) return;

    try {
      await this.client.sendWebhook({
        action,
        type: 'image',
        path: imagePath,
      });
      console.log(`Sitemap updated for image ${action}:`, imagePath);
    } catch (error) {
      console.error('Failed to update sitemap for image:', error);
    }
  }
}

/**
 * Default sitemap update hook instance
 */
export const sitemapUpdateHook = new SitemapUpdateHook();