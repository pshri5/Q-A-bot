import cheerio from 'cheerio';

class ExtractorService {
  extractText(pages) {
    return pages.map(page => {
      const $ = cheerio.load(page.html);
      
      // Remove unwanted elements
      $('nav, header, footer, script, style, noscript, iframe, .cookie-banner, .ads').remove();
      
      // Extract text from body
      const bodyText = $('body').text();
      
      // Clean the text
      const cleanedText = this.cleanText(bodyText);
      
      return {
        url: page.url,
        title: page.title,
        text: cleanedText,
        extractedAt: new Date().toISOString()
      };
    });
  }
  
  cleanText(text) {
    return text
      .replace(/\s+/g, ' ')          // Replace multiple spaces with single space
      .replace(/\n+/g, '\n')         // Replace multiple newlines with single newline
      .replace(/\t+/g, ' ')          // Replace tabs with spaces
      .trim();                        // Remove leading/trailing whitespace
  }
}

export default new ExtractorService();