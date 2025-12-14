import crawlerService from '../services/crawler.service.js';
import extractorService from '../services/extractor.service.js';
import chunkerService from '../services/chunker.service.js';
import embeddingService from '../services/embedding.service.js';
import vectorDBService from '../services/vectordb.service.js';
import retrievalService from '../services/retrieval.service.js';

export const crawlController = async (req, res) => {
  try {
    const { baseUrl } = req.body;
    
    if (!baseUrl) {
      return res.status(400).json({ error: 'baseUrl is required' });
    }
    
    // Step 1: Crawl website
    console.log(`Starting to crawl: ${baseUrl}`);
    const pages = await crawlerService.crawlWebsite(baseUrl);
    
    // Step 2: Extract text
    console.log('Extracting text from HTML pages...');
    const documents = extractorService.extractText(pages);
    
    // Step 3: Chunk text
    console.log('Chunking documents...');
    const chunks = chunkerService.chunkDocuments(documents);
    
    // Step 4: Generate embeddings
    console.log('Generating embeddings...');
    const embeddedChunks = await embeddingService.generateEmbeddings(chunks);
    
    // Step 5: Store in vector database
    console.log('Storing in vector database...');
    await vectorDBService.addDocuments(embeddedChunks);
    
    return res.status(200).json({ 
      success: true, 
      message: `Successfully crawled and processed ${pages.length} pages from ${baseUrl}`,
      stats: {
        pagesCount: pages.length,
        chunksCount: chunks.length,
        embeddingsCount: embeddedChunks.length
      }
    });
  } catch (error) {
    console.error('Error in crawl endpoint:', error);
    return res.status(500).json({ error: error.message });
  }
};

export const askController = async (req, res) => {
  try {
    const { question } = req.body;
    
    if (!question) {
      return res.status(400).json({ error: 'question is required' });
    }
    
    const { answer, sources } = await retrievalService.generateAnswer(question);
    
    return res.status(200).json({
      question,
      answer,
      sources
    });
  } catch (error) {
    console.error('Error in ask endpoint:', error);
    return res.status(500).json({ error: error.message });
  }
};

export const regenerateEmbeddingsController = async (req, res) => {
  try {
    const { baseUrl } = req.body;
    
    if (!baseUrl) {
      return res.status(400).json({ error: 'baseUrl is required' });
    }
    
    // Step 1: Crawl website again
    console.log(`Starting fresh crawl for regenerating embeddings: ${baseUrl}`);
    const pages = await crawlerService.crawlWebsite(baseUrl);
    
    // Step 2: Extract text
    console.log('Extracting text from HTML pages...');
    const documents = extractorService.extractText(pages);
    
    // Step 3: Chunk text
    console.log('Chunking documents...');
    const chunks = chunkerService.chunkDocuments(documents);
    
    // Step 4: Generate new embeddings
    console.log('Regenerating embeddings...');
    const embeddedChunks = await embeddingService.generateEmbeddings(chunks);
    
    // Step 5: Reset vector database and store fresh embeddings
    console.log('Resetting vector database and storing fresh embeddings...');
    await vectorDBService.resetVectorStore();
    await vectorDBService.addDocuments(embeddedChunks);
    
    return res.status(200).json({ 
      success: true, 
      message: `Successfully regenerated embeddings for ${pages.length} pages from ${baseUrl}`,
      stats: {
        pagesCount: pages.length,
        chunksCount: chunks.length,
        embeddingsCount: embeddedChunks.length
      }
    });
  } catch (error) {
    console.error('Error in regenerate embeddings endpoint:', error);
    return res.status(500).json({ error: error.message });
  }
};

