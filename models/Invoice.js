import mongoose from 'mongoose';

const invoiceItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    productName: String,
    quantity: {
        type: Number,
        required: true,
        min: [1, 'Quantity must be at least 1'],
    },
    price: {
        type: Number,
        required: true,
    },
    gstRate: {
        type: Number,
        required: true,
    },
    gstAmount: {
        type: Number,
        required: true,
    },
    total: {
        type: Number,
        required: true,
    },
});

const invoiceSchema = new mongoose.Schema(
    {
        invoiceNumber: {
            type: String,
            required: true,
            unique: true,
        },
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Customer',
            required: true,
        },
        items: [invoiceItemSchema],
        subtotal: {
            type: Number,
            required: true,
            min: 0,
        },
        taxTotal: {
            type: Number,
            required: true,
            min: 0,
        },
        discount: {
            type: Number,
            default: 0,
            min: 0,
        },
        grandTotal: {
            type: Number,
            required: true,
            min: 0,
        },
        status: {
            type: String,
            enum: ['PAID', 'UNPAID', 'PENDING'],
            default: 'UNPAID',
        },
        invoiceDate: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

// Index for search and filtering
invoiceSchema.index({ customer: 1 });
invoiceSchema.index({ invoiceDate: -1 });
invoiceSchema.index({ status: 1 });

const Invoice = mongoose.model('Invoice', invoiceSchema);

export default Invoice;
