import express from 'express';
import { createOrder } from '../app/controllers/orderController.js';

const router = express.Router();

router.post('/', createOrder);

export default router;
