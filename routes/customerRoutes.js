import express from 'express';
import { body } from 'express-validator';
import {
    getAllCustomers,
    getCustomer,
    createCustomer,
    updateCustomer,
    deleteCustomer,
} from '../controllers/customerController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

// Get all customers
router.get('/', protect, getAllCustomers);

// Get single customer
router.get('/:id', protect, getCustomer);

// Create customer
router.post(
    '/',
    protect,
    [
        body('name').notEmpty().trim(),
        body('phone').notEmpty().trim(),
        body('email').optional().isEmail().normalizeEmail(),
        validate,
    ],
    createCustomer
);

// Update customer
router.put(
    '/:id',
    protect,
    [
        body('name').notEmpty().trim(),
        body('phone').notEmpty().trim(),
        body('email').optional().isEmail().normalizeEmail(),
        validate,
    ],
    updateCustomer
);

// Delete customer
router.delete('/:id', protect, deleteCustomer);

export default router;
