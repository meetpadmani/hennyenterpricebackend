import express from 'express';
import multer from 'multer';
import path from 'path';
import { getCompanySettings, updateCompanySettings } from '../controllers/companyController.js';
import { protect } from '../middleware/auth.js';
import { storage } from '../config/cloudinaryConfig.js';

const router = express.Router();

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Only image files are allowed'));
    }
};

// Using Cloudinary storage instead of local disk storage
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter,
});

// Get company settings
router.get('/', protect, getCompanySettings);

// Update company settings
router.put('/', protect, upload.single('logo'), updateCompanySettings);

export default router;
