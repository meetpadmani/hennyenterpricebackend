import express from 'express';
import { body } from 'express-validator';
import {
    getAllProducts,
    getProduct,
    getProductByBarcode,
    createProduct,
    updateProduct,
    deleteProduct,
} from '../controllers/productController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

// Get all products
router.get('/', protect, getAllProducts);

// Get product by barcode
router.get('/barcode/:barcode', protect, getProductByBarcode);

// Get single product
router.get('/:id', protect, getProduct);

// Create product
router.post(
    '/',
    protect,
    [
        body('name').notEmpty().trim(),
        body('price').isFloat({ min: 0 }),
        body('gstRate').isFloat({ min: 0, max: 100 }),
        body('stock').optional().isInt({ min: 0 }),
        validate,
    ],
    createProduct
);

// Update product
router.put(
    '/:id',
    protect,
    [
        body('name').notEmpty().trim(),
        body('price').isFloat({ min: 0 }),
        body('gstRate').isFloat({ min: 0, max: 100 }),
        body('stock').optional().isInt({ min: 0 }),
        validate,
    ],
    updateProduct
);

// Delete product
router.delete('/:id', protect, deleteProduct);

export default router;
