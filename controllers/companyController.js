import Company from '../models/Company.js';

// Get company settings
export const getCompanySettings = async (req, res) => {
    try {
        let company = await Company.findOne();

        if (!company) {
            company = await Company.create({
                name: '',
                gstNumber: '',
                address: '',
                phone: '',
                email: '',
                logo: '',
            });
        }

        res.json(company);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update company settings
export const updateCompanySettings = async (req, res) => {
    try {
        const { name, gstNumber, address, phone, email } = req.body;

        let company = await Company.findOne();

        const updateData = {
            name: name || company?.name || '',
            gstNumber: gstNumber || company?.gstNumber || '',
            address: address || company?.address || '',
            phone: phone || company?.phone || '',
            email: email || company?.email || '',
        };

        if (req.file) {
            // Cloudinary returns the full URL in path
            updateData.logo = req.file.path;
        }

        if (company) {
            company = await Company.findByIdAndUpdate(company._id, updateData, { new: true });
        } else {
            company = await Company.create(updateData);
        }

        res.json({ message: 'Company settings updated', company });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
