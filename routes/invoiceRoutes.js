import express from 'express';
import { body } from 'express-validator';
import {
    getAllInvoices,
    getInvoice,
    createInvoice,
    updateInvoiceStatus,
    deleteInvoice,
    getDashboardStats,
} from '../controllers/invoiceController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

// Get dashboard stats
router.get('/stats', protect, getDashboardStats);

// Get all invoices
router.get('/', protect, getAllInvoices);

// Get single invoice
router.get('/:id', protect, getInvoice);

// Create invoice
router.post(
    '/',
    protect,
    [
        body('customer').notEmpty(),
        body('items').isArray({ min: 1 }),
        body('subtotal').isFloat({ min: 0 }),
        body('taxTotal').isFloat({ min: 0 }),
        body('grandTotal').isFloat({ min: 0 }),
        validate,
    ],
    createInvoice
);

// Update invoice status
router.patch(
    '/:id/status',
    protect,
    [body('status').isIn(['PAID', 'UNPAID', 'PENDING']), validate],
    updateInvoiceStatus
);

// Delete invoice
router.delete('/:id', protect, deleteInvoice);

export default router;
