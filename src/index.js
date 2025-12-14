import express from 'express';
import dotenv from 'dotenv';
import routes from './api/routes.js';
import vectorDBService from './services/vectordb.service.js';

dotenv.config();

const app = express();
app.use(express.json());

// Initialize the vector database
vectorDBService.initialize().catch(console.error);

// API routes
app.use('/api', routes);

// Default route
app.get('/', (req, res) => {
  res.json({ message: 'Q&A Bot API is running' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});