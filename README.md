# Q&A Bot

A Retrieval-Augmented Generation (RAG) based question answering system that crawls websites, indexes their content, and answers questions using the indexed information.

## Project Overview

This Q&A Bot leverages RAG architecture to provide accurate answers to questions based on crawled web content. The system works as follows:

1. **Web Crawling**: Crawls specified websites to collect page content
2. **Text Extraction**: Cleans HTML and extracts meaningful text
3. **Text Chunking**: Splits documents into manageable chunks
4. **Embedding Generation**: Creates vector representations of text chunks
5. **Vector Storage**: Stores embeddings in a vector database for efficient retrieval
6. **Question Answering**: Uses retrieved context to generate accurate answers

## Installation
Clone the repository
```
git clone https://github.com/pshri5/Q-A-bot.git
cd Q-A-bot
```
Install dependencies
```
npm install
```
Create a .env file by copying the .env.sample file and share the details

## Running the Application

Start the development server:
```
npm run dev
```
The server will start on port number set by the user.

## Steps to Run the Crawler

To crawl a website and index its content:

1. Make a POST request to the `/api/crawl` endpoint with the target website URL:
   ```
   curl -X POST http://localhost:3000/api/crawl   -H 'Content-Type: application/json'   -d '{"baseUrl": "https://example.com"}'
   ```
2. 2. The crawler will:
   - Visit pages on the specified domain (limited to 20 pages by default)
   - Extract and clean text content
   - Create text chunks
   - Generate embeddings
   - Store everything in the vector database

3. The response will include statistics about the crawling process:
   ```
   {
   "success": true,
   "message": "Successfully crawled and processed pages from https://example.com",
   "stats": {
    "pagesCount": 15,
    "chunksCount": 45,
    "embeddingsCount": 45
    }
   }
  
## Testing the /ask Endpoint

Once you've crawled a website, you can ask questions about its content:

1. Make a POST request to the `/api/ask` endpoint:

`curl -X POST http://localhost:3000/api/ask   -H 'Content-Type: application/json'   -d '{"question": "What is example.com about?"}'`

2. The system will:
   - Convert your question to an embedding
   - Retrieve the most relevant text chunks
   - Generate an answer based on those chunks
   - Return the answer along with source URLs

3. Sample response:
```
{
  "question": "What is example.com about?",
  "answer": "Example.com is a domain reserved for use in documentation as an example. It's maintained by the Internet Assigned Numbers Authority (IANA) and is not available for registration or use by individuals or organizations.",
  "sources": [
    "https://example.com/about",
    "https://example.com/"
  ]
}
```
   
