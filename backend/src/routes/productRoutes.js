import express from 'express';
import { upload } from "../config/multer.js";
import {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} from '../app/controllers/productController.js';

const router = express.Router();

router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post("/", upload.single("image"), createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export default router;
