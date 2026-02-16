import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Product name is required'],
            trim: true,
        },
        sku: {
            type: String,
            unique: true,
            sparse: true,
            trim: true,
        },
        barcode: {
            type: String,
            unique: true,
            sparse: true,
            trim: true,
        },
        price: {
            type: Number,
            required: [true, 'Price is required'],
            min: [0, 'Price cannot be negative'],
        },
        gstRate: {
            type: Number,
            required: [true, 'GST rate is required'],
            min: [0, 'GST rate cannot be negative'],
            max: [100, 'GST rate cannot exceed 100%'],
        },
        stock: {
            type: Number,
            required: [true, 'Stock quantity is required'],
            min: [0, 'Stock cannot be negative'],
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

// Index for search
productSchema.index({ name: 'text', sku: 'text', barcode: 'text' });

const Product = mongoose.model('Product', productSchema);

export default Product;
