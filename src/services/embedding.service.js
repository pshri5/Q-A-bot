import { OpenAIEmbeddings } from '@langchain/openai';
import dotenv from 'dotenv';

dotenv.config();

class EmbeddingService {
  constructor() {
    this.embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
      model: 'text-embedding-3-small'
    });
  }
  
  async generateEmbeddings(chunks) {
    console.log(`Generating embeddings for ${chunks.length} chunks...`);
    
    const results = [];
    
    // Process in batches to avoid rate limits
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      try {
        const embedding = await this.embeddings.embedQuery(chunk.text);
        results.push({
          ...chunk,
          embedding
        });
        
        if (i % 10 === 0) {
          console.log(`Processed ${i}/${chunks.length} embeddings`);
        }
      } catch (error) {
        console.error(`Error embedding chunk ${chunk.id}: ${error.message}`);
      }
    }
    
    console.log(`Completed generating ${results.length} embeddings`);
    return results;
  }
}

export default new EmbeddingService();