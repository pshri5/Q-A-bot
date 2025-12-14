import { OpenAI } from '@langchain/openai';
import vectorDBService from './vectordb.service.js';
import { OpenAIEmbeddings } from '@langchain/openai';
import dotenv from 'dotenv';

dotenv.config();

class RetrievalService {
  constructor() {
    this.llm = new OpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY,
      model: 'gpt-3.5-turbo',
      temperature: 0
    });
    this.embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
      model: 'text-embedding-3-small'
    });
  }
  
  async getRelevantContext(query, k = 5) {
    return vectorDBService.similaritySearch(query, k);
  }
  
  async generateAnswer(query) {
    const relevantChunks = await this.getRelevantContext(query);
    
    if (relevantChunks.length === 0) {
      return {
        answer: "I couldn't find any relevant information to answer your question.",
        sources: []
      };
    }
    
    const context = relevantChunks.map(chunk => chunk.text).join('\n\n');
    const sources = [...new Set(relevantChunks.map(chunk => chunk.url))];
    
    const prompt = `
Answer the question based ONLY on the following context:
    
${context}

Question: ${query}

Remember:
1. Only use information from the context provided
2. If the answer is not in the context, say "I don't have enough information to answer this question"
3. Give concise, helpful answers
`;
    
    try {
      const response = await this.llm.call(prompt);
      
      return {
        answer: response,
        sources
      };
    } catch (error) {
      console.error('Error generating answer:', error);
      return {
        answer: "I encountered an error while trying to generate an answer.",
        sources: []
      };
    }
  }
}

export default new RetrievalService();