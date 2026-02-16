import Product from '../models/Product.js';

// Get all products
export const getAllProducts = async (req, res) => {
    try {
        const { search } = req.query;
        let query = {};

        if (search) {
            query = {
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { sku: { $regex: search, $options: 'i' } },
                    { barcode: { $regex: search, $options: 'i' } },
                ],
            };
        }

        const products = await Product.find(query).sort({ createdAt: -1 });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get single product
export const getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get product by barcode
export const getProductByBarcode = async (req, res) => {
    try {
        const product = await Product.findOne({ barcode: req.params.barcode });

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Create product
export const createProduct = async (req, res) => {
    try {
        const { name, sku, barcode, price, gstRate, stock } = req.body;

        const product = await Product.create({
            name,
            sku,
            barcode,
            price,
            gstRate,
            stock,
        });

        res.status(201).json({ message: 'Product created', product });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'SKU or Barcode already exists' });
        }
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update product
export const updateProduct = async (req, res) => {
    try {
        const { name, sku, barcode, price, gstRate, stock } = req.body;

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            { name, sku, barcode, price, gstRate, stock },
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json({ message: 'Product updated', product });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'SKU or Barcode already exists' });
        }
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete product
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json({ message: 'Product deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
