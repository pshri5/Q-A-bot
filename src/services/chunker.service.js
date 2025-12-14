class ChunkerService {
  chunkDocuments(documents, { chunkSize = 1000, chunkOverlap = 200 } = {}) {
    const chunks = [];
    let chunkId = 0;
    
    documents.forEach(doc => {
      const { url, title, text } = doc;
      
      // Skip if text is too short
      if (text.length < 100) return;
      
      // Split into chunks
      let startIndex = 0;
      while (startIndex < text.length) {
        const chunk = text.substring(
          startIndex, 
          Math.min(startIndex + chunkSize, text.length)
        );
        
        chunks.push({
          id: chunkId++,
          parentUrl: url,
          pageTitle: title,
          text: chunk,
          createdAt: new Date().toISOString()
        });
        
        startIndex += (chunkSize - chunkOverlap);
      }
    });
    
    console.log(`Created ${chunks.length} chunks from ${documents.length} documents`);
    return chunks;
  }
}

export default new ChunkerService();