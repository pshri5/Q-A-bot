import express from 'express';
import { crawlController, askController, regenerateEmbeddingsController } from './controllers.js';

const router = express.Router();

router.post('/crawl', crawlController);
router.post('/ask', askController);
router.post('/regenerate-embeddings', regenerateEmbeddingsController)

export default router;