import { HNSWLib } from 'langchain/vectorstores/hnswlib';
import { OpenAIEmbeddings } from '@langchain/openai';
import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

class VectorDBService {
  constructor() {
    this.dbPath = './data/vectorstore';
    this.embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
      model: 'text-embedding-3-small'
    });
    this.vectorStore = null;
  }

  async initialize() {
    try {
      this.vectorStore = await HNSWLib.load(this.dbPath, this.embeddings);
      console.log('Vector store loaded from disk');
    } catch (error) {
      console.log('Creating new vector store...');
      this.vectorStore = new HNSWLib(this.embeddings, {
        space: 'cosine',
        numDimensions: 1536 // Dimensions for text-embedding-3-small
      });
    }
  }

  async addDocuments(documents) {
    if (!this.vectorStore) await this.initialize();
    
    const docs = documents.map(doc => ({
      pageContent: doc.text,
      metadata: {
        id: doc.id,
        url: doc.parentUrl,
        title: doc.pageTitle
      }
    }));
    
    await this.vectorStore.addDocuments(docs);
    await this.saveToFile();
    
    console.log(`Added ${docs.length} documents to vector store`);
  }
  
  async saveToFile() {
    await fs.mkdir(path.dirname(this.dbPath), { recursive: true });
    await this.vectorStore.save(this.dbPath);
    console.log('Vector store saved to disk');
  }
  
  async similaritySearch(query, k = 5) {
    if (!this.vectorStore) await this.initialize();
    
    const results = await this.vectorStore.similaritySearch(query, k);
    return results.map(doc => ({
      text: doc.pageContent,
      url: doc.metadata.url,
      title: doc.metadata.title
    }));
  }
}

export default new VectorDBService();