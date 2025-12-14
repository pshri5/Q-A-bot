import express from 'express';
import { crawlController, askController } from './controllers.js';

const router = express.Router();

router.post('/crawl', crawlController);
router.post('/ask', askController);

export default router;