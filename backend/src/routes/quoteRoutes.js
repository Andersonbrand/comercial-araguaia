import express from 'express';
import { createQuote } from '../app/controllers/quoteController.js';

const router = express.Router();

router.post('/', createQuote);

export default router;
