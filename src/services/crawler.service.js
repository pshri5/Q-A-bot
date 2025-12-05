import axios from 'axios';
import cheerio from 'cheerio';
import { URL } from 'url';

class CrawlerService {
  async crawlWebsite(baseUrl, options = {}) {
    // Default options
    const {
      maxPages = 20,
      maxDepth = 3,
      skipPatterns = [
        /login/, /signin/, /signup/, /register/, 
        /cart/, /checkout/, /account/, /profile/,
        /admin/, /dashboard/
      ]
    } = options;
    
    const visited = new Set();
    const pages = [];
    // Queue items include URL and depth
    const queue = [{ url: baseUrl, depth: 0 }];

    console.log(`Starting to crawl ${baseUrl}`);

    while (queue.length > 0 && visited.size < maxPages) {
      const { url, depth } = queue.shift();
      
      if (visited.has(url)) {
        continue;
      }
      
      // Skip URLs matching any patterns
      if (skipPatterns.some(pattern => pattern.test(url))) {
        console.log(`Skipping page (matched skip pattern): ${url}`);
        continue;
      }

      try {
        console.log(`Crawling page: ${url} (depth: ${depth})`);
        const response = await axios.get(url, { 
          timeout: 10000,
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; RAGBot/1.0)'
          }
        });
        
        const $ = cheerio.load(response.data);
        
        // Extract title
        const title = $('title').text() || url;
        
        // Store page data with raw HTML
        pages.push({
          url,
          title,
          html: response.data,
          crawledAt: new Date().toISOString()
        });

        visited.add(url);
        
        // Only continue crawling if we haven't reached max depth
        if (depth < maxDepth) {
          // Find all links on the page
          $('a[href]').each((_, element) => {
            try {
              const href = $(element).attr('href');
              if (!href || href.startsWith('#') || href.startsWith('javascript:')) {
                return;
              }
              
              // Create absolute URL
              const absoluteUrl = new URL(href, url).href;
              
              // Skip external domains, already visited pages, and URLs in the queue
              if (new URL(absoluteUrl).hostname === new URL(baseUrl).hostname && 
                  !visited.has(absoluteUrl) && 
                  !queue.some(item => item.url === absoluteUrl)) {
                queue.push({ url: absoluteUrl, depth: depth + 1 });
              }
            } catch (error) {
              // Skip invalid URLs
            }
          });
        }
      } catch (error) {
        console.error(`Error crawling ${url}: ${error.message}`);
      }
    }

    console.log(`Crawling completed. Visited ${pages.length} pages.`);
    return pages;
  }
}

export default new CrawlerService();