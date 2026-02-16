import mongoose from 'mongoose';

const companySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Company name is required'],
            trim: true,
        },
        gstNumber: {
            type: String,
            trim: true,
            uppercase: true,
        },
        address: {
            type: String,
            trim: true,
        },
        phone: {
            type: String,
            trim: true,
        },
        email: {
            type: String,
            trim: true,
            lowercase: true,
        },
        logo: {
            type: String,
            default: '',
        },
    },
    {
        timestamps: true,
    }
);

const Company = mongoose.model('Company', companySchema);

export default Company;
