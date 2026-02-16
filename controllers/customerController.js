import Customer from '../models/Customer.js';

// Get all customers
export const getAllCustomers = async (req, res) => {
    try {
        const { search } = req.query;
        let query = {};

        if (search) {
            query = {
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { phone: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } },
                ],
            };
        }

        const customers = await Customer.find(query).sort({ createdAt: -1 });
        res.json(customers);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get single customer
export const getCustomer = async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);

        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        res.json(customer);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Create customer
export const createCustomer = async (req, res) => {
    try {
        const { name, phone, email, address, gstNumber } = req.body;

        const customer = await Customer.create({
            name,
            phone,
            email,
            address,
            gstNumber,
        });

        res.status(201).json({ message: 'Customer created', customer });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update customer
export const updateCustomer = async (req, res) => {
    try {
        const { name, phone, email, address, gstNumber } = req.body;

        const customer = await Customer.findByIdAndUpdate(
            req.params.id,
            { name, phone, email, address, gstNumber },
            { new: true, runValidators: true }
        );

        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        res.json({ message: 'Customer updated', customer });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete customer
export const deleteCustomer = async (req, res) => {
    try {
        const customer = await Customer.findByIdAndDelete(req.params.id);

        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        res.json({ message: 'Customer deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
