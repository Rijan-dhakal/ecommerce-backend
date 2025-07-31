import {v2 as cloudinary} from 'cloudinary';
import Product from '../models/product.model.js';
import { error } from '../utils/error.js';

// add product
export const addProduct = async (req, res, next) => {
    try{

        const user = req.user._id; 
        if (!user) {
            return res.status(401).json({success: false, message: "Unauthorized"});
        }

        const { name, price, description, category, subCategory, bestseller } = req.body;

        if (!name || !price || !description || !category || !subCategory) throw error(400, "All fields are required");


        if (isNaN(price) || price < 0) throw error(400, "Invalid price");

        const image1 = req.files.image1 ? req.files.image1[0].filename : null;
        const image2 = req.files.image2 ? req.files.image2[0].filename : null;
        const image3 = req.files.image3 ? req.files.image3[0].filename : null;
        const image4 = req.files.image4 ? req.files.image4[0].filename : null;

        const images = [image1, image2, image3, image4].filter(item => item !== null); // Filter out null values

        let imagesUrl = await Promise.all(images.map(async (image) => {
            const result = await cloudinary.uploader.upload(`uploads/${image}`);
                return result.secure_url;
        })); 

        const productData = {
            user,
            name,
            price: Number(price),
            description,
            category,
            subCategory,
            bestseller: bestseller === 'true',
            image: imagesUrl, 
            date: Date.now() 
        }
        
        const product = new Product(productData);
        const resp = await product.save();

        if (!resp) throw error(500, "Failed to add products");

        res.status(201).json({success: true, message: "Product added successfully", product: resp})

    } catch (error) {
        next(error);
    }
}

// list product
export const listProducts = async (req, res, next) => {
    
}

// remove product
export const removeProduct = async (req, res, next) => {
    
}

// single product
export const singleProduct = async (req, res, next) => {
    
}       