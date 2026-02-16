import Invoice from '../models/Invoice.js';
import Product from '../models/Product.js';
import { getNextSequence } from '../utils/getNextSequence.js';
import mongoose from 'mongoose';

// Get all invoices
export const getAllInvoices = async (req, res) => {
    try {
        const { search, status, startDate, endDate, customerId } = req.query;
        let query = {};

        if (search) {
            query.invoiceNumber = { $regex: search, $options: 'i' };
        }

        if (status) {
            query.status = status;
        }

        if (customerId) {
            query.customer = customerId;
        }

        if (startDate || endDate) {
            query.invoiceDate = {};
            if (startDate) query.invoiceDate.$gte = new Date(startDate);
            if (endDate) query.invoiceDate.$lte = new Date(endDate);
        }

        const invoices = await Invoice.find(query)
            .populate('customer', 'name phone email')
            .sort({ invoiceDate: -1 });

        res.json(invoices);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get single invoice
export const getInvoice = async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id)
            .populate('customer')
            .populate('items.product');

        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }

        res.json(invoice);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Create invoice
export const createInvoice = async (req, res) => {
    try {
        const { customer, items, subtotal, taxTotal, discount, grandTotal, status, invoiceDate } = req.body;

        // Validate stock availability
        for (const item of items) {
            const product = await Product.findById(item.product);

            if (!product) {
                return res.status(404).json({ message: `Product ${item.productName} not found` });
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({
                    message: `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`,
                });
            }
        }

        // Update stock
        for (const item of items) {
            await Product.findByIdAndUpdate(
                item.product,
                { $inc: { stock: -item.quantity } }
            );
        }

        // Generate invoice number
        const seq = await getNextSequence('invoice');
        const invoiceNumber = `INV-${String(seq).padStart(6, '0')}`;

        // Create invoice
        const invoice = await Invoice.create({
            invoiceNumber,
            customer,
            items,
            subtotal,
            taxTotal,
            discount,
            grandTotal,
            status: status || 'UNPAID',
            invoiceDate: invoiceDate || new Date(),
        });

        const populatedInvoice = await Invoice.findById(invoice._id)
            .populate('customer')
            .populate('items.product');

        res.status(201).json({ message: 'Invoice created', invoice: populatedInvoice });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update invoice status
export const updateInvoiceStatus = async (req, res) => {
    try {
        const { status } = req.body;

        if (!['PAID', 'UNPAID', 'PENDING'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const invoice = await Invoice.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        ).populate('customer');

        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }

        res.json({ message: 'Invoice status updated', invoice });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete invoice
export const deleteInvoice = async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id);

        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }

        // Restore stock
        for (const item of invoice.items) {
            await Product.findByIdAndUpdate(
                item.product,
                { $inc: { stock: item.quantity } }
            );
        }

        await Invoice.findByIdAndDelete(req.params.id);

        res.json({ message: 'Invoice deleted and stock restored' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get dashboard stats
export const getDashboardStats = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const totalInvoices = await Invoice.countDocuments();
        const todayInvoices = await Invoice.countDocuments({
            invoiceDate: { $gte: today },
        });

        const totalSalesResult = await Invoice.aggregate([
            { $group: { _id: null, total: { $sum: '$grandTotal' } } },
        ]);

        const todaySalesResult = await Invoice.aggregate([
            { $match: { invoiceDate: { $gte: today } } },
            { $group: { _id: null, total: { $sum: '$grandTotal' } } },
        ]);

        const pendingPayments = await Invoice.aggregate([
            { $match: { status: { $in: ['UNPAID', 'PENDING'] } } },
            { $group: { _id: null, total: { $sum: '$grandTotal' } } },
        ]);

        res.json({
            totalInvoices,
            todayInvoices,
            totalSales: totalSalesResult[0]?.total || 0,
            todaySales: todaySalesResult[0]?.total || 0,
            pendingPayments: pendingPayments[0]?.total || 0,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
